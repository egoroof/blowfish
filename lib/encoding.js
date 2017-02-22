// This is free and unencumbered software released into the public domain.
// https://github.com/inexorabletash/text-encoding
// v0.6.4 + cleaning

function inRange(a, min, max) {
    return min <= a && a <= max;
}

function includes(array, item) {
    return array.indexOf(item) !== -1;
}

function ToDictionary(o) {
    if (o === undefined) return {};
    if (o === Object(o)) return o;
    throw TypeError('Could not convert argument to dictionary');
}

function stringToCodePoints(string) {
    var s = String(string);
    var n = s.length;
    var i = 0;
    var u = [];

    while (i < n) {
        var c = s.charCodeAt(i);

        if (c < 0xD800 || c > 0xDFFF) {
            u.push(c);
        } else if (0xDC00 <= c && c <= 0xDFFF) {
            u.push(0xFFFD);
        } else if (0xD800 <= c && c <= 0xDBFF) {
            if (i === n - 1) {
                u.push(0xFFFD);
            } else {
                var d = s.charCodeAt(i + 1);

                if (0xDC00 <= d && d <= 0xDFFF) {
                    var a = c & 0x3FF;
                    var b = d & 0x3FF;

                    u.push(0x10000 + (a << 10) + b);
                    i += 1;
                } else {
                    u.push(0xFFFD);
                }
            }
        }

        i += 1;
    }

    return u;
}

function codePointsToString(code_points) {
    var s = '';
    for (var i = 0; i < code_points.length; ++i) {
        var cp = code_points[i];
        if (cp <= 0xFFFF) {
            s += String.fromCharCode(cp);
        } else {
            cp -= 0x10000;
            s += String.fromCharCode((cp >> 10) + 0xD800, (cp & 0x3FF) + 0xDC00);
        }
    }
    return s;
}

function isASCIIByte(a) {
    return 0x00 <= a && a <= 0x7F;
}

var isASCIICodePoint = isASCIIByte;
var end_of_stream = -1;

function Stream(tokens) {
    this.tokens = [].slice.call(tokens);
    this.tokens.reverse();
}

Stream.prototype = {
    endOfStream: function () {
        return !this.tokens.length;
    },
    read: function () {
        if (!this.tokens.length)
            return end_of_stream;
        return this.tokens.pop();
    },
    prepend: function (token) {
        if (Array.isArray(token)) {
            var tokens = token;
            while (tokens.length)
                this.tokens.push(tokens.pop());
        } else {
            this.tokens.push(token);
        }
    },
    push: function (token) {
        if (Array.isArray(token)) {
            var tokens = token;
            while (tokens.length)
                this.tokens.unshift(tokens.shift());
        } else {
            this.tokens.unshift(token);
        }
    }
};

var finished = -1;

function decoderError(fatal, opt_code_point) {
    if (fatal)
        throw TypeError('Decoder error');
    return opt_code_point || 0xFFFD;
}

function Decoder() {
}
Decoder.prototype = {
    handler: function (stream, bite) {
    }
};

function Encoder() {
}
Encoder.prototype = {
    handler: function (stream, code_point) {
    }
};

function TextDecoder(label, options) {
    options = ToDictionary(options);

    this._decoder = null;
    this._ignoreBOM = false;
    this._BOMseen = false;
    this._error_mode = 'replacement';
    this._do_not_flush = false;

    var dec = this;

    if (options['fatal'])
        dec._error_mode = 'fatal';

    if (options['ignoreBOM'])
        dec._ignoreBOM = true;

    return dec;
}

TextDecoder.prototype.decode = function decode(input, options) {
    var bytes;
    if (typeof input === 'object' && input instanceof ArrayBuffer) {
        bytes = new Uint8Array(input);
    } else if (typeof input === 'object' && 'buffer' in input && input.buffer instanceof ArrayBuffer) {
        bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    } else {
        bytes = new Uint8Array(0);
    }

    options = ToDictionary(options);

    if (!this._do_not_flush) {
        this._decoder = new UTF8Decoder({
            fatal: this._error_mode === 'fatal'
        });
        this._BOMseen = false;
    }

    this._do_not_flush = Boolean(options['stream']);

    var input_stream = new Stream(bytes);
    var output = [];
    var result;

    while (true) {
        var token = input_stream.read();

        if (token === end_of_stream)
            break;

        result = this._decoder.handler(input_stream, token);

        if (result === finished)
            break;

        if (result !== null) {
            if (Array.isArray(result))
                output.push.apply(output, result);
            else
                output.push(result);
        }
    }
    if (!this._do_not_flush) {
        do {
            result = this._decoder.handler(input_stream, input_stream.read());
            if (result === finished)
                break;
            if (result === null)
                continue;
            if (Array.isArray(result))
                output.push.apply(output, result);
            else
                output.push(result);
        } while (!input_stream.endOfStream());
        this._decoder = null;
    }

    function serializeStream(stream) {
        if (includes(['UTF-8', 'UTF-16LE', 'UTF-16BE'], 'utf-8') && !this._ignoreBOM && !this._BOMseen) {
            if (stream.length > 0 && stream[0] === 0xFEFF) {
                this._BOMseen = true;
                stream.shift();
            } else if (stream.length > 0) {
                this._BOMseen = true;
            }
        }
        return codePointsToString(stream);
    }

    return serializeStream.call(this, output);
};

function TextEncoder(label, options) {
    options = ToDictionary(options);

    this._encoder = null;
    this._do_not_flush = false;
    this._fatal = (options['fatal']) ? 'fatal' : 'replacement';

    return this;
}

TextEncoder.prototype.encode = function encode(opt_string, options) {
    opt_string = opt_string === undefined ? '' : String(opt_string);
    options = ToDictionary(options);

    if (!this._do_not_flush)
        this._encoder = new UTF8Encoder({
            fatal: this._fatal === 'fatal'
        });
    this._do_not_flush = Boolean(options['stream']);

    var input = new Stream(stringToCodePoints(opt_string));
    var output = [];
    var result;

    while (true) {
        var token = input.read();
        if (token === end_of_stream)
            break;
        result = this._encoder.handler(input, token);
        if (result === finished)
            break;
        if (Array.isArray(result))
            output.push.apply(output, result);
        else
            output.push(result);
    }
    if (!this._do_not_flush) {
        while (true) {
            result = this._encoder.handler(input, input.read());
            if (result === finished)
                break;
            if (Array.isArray(result))
                output.push.apply(output, result);
            else
                output.push(result);
        }
        this._encoder = null;
    }
    return new Uint8Array(output);
};

function UTF8Decoder(options) {
    var fatal = options.fatal;
    var utf8_code_point = 0,
        utf8_bytes_seen = 0,
        utf8_bytes_needed = 0,
        utf8_lower_boundary = 0x80,
        utf8_upper_boundary = 0xBF;

    this.handler = function (stream, bite) {
        if (bite === end_of_stream && utf8_bytes_needed !== 0) {
            utf8_bytes_needed = 0;
            return decoderError(fatal);
        }

        if (bite === end_of_stream)
            return finished;

        if (utf8_bytes_needed === 0) {
            if (inRange(bite, 0x00, 0x7F)) {
                return bite;
            } else if (inRange(bite, 0xC2, 0xDF)) {
                utf8_bytes_needed = 1;
                utf8_code_point = bite & 0x1F;
            } else if (inRange(bite, 0xE0, 0xEF)) {
                if (bite === 0xE0)
                    utf8_lower_boundary = 0xA0;
                if (bite === 0xED)
                    utf8_upper_boundary = 0x9F;
                utf8_bytes_needed = 2;
                utf8_code_point = bite & 0xF;
            } else if (inRange(bite, 0xF0, 0xF4)) {
                if (bite === 0xF0)
                    utf8_lower_boundary = 0x90;
                if (bite === 0xF4)
                    utf8_upper_boundary = 0x8F;
                utf8_bytes_needed = 3;
                utf8_code_point = bite & 0x7;
            } else {
                return decoderError(fatal);
            }
            return null;
        }

        if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {
            utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
            utf8_lower_boundary = 0x80;
            utf8_upper_boundary = 0xBF;

            stream.prepend(bite);

            return decoderError(fatal);
        }

        utf8_lower_boundary = 0x80;
        utf8_upper_boundary = 0xBF;
        utf8_code_point = (utf8_code_point << 6) | (bite & 0x3F);
        utf8_bytes_seen += 1;

        if (utf8_bytes_seen !== utf8_bytes_needed)
            return null;

        var code_point = utf8_code_point;

        utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;

        return code_point;
    };
}

function UTF8Encoder(options) {
    var fatal = options.fatal;

    this.handler = function (stream, code_point) {
        if (code_point === end_of_stream)
            return finished;
        if (isASCIICodePoint(code_point))
            return code_point;

        var count, offset;
        if (inRange(code_point, 0x0080, 0x07FF)) {
            count = 1;
            offset = 0xC0;
        } else if (inRange(code_point, 0x0800, 0xFFFF)) {
            count = 2;
            offset = 0xE0;
        } else if (inRange(code_point, 0x10000, 0x10FFFF)) {
            count = 3;
            offset = 0xF0;
        }

        var bytes = [(code_point >> (6 * count)) + offset];

        while (count > 0) {
            var temp = code_point >> (6 * (count - 1));

            bytes.push(0x80 | (temp & 0x3F));
            count -= 1;
        }

        return bytes;
    };
}

module.exports = {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder
};
