const TextEncoder = require('../lib/encoding').TextEncoder;

function signedToUnsigned(signed) {
    return signed >>> 0;
}

function xor(a, b) {
    return signedToUnsigned(a ^ b);
}

function sumMod32(a, b) {
    return signedToUnsigned((a + b) | 0);
}

function packFourBytes(byte1, byte2, byte3, byte4) {
    return signedToUnsigned(byte1 << 24 | byte2 << 16 | byte3 << 8 | byte4);
}

function unpackFourBytes(pack) {
    return [
        (pack >>> 24) & 0xFF,
        (pack >>> 16) & 0xFF,
        (pack >>> 8) & 0xFF,
        pack & 0xFF
    ];
}

function isString(val) {
    return typeof val === 'string';
}

function isBuffer(val) {
    return typeof val === 'object' && 'byteLength' in val;
}

function isStringOrBuffer(val) {
    return isString(val) || isBuffer(val);
}

function toUint8Array(val) {
    if (isString(val)) {
        return (new TextEncoder()).encode(val);
    } else if (isBuffer(val)) {
        return new Uint8Array(val);
    }
    throw new Error('Unsupported type');
}

module.exports = {
    signedToUnsigned,
    xor,
    sumMod32,
    packFourBytes,
    unpackFourBytes,
    isString,
    isBuffer,
    isStringOrBuffer,
    toUint8Array
};
