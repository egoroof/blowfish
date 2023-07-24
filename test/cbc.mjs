import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { Blowfish } from '../dist/blowfish.mjs';

const defaultText = 'Encoded string';
const defaultIv = 'abcdefhi';

describe('cbc', () => {
  it('PKCS5 string length == 16', () => {
    const textToEncode = 'totototototototo';
    const encodedText = new Uint8Array([
      11, 164, 138, 212, 75, 201, 194, 109, 92, 186, 109, 255, 247, 194, 150,
      220, 156, 187, 32, 216, 151, 2, 185, 240,
    ]);
    const bf = new Blowfish(
      'a4MJrL7XahTiDOad',
      Blowfish.MODE.CBC,
      Blowfish.PADDING.PKCS5,
    );
    bf.setIv('daODiTha');
    const encoded = bf.encode(textToEncode);
    const decoded = bf.decode(encoded);
    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, textToEncode);
  });

  it('PKCS5 string length == 7', () => {
    const textToEncode = 'tototot';
    const encodedText = new Uint8Array([159, 249, 22, 35, 233, 125, 239, 223]);
    const bf = new Blowfish(
      'a4MJrL7XahTiDOad',
      Blowfish.MODE.CBC,
      Blowfish.PADDING.PKCS5,
    );
    bf.setIv('daODiTha');
    const encoded = bf.encode(textToEncode);
    const decoded = bf.decode(encoded);
    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, textToEncode);
  });
  it('PKCS5 string length == 8', () => {
    const textToEncode = 'totototo';
    const encodedText = new Uint8Array([
      11, 164, 138, 212, 75, 201, 194, 109, 108, 15, 105, 90, 14, 55, 195, 174,
    ]);
    const bf = new Blowfish(
      'a4MJrL7XahTiDOad',
      Blowfish.MODE.CBC,
      Blowfish.PADDING.PKCS5,
    );
    bf.setIv('daODiTha');
    const encoded = bf.encode(textToEncode);
    const decoded = bf.decode(encoded);
    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, textToEncode);
  });

  it('PKCS5', () => {
    const encodedText = new Uint8Array([
      224, 247, 234, 62, 128, 250, 211, 229, 43, 43, 98, 121, 171, 228, 52, 254,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
    bf.setIv(defaultIv);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });

  it('PKCS5 empty string', () => {
    const key = 'super key';
    const encodedText = new Uint8Array([
      0x5f, 0xed, 0x9d, 0x2c, 0x93, 0x8e, 0x51, 0x4e,
    ]);

    const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
    bf.setIv(defaultIv);
    const encoded = bf.encode('');
    const decoded = bf.decode(encodedText, Blowfish.TYPE.UINT8_ARRAY);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, new Uint8Array(0));
  });
  it('ONE_AND_ZEROS', () => {
    const encodedText = new Uint8Array([
      224, 247, 234, 62, 128, 250, 211, 229, 185, 71, 11, 52, 247, 187, 101,
      187,
    ]);
    const bf = new Blowfish(
      'a',
      Blowfish.MODE.CBC,
      Blowfish.PADDING.ONE_AND_ZEROS,
    );
    bf.setIv(defaultIv);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('LAST_BYTE', () => {
    const encodedText = new Uint8Array([
      224, 247, 234, 62, 128, 250, 211, 229, 104, 39, 86, 191, 133, 125, 47, 74,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.LAST_BYTE);
    bf.setIv(defaultIv);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('NULL', () => {
    const encodedText = new Uint8Array([
      224, 247, 234, 62, 128, 250, 211, 229, 248, 43, 23, 121, 150, 7, 149, 224,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
    bf.setIv(defaultIv);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
  it('SPACES', () => {
    const encodedText = new Uint8Array([
      224, 247, 234, 62, 128, 250, 211, 229, 160, 238, 203, 9, 105, 16, 197,
      223,
    ]);
    const bf = new Blowfish('a', Blowfish.MODE.CBC, Blowfish.PADDING.SPACES);
    bf.setIv(defaultIv);
    const encoded = bf.encode(defaultText);
    const decoded = bf.decode(encoded);

    deepStrictEqual(encoded, encodedText);
    deepStrictEqual(decoded, defaultText);
  });
});
