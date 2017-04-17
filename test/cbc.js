const assert = require('assert');
const crypto = require('crypto');
const pack = require('../package.json');
const Blowfish = require(`../${pack.main}`);

const defaultText = 'Encoded string';
const defaultIv = 'abcdefhi';

describe(__filename.substr(process.cwd().length), () => {
    it('PKCS5', () => {
        const encodedText = new Uint8Array([
            224, 247, 234, 62, 128, 250, 211, 229, 43, 43, 98, 121, 171, 228, 52, 254
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
        bf.setIv(defaultIv);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('PKCS5 nodejs crypto', () => {
        const key = 'super key';
        const encodedText = new Uint8Array([
            229, 58, 64, 10, 60, 227, 46, 82, 62, 73, 108, 227, 74, 220, 29, 0
        ]);

        const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
        bf.setIv(defaultIv);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

        const nodeCipher = crypto.createCipheriv('bf-cbc', key, defaultIv);
        const nodeEncoded = Buffer.concat([
            nodeCipher.update(defaultText, 'utf8'),
            nodeCipher.final()
        ]);

        const nodeDecipher = crypto.createDecipheriv('bf-cbc', key, defaultIv);
        const nodeDecoded = Buffer.concat([
            nodeDecipher.update(Buffer.from(encodedText)),
            nodeDecipher.final()
        ]);

        assert.deepStrictEqual(encoded, nodeEncoded);
        assert.deepStrictEqual(decoded, nodeDecoded);
    });
    it('ONE_AND_ZEROS', () => {
        const encodedText = new Uint8Array([
            224, 247, 234, 62, 128, 250, 211, 229, 185, 71, 11, 52, 247, 187, 101, 187
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.ONE_AND_ZEROS);
        bf.setIv(defaultIv);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('LAST_BYTE', () => {
        const encodedText = new Uint8Array([
            224, 247, 234, 62, 128, 250, 211, 229, 104, 39, 86, 191, 133, 125, 47, 74
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.LAST_BYTE);
        bf.setIv(defaultIv);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('NULL', () => {
        const encodedText = new Uint8Array([
            224, 247, 234, 62, 128, 250, 211, 229, 248, 43, 23, 121, 150, 7, 149, 224
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
        bf.setIv(defaultIv);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('SPACES', () => {
        const encodedText = new Uint8Array([
            224, 247, 234, 62, 128, 250, 211, 229, 160, 238, 203, 9, 105, 16, 197, 223
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.SPACES);
        bf.setIv(defaultIv);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
});
