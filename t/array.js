var assert = require('assert').strict
const jsp = require('../index')

describe('Arrays', () => {
	before(() => {
		jsp.install()
	})
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
		it('Trims empty elements', () => {
			var actual = ['x','','y'].trim(true)
			var expected = ['x','y']
			assert.deepEqual(actual, expected)
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
	describe('keyval', () => {
		it('Base case', () => {
			var r = [
				{k: 'a', v: 1}, 
				{k: 'b', v: 2}, 
				{k: 'c', v: 3}
			]
			var expected = {a: 1, b: 2, c: 3}
			var actual = r.keyval()
			assert.deepEqual(actual, expected)
		})
		it('Named fields', () => {
			var r = [
				{key: 'a', val: 1}, 
				{key: 'b', val: 2}, 
				{key: 'c', val: 3}
			]
			var expected = {a: 1, b: 2, c: 3}
			var actual = r.keyval('key', 'val')
			assert.deepEqual(actual, expected)
		})
	})
})