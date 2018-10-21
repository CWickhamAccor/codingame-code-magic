const { copy } = require('../src/utils/tools');

describe('copy test', () => {
    it('testing on a basic object', () => {
        let a = { a: 1 };
        const b = copy(a);
        a = null;
        expect(b).toEqual({ a: 1 });
    });
});
