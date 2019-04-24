var assert = require('assert').strict
const jsp = require('../index')

describe('Strings', () => {
	before(() => {
		jsp.install('string')
	})
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
	describe('unindent', () => {
		it('Pre-trimmed', () => {
			var actual = 'x'.unindent()
			assert.equal(actual, 'x')
		})
		it('Trims leading spaces', () => {
			var actual = '   x'.unindent()
			assert.equal(actual, 'x')
		})
		it('Trims leading tabs', () => {
			var actual = '\t\tx'.unindent()
			assert.equal(actual, 'x')
		})
		it('Trims mixed whitespace', () => {
			var actual = ' \tx'.unindent()
			assert.equal(actual, 'x')
		})
		it('Trims trailing whitespace', () => {
			var actual = ' \tx\t\t  '.unindent()
			assert.equal(actual, 'x')
		})
		it('Multi-line - No trailing', () => {
			var actual = `
			x
			y`;
			assert.equal(actual.unindent(), 'x\ny')
		})
		it('Multi-line - Trailing', () => {
			var actual = `
			x
			y
			`;
			assert.equal(actual.unindent(), 'x\ny')
		})
		it('Multi-line - Respects embedding', () => {
			var actual = `
			x
			\ty
			  z
			`;
			assert.equal(actual.unindent(), 'x\n\ty\n  z')
		})
		it('Multi-line - Does not manage outdentions', () => {
			var actual = `
			  x
			y
			`;
			assert.equal(actual.unindent(), 'x\n\t\t\ty')
		})
	})
	describe('heredoc', () => {
		it('Joins multilines', () => {
			var actual = 'line1\nline2\nline3'.heredoc()
			assert.equal(actual, 'line1 line2 line3')
		})
		it('Respects double lines', () => {
			var actual = 'line1\n\nline2\n\nline3'.heredoc()
			assert.equal(actual, 'line1 \nline2 \nline3')
		})
	})
	describe('keyval', () => {
		it('Base case', () => {
			var input = 'a=1\nb=2\nc=string'
			var actual = input.keyval()
			var expected = {a:1, b:2, c:"string"}
			assert.deepEqual(actual, expected)
		})
		it('Supports key separator', () => {
			var input = 'a:1\nb:2\nc:string'
			var actual = input.keyval(':')
			var expected = {a:1, b:2, c:"string"}
			assert.deepEqual(actual, expected)
		})
		it('Supports line separator', () => {
			var input = 'a:1;b:2;c:string'
			var actual = input.keyval(':', ';')
			var expected = {a:1, b:2, c:"string"}
			assert.deepEqual(actual, expected)
		})
		it('Can quote all fields', () => {
			var input = 'a=1;b=2;c=string'
			var actual = input.keyval('=', ';', true)
			var expected = {a:"1", b:"2", c:"string"}
			assert.deepEqual(actual, expected)
		})
		it('Manages empty fields', () => {
			var input = 'a=1;b=2;;c=string'
			var actual = input.keyval('=', ';', true)
			var expected = {a:"1", b:"2", c:"string"}
			assert.deepEqual(actual, expected)
		})
		it('Produces empty keys', () => {
			var input = 'a=1;b=;c=string'
			var actual = input.keyval('=', ';', true)
			var expected = {a:"1", b:'', c:"string"}
			assert.deepEqual(actual, expected)
		})
	})
	describe('quoting', () => {
		it('Base case', () => {
			var actual = "test".q()
			assert.equal(actual, "'test'")
		})
		it('Prequoted', () => {
			var actual = "'test'".q()
			assert.equal(actual, "'test'")
		})
		it('Embedded quotes protected', () => {
			var actual = "test's failure".q()
			assert.equal(actual, "'test's failure'")
		})
		it('Respects whitespace', () => {
			var actual = "\ttest's failure  ".q()
			assert.equal(actual, "'\ttest's failure  '")
		})
		it('Double quotes', () => {
			var actual = 'test'.q('"')
			assert.equal(actual, '"test"')
		})
		it('Supports sets', () => {
			var actual = 'test'.q('{}')
			assert.equal(actual, '{test}')
		})
		it('Supports square brackets', () => {
			var actual = 'test'.q('[]')
			assert.equal(actual, '[test]')
		})
		it('Empty quotes', () => {
			var actual = 'test'.q("")
			assert.equal(actual, '"test"')
		})
	})
	describe('case functions', () => {
		var s = 'in a littLe bOOk';
		it ('Uppercases', () => {
			var actual = s.uc()
			var expected = s.toUpperCase()
			assert.equal(actual, expected)
		})
		it ('Lowercases', () => {
			var actual = s.lc()
			var expected = s.toLowerCase()
			assert.equal(actual, expected)
		})
		it ('Titlecases', () => {
			var actual = s.tc()
			var expected = 'In a Little Book'
			assert.equal(actual, expected)
		})
	})
	describe('list management', () => {
		it ('nth - empty', () => {
			var input = ''
			var actual = input.nth(0)
			assert.equal(actual, '')
		})
		it ('nth - base case', () => {
			var input = 'ett/två/tre'
			assert.equal(input.nth(0), 'ett')
			assert.equal(input.nth(1), 'två')
			assert.equal(input.nth(2), 'tre')
		})
		it ('nth - index exceeds', () => {
			var input = 'ett/två/tre'
			assert.equal(input.nth(3), '')
		})
		it ('nth - negative index', () => {
			var input = 'ett/två/tre'
			assert.equal(input.nth(-1), 'tre')
			assert.equal(input.nth(-2), 'två')
		})
		it ('nth - delimiter defaults', () => {
			assert.equal('ett|två|tre'.nth(0), 'ett', 'Pipes failed')
			assert.equal('ett två tre'.nth(0), 'ett', 'Spaces failed')
			assert.equal('ett,två,tre'.nth(0), 'ett', 'Commas failed')
			assert.equal('ett;två;tre'.nth(0), 'ett', 'Semicolons failed')
			assert.equal('ett.två.tre'.nth(0), 'ett', 'Dots failed')
			assert.equal('ett\ttvå\ttre'.nth(0), 'ett', 'Tabs failed')
			assert.equal('ett\ntvå\ntre'.nth(0), 'ett', 'Newlines failed')
		})
		it ('nth - delimiter options', () => {
			assert.equal('ett#två#tre'.nth(0, '#'), 'ett')
		})
		it ('nth - empty elements', () => {
			assert.equal('ett//två///tre'.nth(1), 'två')
		})
	})
})
