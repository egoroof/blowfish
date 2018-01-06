const assert = require('assert');
const Blowfish = require('../dist/blowfish');

describe('default parameters', () => {
    it('set ECB mode', () => {
        const bf = new Blowfish('a');
        assert.deepStrictEqual(bf.mode, Blowfish.MODE.ECB);
    });
    it('set PKCS5 padding', () => {
        const bf = new Blowfish('a');
        assert.deepStrictEqual(bf.padding, Blowfish.PADDING.PKCS5);
    });
});
