# Blowfish [![npm package][npm-badge]][npm] [![Travis][build-badge]][build]

[build-badge]: https://img.shields.io/travis/egoroof/blowfish.svg?style=flat-square
[build]: https://travis-ci.org/egoroof/blowfish

[npm-badge]: https://img.shields.io/npm/v/egoroof-blowfish.svg?style=flat-square
[npm]: https://www.npmjs.org/package/egoroof-blowfish

[Blowfish](https://en.wikipedia.org/wiki/Blowfish_(cipher)) encryption library for browsers and Node.js.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [Usage](#usage)
  - [Example](#example)
  - [Block cipher mode of operation](#block-cipher-mode-of-operation)
  - [Padding](#padding)
  - [Return type](#return-type)

## Requirements

For browsers: [Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays).
Tested in latest Chrome, Firefox, Edge and IE11 (IE10 isn't tested but should work).

Node.js 4 - 7 are tested and works well.

## Installation

This library is wrapped with [Universal Module Definition](https://github.com/umdjs/umd). This means you will not
have any problems to use it with different script loaders.

### Browser

You can include library via [unpkg](https://unpkg.com/) or save it to local machine:

```html
<script src="https://unpkg.com/egoroof-blowfish@0.1.0" crossorigin="anonymous" integrity="sha384-uW+0CqLRlY3WkH8I/g0tgGY1Qte0s4945VbpgliDiVSS6A5VNp+WtFAt7tg5iMOr"></script>
```

If you are using browser module loaders like `webpack` or `browserify` install it via [npm](https://www.npmjs.com/):

```
npm install egoroof-blowfish --save
```

Then you will be able to use it:

```js
const Blowfish = require('egoroof-blowfish');
```

### Node.js

```
npm install egoroof-blowfish --save
```

Or using [yarn](https://yarnpkg.com/):

```
yarn add egoroof-blowfish
```

Then you will be able to use it:

```js
const Blowfish = require('egoroof-blowfish');
```

## Usage

All input data including key, iv, plaintext and ciphertext should be a string or ArrayBuffer / Buffer.
Strings supports all unicode including emoji.

### Example

```js
const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL); // only key isn't optional
bf.setIv('abcdefgh'); // optional for ECB mode; bytes length should be equal 8
bf.setReturnType(Blowfish.TYPE.STRING); // optional

const encoded = bf.encode('input text even with emoji 🎅');
const decoded = bf.decode(encoded);
```

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

Which type of data should return functions `encode` and `decode`:

```js
Blowfish.TYPE.STRING // (default) String
Blowfish.TYPE.UINT8_ARRAY // Uint8Array
```
