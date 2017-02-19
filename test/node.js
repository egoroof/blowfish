'use strict'; // node 4 and 5 legacy

const crypto = require('crypto');
const expect = require('chai').expect;
const tests = require('./common');
const mode = process.argv[3]; // test, coverage

let Blowfish;

switch (mode) {
    case 'coverage':
        Blowfish = require('../src/Blowfish');
        break;
    default:
        Blowfish = require('../dist/blowfish');
        break;
}

tests.forEach((testPack) => {
    describe(testPack.describe, () => {
        testPack.it.forEach((test) => {
            it(test.describe, test.test.bind(null, Blowfish, expect));
        });
    });
});

describe('nodejs crypto', () => {

    describe('mode ECB, padding PKCS5', () => {
        it('should correctly encode english text', () => {
            const key = 'super key';
            const text = 'Encoded string';

            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
            const encoded = bf.encode(text);

            const nodeBf = crypto.createCipheriv('bf-ecb', key, '');
            const nodeEncoded = Buffer.concat([nodeBf.update(text, 'utf8'), nodeBf.final()]);

            expect(encoded).to.eql(new Uint8Array(nodeEncoded));
        });
        it('should correctly decode english text', () => {
            const key = 'super key';
            const encodedText = new Uint8Array([192, 230, 228, 19, 197, 108, 172, 217, 61, 169, 178, 167, 62, 197, 94, 45]);

            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
            const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

            const nodeBf = crypto.createDecipheriv('bf-ecb', key, '');
            const nodeDecoded = Buffer.concat([nodeBf.update(Buffer.from(encodedText)), nodeBf.final()]);

            expect(decoded).to.eql(new Uint8Array(nodeDecoded));
        });
    });

    describe('mode CBC, padding PKCS5', () => {
        it('should correctly encode english text', () => {
            const key = 'super key';
            const iv = 'abcdefhi';
            const text = 'Encoded string';

            const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
            bf.setIv(iv);
            const encoded = bf.encode(text);

            const nodeBf = crypto.createCipheriv('bf-cbc', key, iv);
            const nodeEncoded = Buffer.concat([nodeBf.update(text, 'utf8'), nodeBf.final()]);

            expect(encoded).to.eql(new Uint8Array(nodeEncoded));
        });
        it('should correctly decode english text', () => {
            const key = 'super key';
            const iv = 'abcdefhi';
            const encodedText = new Uint8Array([229, 58, 64, 10, 60, 227, 46, 82, 62, 73, 108, 227, 74, 220, 29, 0]);

            const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
            bf.setIv(iv);
            const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

            const nodeBf = crypto.createDecipheriv('bf-cbc', key, iv);
            const nodeDecoded = Buffer.concat([nodeBf.update(Buffer.from(encodedText)), nodeBf.final()]);

            expect(decoded).to.eql(new Uint8Array(nodeDecoded));
        });
    });

});
