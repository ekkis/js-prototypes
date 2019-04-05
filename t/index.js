var assert = require('assert').strict
const jsp = require('../index')

jsp.install('string', 'array', 'object')

describe('Prototypes', () => {
    describe('Arrays', () => {
        describe('unique', () => {
            it('Handles empty arrays', () => {
                var actual = [].unique();
                assert.deepEqual(actual, [])
            })
            it('Handles simple arrays', () => {
                var actual = [2, 3, 2, 5, 2].unique()
                assert.equal(actual.length, 3)
            })
            it('Handles arrays with objects', () => {
                var actual = [{n: 1}, {n: 2}, {n: 1}]
                assert.equal(actual.length, 3)
            })
        })
        describe('trim', () => {
            it('Empty array', () => {
                var actual = [].trim()
                assert.ok(Array.isArray(actual))
                assert.equal(actual.length, 0)
            })
            it('Base case', () => {
                var actual = ['  test\t'].trim()
                assert.deepEqual(actual, ['test'])
            })
            it('Multiple elements', () => {
                var actual = ['  test\t', '\t\ttest 2   '].trim()
                assert.deepEqual(actual, ['test', 'test 2'])
            })
            it('Non strings - objects', () => {
                var actual = ['  test\t', {x: 1}].trim()
                assert.deepEqual(actual, ['test', {x: 1}])
            })
            it('Array non recursion', () => {
                var actual = ['  test\t', [' inner ', '\tinner\t']].trim()
                assert.deepEqual(actual, ['test', [' inner ', '\tinner\t']])
            })
        })
        describe('flat', () => {
            it('Handles empty arrays', () => {
                var actual = [].flat()
                assert.ok(Array.isArray(actual))
                assert.equal(actual.length, 0)
            })
            it('Flat input', () => {
                var actual = [1, 3, 3];
                assert.deepEqual(actual.flat(), actual)
            })
            it('Base case', () => {
                var actual = [1, [2,3], 4].flat();
                assert.deepEqual(actual, [1,2,3,4])
            })
            it('Recursive', () => {
                var actual = [1, [2,[3,4]], 5].flat(2);
                assert.deepEqual(actual, [1,2,3,4,5])
            })
        })
        describe('last', () => {
            it('Empty array', () => {
                var actual = [].last();
                assert.equal(actual, undefined);
            })
            it('Niladic call', () => {
                var actual = [1,2,3].last();
                assert.equal(actual, 3)
            })
            it('Position specifier', () => {
                var actual = [1,2,3].last(1);
                assert.equal(actual, 2)
            })
        })
        describe('upack', () => {
            it('Empty array', () => {
                var actual = [].unpack()
                assert.ok(Array.isArray(actual))
                assert.equal(actual.length, 0)
            })
            it('Empty array with modifier', () => {
                var actual = [].unpack(true)
                assert.equal(typeof actual, 'undefined')
            })
            it('Array with single element (integer)', () => {
                var actual = [3].unpack()
                assert.equal(typeof actual, 'number')
                assert.equal(actual, 3)
            })
            it('Array with single element (object)', () => {
                var actual = [{n: 1}].unpack()
                assert.deepEqual(actual, {n: 1})
            })
            it('Array with multiple elements', () => {
                var actual = 'a/b/c'.split('/').unpack()
                assert.deepEqual(actual, ['a', 'b', 'c'])
            })
        })
    })
    describe('Strings', () => {
        describe('sprintf', () => {
            it('Base case', () => {
                var actual = 'math: %{a} + %{b}'.sprintf({a: 1, b: 2})
                assert.equal(actual, 'math: 1 + 2')
            })
            it('Missing parameters', () => {
                var actual = 'math: %{a} + %{b}'.sprintf()
                assert.equal(actual, 'math: %{a} + %{b}')
            })
            it('String parameter', () => {
                var actual = 'math: %{a} + %{a}'.sprintf('')
                assert.equal(actual, 'math: %{a} + %{a}')
            })
            it('Multiple instances', () => {
                var actual = 'math: %{a} + %{a}'.sprintf({a: 1})
                assert.equal(actual, 'math: 1 + 1')
            })
        })
        describe('trimln', () => {
            it('Trims leading spaces', () => {
                var actual = '   x'.trimln()
                assert.equal(actual, 'x')
            })
            it('Trims leading tabs', () => {
                var actual = '\t\tx'.trimln()
                assert.equal(actual, 'x')
            })
            it('Trims mixed whitespace', () => {
                var actual = ' \tx'.trimln()
                assert.equal(actual, 'x')
            })
            it('Joins multilines', () => {
                var actual = 'line1\nline2\nline3'.trimln()
                assert.equal(actual, 'line1 line2 line3')
            })
            it('Respects double lines', () => {
                var actual = 'line1\n\nline2\n\nline3'.trimln()
                assert.equal(actual, 'line1 \nline2 \nline3')
            })
        })
    })
    describe('Objects', () => {

    })
})
