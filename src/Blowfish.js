const data = require('./data');
const helpers = require('./helpers');
const TextDecoder = require('../lib/encoding').TextDecoder;

class Blowfish {

    static get MODE() {
        return {
            ECB: 'ECB',
            CBC: 'CBC'
        };
    }

    static get PADDING() {
        return {
            PKCS5: 'PKCS5',
            ONE_AND_ZEROS: 'ONE_AND_ZEROS',
            LAST_BYTE: 'LAST_BYTE',
            NULL: 'NULL',
            SPACES: 'SPACES',
        };
    }

    static get TYPE() {
        return {
            STRING: 'STRING',
            UINT8_ARRAY: 'UINT8_ARRAY'
        };
    }

    constructor(key, mode = Blowfish.MODE.ECB, padding = Blowfish.PADDING.PKCS5) {
        if (!helpers.isStringOrBuffer(key)) {
            throw new Error('Key should be a string or an ArrayBuffer / Buffer');
        }
        if (Object.keys(Blowfish.MODE).indexOf(mode) < 0) {
            throw new Error('Unsupported mode');
        }
        if (Object.keys(Blowfish.PADDING).indexOf(padding) < 0) {
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

    encode(data, returnType = Blowfish.TYPE.UINT8_ARRAY) {
        if (!helpers.isStringOrBuffer(data)) {
            throw new Error('Encode data should be a string or an ArrayBuffer / Buffer');
        }
        if (this.mode !== Blowfish.MODE.ECB && this.iv.length === 0) {
            throw new Error('IV is not set');
        }

        data = this._pad(helpers.toUint8Array(data));

        switch (this.mode) {
            case Blowfish.MODE.ECB: {
                data = this._encodeECB(data);
                break;
            }
            case Blowfish.MODE.CBC: {
                data = this._encodeCBC(data);
                break;
            }
        }

        switch (returnType) {
            case Blowfish.TYPE.UINT8_ARRAY: {
                return data;
            }
            case Blowfish.TYPE.STRING: {
                return (new TextDecoder()).decode(data);
            }
            default: {
                throw new Error('Unsupported return type');
            }
        }
    }

    decode(data, returnType = Blowfish.TYPE.STRING) {
        if (!helpers.isStringOrBuffer(data)) {
            throw new Error('Decode data should be a string or an ArrayBuffer / Buffer');
        }
        if (this.mode !== Blowfish.MODE.ECB && this.iv.length === 0) {
            throw new Error('IV is not set');
        }
        data = helpers.toUint8Array(data);

        if (data.length % 8 !== 0) {
            throw new Error('Decoded data should be multiple of 8 bytes');
        }

        switch (this.mode) {
            case Blowfish.MODE.ECB: {
                data = this._decodeECB(data);
                break;
            }
            case Blowfish.MODE.CBC: {
                data = this._decodeCBC(data);
                break;
            }
        }

        data = this._unpad(data);

        switch (returnType) {
            case Blowfish.TYPE.UINT8_ARRAY: {
                return data;
            }
            case Blowfish.TYPE.STRING: {
                return (new TextDecoder()).decode(data);
            }
            default: {
                throw new Error('Unsupported return type');
            }
        }
    }

    _pad(bytes) {
        const count = 8 - bytes.length % 8;
        if (count === 8) {
            return bytes;
        }
        const writer = new Uint8Array(bytes.length + count);
        const newBytes = [];
        let remaining = count;
        let padChar = 0;

        switch (this.padding) {
            case Blowfish.PADDING.PKCS5: {
                padChar = count;
                break;
            }
            case Blowfish.PADDING.ONE_AND_ZEROS: {
                newBytes.push(0x80);
                remaining--;
                break;
            }
            case Blowfish.PADDING.SPACES: {
                padChar = 0x20;
                break;
            }
        }

        while (remaining > 0) {
            if (this.padding === Blowfish.PADDING.LAST_BYTE && remaining === 1) {
                newBytes.push(count);
                break;
            }
            newBytes.push(padChar);
            remaining--;
        }

        writer.set(bytes);
        writer.set(newBytes, bytes.length);
        return writer;
    }

    _unpad(bytes) {
        let cutLength = 0;
        switch (this.padding) {
            case Blowfish.PADDING.LAST_BYTE:
            case Blowfish.PADDING.PKCS5: {
                const lastChar = bytes[bytes.length - 1];
                if (lastChar < 8) {
                    cutLength = lastChar;
                }
                break;
            }
            case Blowfish.PADDING.ONE_AND_ZEROS: {
                let i = 1;
                while (i < 8) {
                    const char = bytes[bytes.length - i];
                    if (char === 0x80) {
                        cutLength = i;
                        break;
                    }
                    if (char !== 0) {
                        break;
                    }
                    i++;
                }
                break;
            }
            case Blowfish.PADDING.NULL:
            case Blowfish.PADDING.SPACES: {
                const padChar = (this.padding === Blowfish.PADDING.SPACES) ? 0x20 : 0;
                let i = 1;
                while (i < 8) {
                    const char = bytes[bytes.length - i];
                    if (char !== padChar) {
                        cutLength = i - 1;
                        break;
                    }
                    i++;
                }
                break;
            }
        }
        return bytes.subarray(0, bytes.length - cutLength);
    }

    _generateLongKey() {
        if (this.key.length >= 72) { // 576 bits -> 72 bytes
            return this.key;
        }
        const longKey = [];
        while (longKey.length < 72) {
            for (let i = 0; i < this.key.length; i++) {
                longKey.push(this.key[i]);
            }
        }
        return new Uint8Array(longKey);
    }

    _generateSubkeys() {
        const longKey = this._generateLongKey();
        for (let i = 0, j = 0; i < 18; i++, j += 4) {
            const n = helpers.packFourBytes(longKey[j], longKey[j + 1], longKey[j + 2], longKey[j + 3]);
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
