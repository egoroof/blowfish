<!--
Be sure you are editing the draft (/tools/README.draft.md) not the root readme as it's generated automatically.
-->

# Blowfish

[![npm package][npm-badge]][npm] [![Travis][build-badge]][build]

[build-badge]: https://img.shields.io/travis/egoroof/blowfish.svg?style=flat-square
[build]: https://travis-ci.org/egoroof/blowfish

[npm-badge]: https://img.shields.io/npm/v/egoroof-blowfish.svg?style=flat-square
[npm]: https://www.npmjs.org/package/egoroof-blowfish

[Blowfish](https://en.wikipedia.org/wiki/Blowfish_(cipher)) encryption library for browsers and Node.js.

Works in Node.js 4+, IE10+ and all modern browsers.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Example](#example)
  - [Block cipher mode of operation](#block-cipher-mode-of-operation)
  - [Padding](#padding)
  - [Return type](#return-type)

## Installation

For browsers you can include library via [unpkg](https://unpkg.com/) CDN (9.0 KiB gzip) or save it to local machine:

```html
<script src="https://unpkg.com/egoroof-blowfish@2.0.0" crossorigin="anonymous" integrity="sha384-eyTO0feB+8rpercCt+UlEBRE6DVqBlHsgWM279RIcNn9DmwnEeUfiJsl42NyIEfa"></script>
```

For Node.js and browser module loaders like `webpack`, `browserify`, etc. install it via [npm](https://www.npmjs.com/):

```
npm install egoroof-blowfish --save
```

Then you will be able to use it:

```js
const Blowfish = require('egoroof-blowfish');
```

## Usage

All input data including key, IV, plaintext and ciphertext should be a `String` or `ArrayBuffer` / `Buffer`.
Strings support all unicode including emoji ✨.

### Example

```js
const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
bf.setIv('abcdefgh'); // optional for ECB mode; bytes length should be equal 8

const encoded = bf.encode('input text even with emoji 🎅');
const decoded = bf.decode(encoded, Blowfish.TYPE.STRING); // type is optional
```

You can play with this example in runkit: https://runkit.com/egoroof/blowfish-example

### Block cipher mode of operation

https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation

```js
Blowfish.MODE.ECB // (default) Electronic Codebook
Blowfish.MODE.CBC // Cipher Block Chaining
```

### Padding

http://www.di-mgt.com.au/cryptopad.html

```js
Blowfish.PADDING.PKCS5 // (default) Pad with bytes all of the same value as the number of padding bytes
Blowfish.PADDING.ONE_AND_ZEROS // Pad with 0x80 followed by zero bytes
Blowfish.PADDING.LAST_BYTE // Pad with zeroes except make the last byte equal to the number of padding bytes
Blowfish.PADDING.NULL // Pad with zero (null) characters
Blowfish.PADDING.SPACES // Pad with spaces
```

### Return type

Which type of data should return method `decode`:

```js
Blowfish.TYPE.STRING // (default) String
Blowfish.TYPE.UINT8_ARRAY // Uint8Array
```
