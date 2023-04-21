import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import Blowfish from '../dist/blowfish.js';

const defaultText = 'Encoded string';

describe('ecb', () => {
  it('PKCS5', () => {
    const encodedText = new Uint8Array([
      206, 191, 227, 245, 55, 231, 15, 100, 188, 184, 22, 151, 229, 85, 0, 234,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('PKCS5 empty string', () => {
    const key = 'super key';
    const encodedText = new Uint8Array([
      0x65, 0xff, 0x98, 0xdc, 0x53, 0x95, 0xd6, 0x39,
    ]);

    const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.PKCS5);
    const encoded = bf.encode('');
    const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, new Uint8Array(0));
  });
  it('ONE_AND_ZEROS', () => {
    const encodedText = new Uint8Array([
      206, 191, 227, 245, 55, 231, 15, 100, 69, 27, 20, 255, 16, 155, 25, 173,
    ]);
    const bf = new Blowfish(
      'a',
      Blowfish.MODE.ECB,
      Blowfish.PADDING.ONE_AND_ZEROS
    );
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('LAST_BYTE', () => {
    const encodedText = new Uint8Array([
      206, 191, 227, 245, 55, 231, 15, 100, 18, 112, 7, 53, 105, 135, 90, 75,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.LAST_BYTE);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('NULL', () => {
    const encodedText = new Uint8Array([
      206, 191, 227, 245, 55, 231, 15, 100, 203, 221, 206, 15, 24, 244, 35, 156,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('SPACES', () => {
    const encodedText = new Uint8Array([
      206, 191, 227, 245, 55, 231, 15, 100, 89, 174, 222, 134, 197, 10, 210,
      185,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.ECB, Blowfish.PADDING.SPACES);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
});
