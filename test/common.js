const tests = [{
    describe: 'default parameters',
    it: [{
        describe: 'should set ECB mode',
        test: function(Blowfish, expect) {
            const bf = new Blowfish('a');
            expect(bf.mode).to.equal(Blowfish.MODE.ECB);
        }
    }, {
        describe: 'should set PKCS5 padding',
        test: function(Blowfish, expect) {
            const bf = new Blowfish('a');
            expect(bf.padding).to.equal(Blowfish.PADDING.PKCS5);
        }
    }, {
        describe: 'should set STRING return type',
        test: function(Blowfish, expect) {
            const bf = new Blowfish('a');
            expect(bf.returnType).to.equal(Blowfish.TYPE.STRING);
        }
    }]
}, {
    describe: 'mode ECB, padding NULL',
    it: [{
        describe: 'should correctly encode / decode english text',
        test: function(Blowfish, expect) {
            const key = 'super key';
            const text = 'Encoded string';
            const textEncoded = new Uint8Array([
                0xc0, 0xe6, 0xe4, 0x13, 0xc5, 0x6c, 0xac, 0xd9, 0x0f, 0xe7, 0x53, 0x80, 0xef, 0xbf, 0x3f, 0xda
            ]);
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);

            const decoded = bf.decode(textEncoded);
            expect(decoded).to.eql(text);

            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode(text);
            expect(encoded).to.eql(textEncoded);
        }
    }, {
        describe: 'should correctly encode / decode russian text',
        test: function(Blowfish, expect) {
            const key = 'super key';
            const text = 'Строка на русском';
            const textEncoded = new Uint8Array([
                0x82, 0x6f, 0x71, 0xdd, 0xb2, 0x45, 0xd7, 0xb3, 0xf7, 0x20, 0xb6, 0x7b, 0x52, 0x90, 0x42, 0x74,
                0x44, 0x3f, 0x04, 0xc6, 0x8a, 0x0e, 0xc1, 0x74, 0x85, 0x79, 0x93, 0x89, 0x8b, 0xe7, 0xc0, 0x5b
            ]);
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);

            const decoded = bf.decode(textEncoded);
            expect(decoded).to.eql(text);

            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode(text);
            expect(encoded).to.eql(textEncoded);
        }
    }, {
        describe: 'should correctly encode / decode emoji text',
        test: function(Blowfish, expect) {
            const key = 'super key';
            const text = '🎅🎅🎅🎅🎅';
            const textEncoded = new Uint8Array([
                0x7f, 0xee, 0x80, 0x36, 0x89, 0xf4, 0xba, 0x5a, 0x7f, 0xee, 0x80, 0x36, 0x89, 0xf4, 0xba, 0x5a,
                0xe7, 0x19, 0xab, 0xbd, 0xf7, 0xd6, 0xfd, 0x9b
            ]);
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);

            const decoded = bf.decode(textEncoded);
            expect(decoded).to.eql(text);

            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode(text);
            expect(encoded).to.eql(textEncoded);
        }
    }]
}, {
    describe: 'mode CBC, padding NULL',
    it: [{
        describe: 'should correctly encode / decode english text',
        test: function(Blowfish, expect) {
            const key = 'super key';
            const text = 'Encoded string';
            const textEncoded = new Uint8Array([
                0x40, 0x5d, 0xf0, 0x7a, 0xd2, 0x25, 0x13, 0xeb, 0x58, 0xe1, 0x97, 0x11, 0xb2, 0x66, 0x2b, 0xac
            ]);
            const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
            bf.setIv(new Uint8Array([0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d]));

            const decoded = bf.decode(textEncoded);
            expect(decoded).to.eql(text);

            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode(text);
            expect(encoded).to.eql(textEncoded);
        }
    }, {
        describe: 'should correctly encode / decode russian text',
        test: function(Blowfish, expect) {
            const key = 'super key';
            const text = 'Строка на русском';
            const textEncoded = new Uint8Array([
                0x3f, 0xef, 0x94, 0xf6, 0xd9, 0x7c, 0x87, 0xc4, 0xc2, 0x44, 0x1c, 0x5f, 0x52, 0xc9, 0x2a, 0xc1,
                0x6b, 0xdc, 0x4e, 0x6c, 0xc8, 0xe2, 0x43, 0xad, 0x62, 0x08, 0xeb, 0x44, 0xcb, 0xe6, 0x42, 0xae
            ]);
            const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
            bf.setIv(new Uint8Array([0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d]));

            const decoded = bf.decode(textEncoded);
            expect(decoded).to.eql(text);

            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode(text);
            expect(encoded).to.eql(textEncoded);
        }
    }, {
        describe: 'should correctly encode / decode emoji text',
        test: function(Blowfish, expect) {
            const key = 'super key';
            const text = '🎅🎅🎅🎅🎅';
            const textEncoded = new Uint8Array([
                0x1c, 0x0d, 0x31, 0x07, 0x8f, 0x4d, 0x2e, 0x73, 0xc0, 0x9b, 0x20, 0x17, 0x27, 0x2e, 0x5a, 0x2e,
                0x85, 0x06, 0x07, 0xfb, 0x55, 0xd8, 0x50, 0x5b
            ]);
            const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
            bf.setIv(new Uint8Array([0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d]));

            const decoded = bf.decode(textEncoded);
            expect(decoded).to.eql(text);

            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode(text);
            expect(encoded).to.eql(textEncoded);
        }
    }]
}];

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = tests;
} else {
    this['tests'] = tests;
}
