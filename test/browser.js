/* global Blowfish */
/* eslint-disable prefer-arrow-callback */

window.tests.forEach(function (testPack) {
    describe(testPack.describe, function () {
        testPack.it.forEach(function (test) {
            it(test.describe, test.test.bind(null, Blowfish, window.expect));
        });
    });
});
