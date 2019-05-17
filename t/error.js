const assert = require('assert').strict
const jsp = require('../index')

describe('Errors', () => {
	before(() => {
		jsp.install('error')
	})
	it('Objectises errors', () => {
		try {
			throw new Error('test')
		}
		catch(e) {
			var actual = e.obj()
			assert.equal(Object.keys(actual).length, 2)
			assert.equal(actual.message, 'test')
			assert.ok(actual.stack.length > 0)
		}
	})
})
