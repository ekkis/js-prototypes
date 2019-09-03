const assert = require('assert').strict
const jsp = require('../index')

describe('Errors', () => {
	before(() => {
		jsp.install('error')
	})
	it('Object-ises errors', () => {
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
	it('Json-ises errors', () => {
		try {
			throw new Error('test')
		}
		catch(e) {
			var actual = e.json().replace(/\/Users\/\w+/g, '')
			var expected = '{"stack":"Error: test\\n    at Context.it (/dev/js-prototype-lib/t/error.js:21:10)\\n    at callFn (/.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runnable.js:387:21)\\n    at Test.Runnable.run (/.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runnable.js:379:7)\\n    at Runner.runTest (/.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runner.js:525:10)\\n    at /.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runner.js:643:12\\n    at next (/.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runner.js:437:14)\\n    at /.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runner.js:447:7\\n    at next (/.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runner.js:362:14)\\n    at Immediate._onImmediate (/.nvm/versions/node/v11.5.0/lib/node_modules/mocha/lib/runner.js:415:5)\\n    at processImmediate (timers.js:632:19)","message":"test"}' 
			assert.equal(actual, expected)
		}
	})
})
