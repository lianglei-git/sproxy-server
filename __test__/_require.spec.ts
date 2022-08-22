import {describe, test, it, expect} from 'vitest';
// import require from '../source/_require';
import lockone from './lock_1require'
import {resolve} from 'path'
describe("for my require test", () => {
    it("only one js", () => { // ✅

        expect(import('./lock_1require')).toEqual(lockone)
    })

    test("To other references", () => {
        // TODO
        // require(resolve(__dirname,'./lock_2require'))
        // expect().toEqual(lockone)
    })
})


