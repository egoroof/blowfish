export enum MODE {
  ECB = 0,
  CBC = 1,
}

export enum PADDING {
  PKCS5 = 0,
  ONE_AND_ZEROS = 1,
  LAST_BYTE = 2,
  NULL = 3,
  SPACES = 4,
}

export enum TYPE {
  STRING = 0,
  UINT8_ARRAY = 1,
}

export default class Blowfish {
  static readonly MODE: typeof MODE;
  static readonly PADDING: typeof PADDING;
  static readonly TYPE: typeof TYPE;

  /**
   * @param key
   * @param [mode=MODE.ECB]
   * @param [padding=PADDING.PKCS5]
   */
  constructor(key: string | Uint8Array, mode?: MODE, padding?: PADDING);

  setIv(iv: string | Uint8Array): void;

  encode(data: string | Uint8Array): Uint8Array;

  decode(data: string | Uint8Array, type: TYPE.STRING): string;
  decode(data: string | Uint8Array, type?: TYPE.UINT8_ARRAY): Uint8Array;
}
