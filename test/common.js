const tests = [{
    describe: 'ECB',
    it: [{
        describe: 'should correctly encode with NULL padding',
        test: (Blowfish, expect) => {
            const key = 'super key';
            const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
            bf.setReturnType(Blowfish.TYPE.UINT8_ARRAY);
            const encoded = bf.encode('Encoded string');
            expect(encoded).to.eql(new Uint8Array([
                0xc0, 0xe6, 0xe4, 0x13, 0xc5, 0x6c, 0xac, 0xd9, 0x0f, 0xe7, 0x53, 0x80, 0xef, 0xbf, 0x3f, 0xda
            ]));
        }
    }]
}];

module.exports = tests;
