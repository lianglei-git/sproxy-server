import {test, it, expect} from 'vitest';
import require from '../source/_require';
import lockone from './lock_1require'

test("for my require test", () => {
    it("only one js", () => { // ✅
        expect(require('./lock_1require')).toEqual(lockone);
    })

    it("To other references", () => {
        // TODO
    })
})


