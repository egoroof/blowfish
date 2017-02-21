const data = require('./data');
const constants = require('./constants');
const helpers = require('./helpers');
const TextDecoder = require('../lib/encoding').TextDecoder;

class Blowfish {

    static get MODE() {
        return constants.MODE;
    }

    static get PADDING() {
        return constants.PADDING;
    }

    static get TYPE() {
        return constants.TYPE;
    }

    constructor(key, mode = constants.MODE.ECB, padding = constants.PADDING.PKCS5) {
        if (!helpers.isStringOrBuffer(key)) {
            throw new Error('Key should be a string or an ArrayBuffer / Buffer');
        }
        if (Object.keys(constants.MODE).indexOf(mode) < 0) {
            throw new Error('Unsupported mode');
        }
        if (Object.keys(constants.PADDING).indexOf(padding) < 0) {
            throw new Error('Unsupported padding');
        }

        this.key = helpers.toUint8Array(key);
        this.mode = mode;
        this.padding = padding;
        this.iv = new Uint8Array(0);
        this.p = data.P.slice();
        this.s = [
            data.S0.slice(),
            data.S1.slice(),
            data.S2.slice(),
            data.S3.slice()
        ];
        this._generateSubkeys();
    }

    setIv(iv) {
        if (!helpers.isStringOrBuffer(iv)) {
            throw new Error('IV should be a string or an ArrayBuffer / Buffer');
        }
        iv = helpers.toUint8Array(iv);
        if (iv.length !== 8) {
            throw new Error('IV should be 8 byte length');
        }
        this.iv = iv;
    }

    encode(data, returnType = constants.TYPE.UINT8_ARRAY) {
        if (!helpers.isStringOrBuffer(data)) {
            throw new Error('Encode data should be a string or an ArrayBuffer / Buffer');
        }
        if (this.mode !== constants.MODE.ECB && this.iv.length === 0) {
            throw new Error('IV is not set');
        }

        data = helpers.pad(helpers.toUint8Array(data), this.padding);

        switch (this.mode) {
            case constants.MODE.ECB: {
                data = this._encodeECB(data);
                break;
            }
            case constants.MODE.CBC: {
                data = this._encodeCBC(data);
                break;
            }
        }

        switch (returnType) {
            case constants.TYPE.UINT8_ARRAY: {
                return data;
            }
            case constants.TYPE.STRING: {
                return (new TextDecoder()).decode(data);
            }
            default: {
                throw new Error('Unsupported return type');
            }
        }
    }

    decode(data, returnType = constants.TYPE.STRING) {
        if (!helpers.isStringOrBuffer(data)) {
            throw new Error('Decode data should be a string or an ArrayBuffer / Buffer');
        }
        if (this.mode !== constants.MODE.ECB && this.iv.length === 0) {
            throw new Error('IV is not set');
        }
        data = helpers.toUint8Array(data);

        if (data.length % 8 !== 0) {
            throw new Error('Decoded data should be multiple of 8 bytes');
        }

        switch (this.mode) {
            case constants.MODE.ECB: {
                data = this._decodeECB(data);
                break;
            }
            case constants.MODE.CBC: {
                data = this._decodeCBC(data);
                break;
            }
        }

        data = helpers.unpad(data, this.padding);

        switch (returnType) {
            case constants.TYPE.UINT8_ARRAY: {
                return data;
            }
            case constants.TYPE.STRING: {
                return (new TextDecoder()).decode(data);
            }
            default: {
                throw new Error('Unsupported return type');
            }
        }
    }

    _generateSubkeys() {
        const key = helpers.expandKey(this.key);
        for (let i = 0, j = 0; i < 18; i++, j += 4) {
            const n = helpers.packFourBytes(key[j], key[j + 1], key[j + 2], key[j + 3]);
            this.p[i] = helpers.xor(this.p[i], n);
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

    _encryptBlock(l, r) {
        for (let i = 0; i < 16; i++) {
            l = helpers.xor(l, this.p[i]);
            r = helpers.xor(r, this._f(l));
            [l, r] = [r, l];
        }
        [l, r] = [r, l];
        r = helpers.xor(r, this.p[16]);
        l = helpers.xor(l, this.p[17]);
        return [l, r];
    }

    _decryptBlock(l, r) {
        for (let i = 17; i > 1; i--) {
            l = helpers.xor(l, this.p[i]);
            r = helpers.xor(r, this._f(l));
            [l, r] = [r, l];
        }
        [l, r] = [r, l];
        r = helpers.xor(r, this.p[1]);
        l = helpers.xor(l, this.p[0]);
        return [l, r];
    }

    _f(x) {
        const a = (x >>> 24) & 0xFF;
        const b = (x >>> 16) & 0xFF;
        const c = (x >>> 8) & 0xFF;
        const d = x & 0xFF;

        let res = helpers.sumMod32(this.s[0][a], this.s[1][b]);
        res = helpers.xor(res, this.s[2][c]);
        return helpers.sumMod32(res, this.s[3][d]);
    }

    _encodeECB(bytes) {
        const encoded = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i += 8) {
            let l = helpers.packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
            let r = helpers.packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
            [l, r] = this._encryptBlock(l, r);
            encoded.set(helpers.unpackFourBytes(l), i);
            encoded.set(helpers.unpackFourBytes(r), i + 4);
        }
        return encoded;
    }

    _encodeCBC(bytes) {
        const encoded = new Uint8Array(bytes.length);
        let prevL = helpers.packFourBytes(this.iv[0], this.iv[1], this.iv[2], this.iv[3]);
        let prevR = helpers.packFourBytes(this.iv[4], this.iv[5], this.iv[6], this.iv[7]);
        for (let i = 0; i < bytes.length; i += 8) {
            let l = helpers.packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
            let r = helpers.packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
            [l, r] = [helpers.xor(prevL, l), helpers.xor(prevR, r)];
            [l, r] = this._encryptBlock(l, r);
            [prevL, prevR] = [l, r];
            encoded.set(helpers.unpackFourBytes(l), i);
            encoded.set(helpers.unpackFourBytes(r), i + 4);
        }
        return encoded;
    }

    _decodeECB(bytes) {
        const decoded = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i += 8) {
            let l = helpers.packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
            let r = helpers.packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
            [l, r] = this._decryptBlock(l, r);
            decoded.set(helpers.unpackFourBytes(l), i);
            decoded.set(helpers.unpackFourBytes(r), i + 4);
        }
        return decoded;
    }

    _decodeCBC(bytes) {
        const decoded = new Uint8Array(bytes.length);
        let prevL = helpers.packFourBytes(this.iv[0], this.iv[1], this.iv[2], this.iv[3]);
        let prevR = helpers.packFourBytes(this.iv[4], this.iv[5], this.iv[6], this.iv[7]);
        let prevLTmp;
        let prevRTmp;
        for (let i = 0; i < bytes.length; i += 8) {
            let l = helpers.packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
            let r = helpers.packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
            [prevLTmp, prevRTmp] = [l, r];
            [l, r] = this._decryptBlock(l, r);
            [l, r] = [helpers.xor(prevL, l), helpers.xor(prevR, r)];
            [prevL, prevR] = [prevLTmp, prevRTmp];
            decoded.set(helpers.unpackFourBytes(l), i);
            decoded.set(helpers.unpackFourBytes(r), i + 4);
        }
        return decoded;
    }
}

module.exports = Blowfish;
