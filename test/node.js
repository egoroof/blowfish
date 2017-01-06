const tests = require('./common');
const expect = require('chai').expect;
const Blowfish = require('../dist/blowfish');

tests.forEach((testPack) => {
    describe(testPack.describe, () => {
        testPack.it.forEach((test) => {
            it(test.describe, test.test.bind(null, Blowfish, expect));
        });
    });
});
