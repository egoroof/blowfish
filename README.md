
<div align="right">
  <details>
    <summary >🌐 Language</summary>
    <div>
      <div align="center">
        <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=en">English</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=zh-CN">简体中文</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=zh-TW">繁體中文</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=ja">日本語</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=ko">한국어</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=hi">हिन्दी</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=th">ไทย</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=fr">Français</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=de">Deutsch</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=es">Español</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=it">Italiano</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=ru">Русский</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=pt">Português</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=nl">Nederlands</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=pl">Polski</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=ar">العربية</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=fa">فارسی</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=tr">Türkçe</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=vi">Tiếng Việt</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=id">Bahasa Indonesia</a>
        | <a href="https://openaitx.github.io/view.html?user=egoroof&project=blowfish&lang=as">অসমীয়া</
      </div>
    </div>
  </details>
</div>

# Blowfish

[![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/egoroof-blowfish.svg?style=flat-square
[npm]: https://www.npmjs.com/package/egoroof-blowfish

[Blowfish](<https://en.wikipedia.org/wiki/Blowfish_(cipher)>) encryption library for browsers and Node.js.

Find the changelog in [CHANGELOG.md](https://github.com/egoroof/blowfish/blob/master/CHANGELOG.md)

## Table of Contents

- [Installation](#installation)
  - [JS modules](#js-modules)
- [Usage](#usage)
  - [Example](#example)
  - [Block cipher mode of operation](#block-cipher-mode-of-operation)
  - [Padding](#padding)
  - [Return type](#return-type)

## Installation

Take latest version [here](https://unpkg.com/egoroof-blowfish) or with npm:

```
npm install egoroof-blowfish --save
```

### JS modules

The library is only deployed in [native JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), so in browsers you have to use `script` with type `module`:

```html
<script type="module">
  import { Blowfish } from 'https://your-host/blowfish.mjs';
  // your code here..
</script>
```

Or bundle the library to your code.

In Nodejs it imports easily:

```js
import { Blowfish } from 'egoroof-blowfish';
```

## Usage

All input data including key, IV, plaintext and ciphertext should be a `String` or `ArrayBuffer` / `Buffer`.
Strings support all unicode including emoji ✨.

### Example

```js
import { Blowfish } from 'egoroof-blowfish';

const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
bf.setIv('abcdefgh'); // optional for ECB mode; bytes length should be equal 8

const encoded = bf.encode('input text even with emoji 🎅');
const decoded = bf.decode(encoded, Blowfish.TYPE.STRING); // type is optional
```

### Block cipher mode of operation

https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation

```js
Blowfish.MODE.ECB; // (default) Electronic Codebook
Blowfish.MODE.CBC; // Cipher Block Chaining
```

### Padding

http://www.di-mgt.com.au/cryptopad.html

```js
Blowfish.PADDING.PKCS5; // (default) Pad with bytes all of the same value as the number of padding bytes
Blowfish.PADDING.ONE_AND_ZEROS; // Pad with 0x80 followed by zero bytes
Blowfish.PADDING.LAST_BYTE; // Pad with zeroes except make the last byte equal to the number of padding bytes
Blowfish.PADDING.NULL; // Pad with zero (null) characters
Blowfish.PADDING.SPACES; // Pad with spaces
```

### Return type

Which type of data should return method `decode`:

```js
Blowfish.TYPE.STRING; // (default) String
Blowfish.TYPE.UINT8_ARRAY; // Uint8Array
```
