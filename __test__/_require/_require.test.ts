import { describe, test, it, expect } from 'vitest';
import require from '../../source/_require';
import lock1 from './lock_1require'
import { resolve } from 'path'
describe("for my require test", () => {
    it("only one js", () => { // ✅
        expect(require('./__test__/lock_1require')).toEqual(lock1)
    })

    test("To other references", () => { // ❌
        // TODO
        expect(require('./__test__/lock_2require')).toEqual({
            age: 98,
            name: 99
        })
    })
})


