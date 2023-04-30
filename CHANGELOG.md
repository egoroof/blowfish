# Changelog

Date format is `YYYY-MM-DD`

## v3.0.0, 2023-04-16

- **Breaking**: Drop Babel & encoding lib, so now this library requires ES6 native support (IE isn't supported anymore)
- Fixed: Empty key leads to infinite loop

## v2.2.2, 2020-03-07

- Fixed: Truncated result encoding 8 characters text

## v2.2.1, 2019-12-30

- Include typings in dist files list

## v2.2.0, 2019-05-19

- Add types definition

## v2.1.0, 2018-01-06

- Fixed: Empty string is not properly decoded

## v2.0.0, 2017-11-24

- **Breaking**: Now `bf.encode()` doesn't accept second parameter and always returns `Uint8Array`

```js
// v1
const encoded = bf.encode('input text', Blowfish.TYPE.UINT8_ARRAY);

// v2
const encoded = bf.encode('input text');
```

## v1.0.1, 2017-02-25

- Reduce library size from `38.6 KiB` to `20.9 KiB`

## v1.0.0, 2017-02-19

- **Breaking**: Removed `bf.setReturnType()`

Setting `bf.setReturnType()` was annoying so it's removed. Now you can pass second optional argument to `bf.encode()` / `bf.decode()` to specify return type. Default return type is `Blowfish.TYPE.UINT8_ARRAY` for `bf.encode()` and `Blowfish.TYPE.STRING` for `bf.decode`:

```js
// v0.1.0
bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
const encoded = bf.encode('input text');
bf.setReturnType(Blowfish.TYPE.STRING);
const decoded = bf.decode(encoded);

// v1
const encoded = bf.encode('input text', Blowfish.TYPE.UINT8_ARRAY); // type is optional
const decoded = bf.decode(encoded, Blowfish.TYPE.STRING); // type is optional
```

## v0.1.0, 2017-01-10

- First release
