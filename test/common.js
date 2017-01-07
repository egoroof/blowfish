const tests = [{
    describe: 'ECB encode, padding: NULL',
    it: [{
        describe: 'should correctly encode english text',
        test: (Blowfish, expect) => {
            const key = 'key';
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode('omg');
            expect(encoded).to.eql(new Uint8Array([
                0x47, 0xc8, 0xbc, 0xd6, 0x78, 0xcf, 0x6b, 0x31
            ]));
        }
    }, {
        describe: 'should correctly encode russian text',
        test: (Blowfish, expect) => {
            const key = 'super key';
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode('Строка на русском');
            expect(encoded).to.eql(new Uint8Array([
                0x82, 0x6f, 0x71, 0xdd, 0xb2, 0x45, 0xd7, 0xb3, 0xf7, 0x20, 0xb6, 0x7b, 0x52, 0x90, 0x42, 0x74,
                0x44, 0x3f, 0x04, 0xc6, 0x8a, 0x0e, 0xc1, 0x74, 0x85, 0x79, 0x93, 0x89, 0x8b, 0xe7, 0xc0, 0x5b
            ]));
        }
    }, {
        describe: 'should correctly encode emoji text',
        test: (Blowfish, expect) => {
            const key = 'super key';
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode('🎅');
            expect(encoded).to.eql(new Uint8Array([
                0xe7, 0x19, 0xab, 0xbd, 0xf7, 0xd6, 0xfd, 0x9b
            ]));
        }
    }]
}, {
    describe: 'ECB decode, padding: NULL',
    it: [{
        describe: 'should correctly decode encoded english text',
        test: (Blowfish, expect) => {
            const key = 'super key';
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
            const encoded = new Uint8Array([
                0xc0, 0xe6, 0xe4, 0x13, 0xc5, 0x6c, 0xac, 0xd9, 0x0f, 0xe7, 0x53, 0x80, 0xef, 0xbf, 0x3f, 0xda
            ]);
            const decoded = bf.decode(encoded.buffer);
            expect(decoded).to.equal('Encoded string');
        }
    }]
}];

module.exports = tests;
