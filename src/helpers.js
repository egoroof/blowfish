const constants = require('./constants');
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

function expandKey(key) {
    if (key.length >= 72) { // 576 bits -> 72 bytes
        return key;
    }
    const longKey = [];
    while (longKey.length < 72) {
        for (let i = 0; i < key.length; i++) {
            longKey.push(key[i]);
        }
    }
    return new Uint8Array(longKey);
}


function pad(bytes, padding) {
    const count = 8 - bytes.length % 8;
    if (count === 8) {
        return bytes;
    }
    const writer = new Uint8Array(bytes.length + count);
    const newBytes = [];
    let remaining = count;
    let padChar = 0;

    switch (padding) {
        case constants.PADDING.PKCS5: {
            padChar = count;
            break;
        }
        case constants.PADDING.ONE_AND_ZEROS: {
            newBytes.push(0x80);
            remaining--;
            break;
        }
        case constants.PADDING.SPACES: {
            padChar = 0x20;
            break;
        }
    }

    while (remaining > 0) {
        if (padding === constants.PADDING.LAST_BYTE && remaining === 1) {
            newBytes.push(count);
            break;
        }
        newBytes.push(padChar);
        remaining--;
    }

    writer.set(bytes);
    writer.set(newBytes, bytes.length);
    return writer;
}

function unpad(bytes, padding) {
    let cutLength = 0;
    switch (padding) {
        case constants.PADDING.LAST_BYTE:
        case constants.PADDING.PKCS5: {
            const lastChar = bytes[bytes.length - 1];
            if (lastChar < 8) {
                cutLength = lastChar;
            }
            break;
        }
        case constants.PADDING.ONE_AND_ZEROS: {
            let i = 1;
            while (i < 8) {
                const char = bytes[bytes.length - i];
                if (char === 0x80) {
                    cutLength = i;
                    break;
                }
                if (char !== 0) {
                    break;
                }
                i++;
            }
            break;
        }
        case constants.PADDING.NULL:
        case constants.PADDING.SPACES: {
            const padChar = (padding === constants.PADDING.SPACES) ? 0x20 : 0;
            let i = 1;
            while (i < 8) {
                const char = bytes[bytes.length - i];
                if (char !== padChar) {
                    cutLength = i - 1;
                    break;
                }
                i++;
            }
            break;
        }
    }
    return bytes.subarray(0, bytes.length - cutLength);
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
    toUint8Array,
    expandKey,
    pad,
    unpad
};
