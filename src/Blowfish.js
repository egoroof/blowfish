import { MODE, PADDING, TYPE, P, S0, S1, S2, S3 } from './constants';
import {
  isStringOrBuffer,
  includes,
  expandKey,
  toUint8Array,
  packFourBytes,
  unpackFourBytes,
  xor,
  pad,
  unpad,
  sumMod32,
} from './helpers';
import { u8ToString } from './encoding';

export default class Blowfish {
  static get MODE() {
    return MODE;
  }

  static get PADDING() {
    return PADDING;
  }

  static get TYPE() {
    return TYPE;
  }

  constructor(key, mode = MODE.ECB, padding = PADDING.PKCS5) {
    if (!isStringOrBuffer(key)) {
      throw new Error('Key should be a string or an ArrayBuffer / Buffer');
    }
    if (!includes(MODE, mode)) {
      throw new Error('Unsupported mode');
    }
    if (!includes(PADDING, padding)) {
      throw new Error('Unsupported padding');
    }

    this.mode = mode;
    this.padding = padding;
    this.iv = null;
    this.p = P.slice();
    this.s = [S0.slice(), S1.slice(), S2.slice(), S3.slice()];

    key = expandKey(toUint8Array(key));
    for (let i = 0, j = 0; i < 18; i++, j += 4) {
      const n = packFourBytes(key[j], key[j + 1], key[j + 2], key[j + 3]);
      this.p[i] = xor(this.p[i], n);
    }
    let l = 0;
    let r = 0;
    for (let i = 0; i < 18; i += 2) {
      [l, r] = this._encryptBlock(l, r);
      this.p[i] = l;
      this.p[i + 1] = r;
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 256; j += 2) {
        [l, r] = this._encryptBlock(l, r);
        this.s[i][j] = l;
        this.s[i][j + 1] = r;
      }
    }
  }

  setIv(iv) {
    if (!isStringOrBuffer(iv)) {
      throw new Error('IV should be a string or an ArrayBuffer / Buffer');
    }
    iv = toUint8Array(iv);
    if (iv.length !== 8) {
      throw new Error('IV should be 8 byte length');
    }
    this.iv = iv;
  }

  encode(data) {
    if (!isStringOrBuffer(data)) {
      throw new Error(
        'Encode data should be a string or an ArrayBuffer / Buffer'
      );
    }
    if (this.mode !== MODE.ECB && !this.iv) {
      throw new Error('IV is not set');
    }

    data = pad(toUint8Array(data), this.padding);

    if (this.mode === MODE.ECB) {
      return this._encodeECB(data);
    } else if (this.mode === MODE.CBC) {
      return this._encodeCBC(data);
    }
  }

  decode(data, returnType = TYPE.STRING) {
    if (!isStringOrBuffer(data)) {
      throw new Error(
        'Decode data should be a string or an ArrayBuffer / Buffer'
      );
    }
    if (this.mode !== MODE.ECB && !this.iv) {
      throw new Error('IV is not set');
    }
    data = toUint8Array(data);

    if (data.length % 8 !== 0) {
      throw new Error('Decoded data should be multiple of 8 bytes');
    }

    switch (this.mode) {
      case MODE.ECB: {
        data = this._decodeECB(data);
        break;
      }
      case MODE.CBC: {
        data = this._decodeCBC(data);
        break;
      }
    }

    data = unpad(data, this.padding);

    switch (returnType) {
      case TYPE.UINT8_ARRAY: {
        return data;
      }
      case TYPE.STRING: {
        return u8ToString(data);
      }
      default: {
        throw new Error('Unsupported return type');
      }
    }
  }

  _encryptBlock(l, r) {
    for (let i = 0; i < 16; i++) {
      l = xor(l, this.p[i]);
      r = xor(r, this._f(l));
      [l, r] = [r, l];
    }
    [l, r] = [r, l];
    r = xor(r, this.p[16]);
    l = xor(l, this.p[17]);
    return [l, r];
  }

  _decryptBlock(l, r) {
    for (let i = 17; i > 1; i--) {
      l = xor(l, this.p[i]);
      r = xor(r, this._f(l));
      [l, r] = [r, l];
    }
    [l, r] = [r, l];
    r = xor(r, this.p[1]);
    l = xor(l, this.p[0]);
    return [l, r];
  }

  _f(x) {
    const a = (x >>> 24) & 0xff;
    const b = (x >>> 16) & 0xff;
    const c = (x >>> 8) & 0xff;
    const d = x & 0xff;

    let res = sumMod32(this.s[0][a], this.s[1][b]);
    res = xor(res, this.s[2][c]);
    return sumMod32(res, this.s[3][d]);
  }

  _encodeECB(bytes) {
    const encoded = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 8) {
      let l = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
      let r = packFourBytes(
        bytes[i + 4],
        bytes[i + 5],
        bytes[i + 6],
        bytes[i + 7]
      );
      [l, r] = this._encryptBlock(l, r);
      encoded.set(unpackFourBytes(l), i);
      encoded.set(unpackFourBytes(r), i + 4);
    }
    return encoded;
  }

  _encodeCBC(bytes) {
    const encoded = new Uint8Array(bytes.length);
    let prevL = packFourBytes(this.iv[0], this.iv[1], this.iv[2], this.iv[3]);
    let prevR = packFourBytes(this.iv[4], this.iv[5], this.iv[6], this.iv[7]);
    for (let i = 0; i < bytes.length; i += 8) {
      let l = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
      let r = packFourBytes(
        bytes[i + 4],
        bytes[i + 5],
        bytes[i + 6],
        bytes[i + 7]
      );
      [l, r] = [xor(prevL, l), xor(prevR, r)];
      [l, r] = this._encryptBlock(l, r);
      [prevL, prevR] = [l, r];
      encoded.set(unpackFourBytes(l), i);
      encoded.set(unpackFourBytes(r), i + 4);
    }
    return encoded;
  }

  _decodeECB(bytes) {
    const decoded = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 8) {
      let l = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
      let r = packFourBytes(
        bytes[i + 4],
        bytes[i + 5],
        bytes[i + 6],
        bytes[i + 7]
      );
      [l, r] = this._decryptBlock(l, r);
      decoded.set(unpackFourBytes(l), i);
      decoded.set(unpackFourBytes(r), i + 4);
    }
    return decoded;
  }

  _decodeCBC(bytes) {
    const decoded = new Uint8Array(bytes.length);
    let prevL = packFourBytes(this.iv[0], this.iv[1], this.iv[2], this.iv[3]);
    let prevR = packFourBytes(this.iv[4], this.iv[5], this.iv[6], this.iv[7]);
    let prevLTmp;
    let prevRTmp;
    for (let i = 0; i < bytes.length; i += 8) {
      let l = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
      let r = packFourBytes(
        bytes[i + 4],
        bytes[i + 5],
        bytes[i + 6],
        bytes[i + 7]
      );
      [prevLTmp, prevRTmp] = [l, r];
      [l, r] = this._decryptBlock(l, r);
      [l, r] = [xor(prevL, l), xor(prevR, r)];
      [prevL, prevR] = [prevLTmp, prevRTmp];
      decoded.set(unpackFourBytes(l), i);
      decoded.set(unpackFourBytes(r), i + 4);
    }
    return decoded;
  }
}
