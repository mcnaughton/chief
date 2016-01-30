define(['src/chief'], function (chief) {
    'use strict';
    var promise = false;
    beforeEach(function(done) {
        chief.then(function() {
            promise = true;
            done()
        });
    });
    describe('chief', function () {
        it('should export something', function() {
            expect(undefined === chief).toEqual(false);
        });
        it('should export a promise', function() {
            expect(promise).toEqual(true);
        });
    });
});
