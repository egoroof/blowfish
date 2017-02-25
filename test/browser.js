window.tests.forEach(function (testPack) {
    describe(testPack.describe, function () {
        testPack.it.forEach(function (test) {
            it(test.describe, test.test.bind(null, Blowfish.default, window.expect));
        });
    });
});
