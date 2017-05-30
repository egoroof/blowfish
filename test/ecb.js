const assert = require('assert');
const crypto = require('crypto');
const Blowfish = require('../dist/blowfish');

const defaultText = 'Encoded string';

describe(__filename.substr(process.cwd().length), () => {
    it('PKCS5', () => {
        const encodedText = new Uint8Array([
            206, 191, 227, 245, 55, 231, 15, 100, 188, 184, 22, 151, 229, 85, 0, 234
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('PKCS5 nodejs crypto', () => {
        const key = 'super key';
        const encodedText = new Uint8Array([
            192, 230, 228, 19, 197, 108, 172, 217, 61, 169, 178, 167, 62, 197, 94, 45
        ]);

        const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

        const nodeCipher = crypto.createCipheriv('bf-ecb', key, '');
        const nodeEncoded = Buffer.concat([
            nodeCipher.update(defaultText, 'utf8'),
            nodeCipher.final()
        ]);

        const nodeDecipher = crypto.createDecipheriv('bf-ecb', key, '');
        const nodeDecoded = Buffer.concat([
            nodeDecipher.update(Buffer.from(encodedText)),
            nodeDecipher.final()
        ]);

        assert.deepStrictEqual(encoded, new Uint8Array(nodeEncoded));
        assert.deepStrictEqual(decoded, new Uint8Array(nodeDecoded));
    });
    it('ONE_AND_ZEROS', () => {
        const encodedText = new Uint8Array([
            206, 191, 227, 245, 55, 231, 15, 100, 69, 27, 20, 255, 16, 155, 25, 173
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.ONE_AND_ZEROS);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('LAST_BYTE', () => {
        const encodedText = new Uint8Array([
            206, 191, 227, 245, 55, 231, 15, 100, 18, 112, 7, 53, 105, 135, 90, 75
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.LAST_BYTE);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('NULL', () => {
        const encodedText = new Uint8Array([
            206, 191, 227, 245, 55, 231, 15, 100, 203, 221, 206, 15, 24, 244, 35, 156
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
    it('SPACES', () => {
        const encodedText = new Uint8Array([
            206, 191, 227, 245, 55, 231, 15, 100, 89, 174, 222, 134, 197, 10, 210, 185
        ]);
        const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.SPACES);
        const encoded = bf.encode(defaultText);
        const decoded = bf.decode(encoded);

        assert.deepStrictEqual(encoded, encodedText);
        assert.deepStrictEqual(decoded, defaultText);
    });
});
