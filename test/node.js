const crypto = require('crypto');
const expect = require('chai').expect;
const tests = require('./common');
const pack = require('../package.json');
const Blowfish = require(`../${pack.main}`);

tests.forEach((testPack) => {
    describe(testPack.describe, () => {
        testPack.it.forEach((test) => {
            it(test.describe, test.test.bind(null, Blowfish, expect));
        });
    });
});

describe('nodejs crypto', () => {
    it('ECB', () => {
        const key = 'super key';
        const text = 'Encoded string';
        const encodedText = new Uint8Array([192, 230, 228, 19, 197, 108, 172, 217, 61, 169, 178, 167, 62, 197, 94, 45]);

        const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
        const encoded = bf.encode(text);
        const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

        const nodeBfCipher = crypto.createCipheriv('bf-ecb', key, '');
        const nodeEncoded = Buffer.concat([nodeBfCipher.update(text, 'utf8'), nodeBfCipher.final()]);

        const nodeBfDecipher = crypto.createDecipheriv('bf-ecb', key, '');
        const nodeDecoded = Buffer.concat([nodeBfDecipher.update(Buffer.from(encodedText)), nodeBfDecipher.final()]);

        expect(encoded).to.eql(new Uint8Array(nodeEncoded));
        expect(decoded).to.eql(new Uint8Array(nodeDecoded));
    });
    it('CBC', () => {
        const key = 'super key';
        const iv = 'abcdefhi';
        const text = 'Encoded string';
        const encodedText = new Uint8Array([229, 58, 64, 10, 60, 227, 46, 82, 62, 73, 108, 227, 74, 220, 29, 0]);

        const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
        bf.setIv(iv);
        const encoded = bf.encode(text);
        const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

        const nodeBfCipher = crypto.createCipheriv('bf-cbc', key, iv);
        const nodeEncoded = Buffer.concat([nodeBfCipher.update(text, 'utf8'), nodeBfCipher.final()]);

        const nodeBfDecipher = crypto.createDecipheriv('bf-cbc', key, iv);
        const nodeDecoded = Buffer.concat([nodeBfDecipher.update(Buffer.from(encodedText)), nodeBfDecipher.final()]);

        expect(encoded).to.eql(new Uint8Array(nodeEncoded));
        expect(decoded).to.eql(new Uint8Array(nodeDecoded));
    });
});
