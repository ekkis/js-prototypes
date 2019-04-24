var assert = require('assert').strict
const jsp = require('../index')

describe('Type properties', () => {
	before(() => {
		jsp.setIsProperties();
	})
	describe('Numbers', () => {
		var x = 0;
		it('isNbr', () => {
			assert.ok(x.isNbr)
		})
		it('isStr', () => {
			assert.ok(!x.isStr)
		})
		it('isArr', () => {
			assert.ok(!x.isArr)
		})
		it('isObj', () => {
			assert.ok(!x.isObj)
		})
		it('typeof', () => {
			assert.equal(x.typeof, 'number')
		})
	})
	describe('Strings', () => {
		var x = ''
		it('isNbr', () => {
			assert.ok(!x.isNbr)
		})
		it('isStr', () => {
			assert.ok(x.isStr)
		})
		it('isArr', () => {
			assert.ok(!x.isArr)
		})
		it('isObj', () => {
			assert.ok(!x.isObj)
		})
		it('typeof', () => {
			assert.equal(x.typeof, 'string')
		})
	})
	describe('Arrays', () => {
		var x = []
		it('isNbr', () => {
			assert.ok(!x.isNbr)
		})
		it('isStr', () => {
			assert.ok(!x.isStr)
		})
		it('isArr', () => {
			assert.ok(x.isArr)
		})
		it('isObj', () => {
			assert.ok(!x.isObj)
		})
		it('typeof', () => {
			assert.equal(x.typeof, 'array')
		})
	})
	describe('Objects', () => {
		var x = {}
		it('isNbr', () => {
			assert.ok(!x.isNbr)
		})
		it('isStr', () => {
			assert.ok(!x.isStr)
		})
		it('isArr', () => {
			assert.ok(!x.isArr)
		})
		it('isObj', () => {
			assert.ok(x.isObj)
		})
		it('typeof', () => {
			assert.equal(x.typeof, 'object')
		})
	})
})
