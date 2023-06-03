import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { Blowfish } from '../dist/blowfish.mjs';

describe('default parameters', () => {
  it('set ECB mode', () => {
    const bf = new Blowfish('a');
    deepStrictEqual(bf.mode, Blowfish.MODE.ECB);
  });
  it('set PKCS5 padding', () => {
    const bf = new Blowfish('a');
    deepStrictEqual(bf.padding, Blowfish.PADDING.PKCS5);
  });
  it('empty key throws error', () => {
    throws(() => {
      new Blowfish('');
    });
  });
});
