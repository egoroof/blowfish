import { deepStrictEqual } from 'assert';
import Blowfish from '../dist/blowfish.js';

describe('default parameters', () => {
  it('set ECB mode', () => {
    const bf = new Blowfish('a');
    deepStrictEqual(bf.mode, Blowfish.MODE.ECB);
  });
  it('set PKCS5 padding', () => {
    const bf = new Blowfish('a');
    deepStrictEqual(bf.padding, Blowfish.PADDING.PKCS5);
  });
});
