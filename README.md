[![npm version](https://badge.fury.io/js/js-prototypes.svg)](https://badge.fury.io/js/js-prototypes)

# Javascript Prototype Library

This collection of native-type prototype extensions in Javascript helps make expressions 
more terse and improves legibility.  The argument could be made that its use is unadvisable
within browsers as your mileage may vary due to the instability of these implementations,
but in NodeJs it works (and comes with a test suite)

## Install / Import
The project is published on NPM so install is easy:
```
npm install js-prototype-lib
```
...and to use in your projects, simply import it:
```js
// import the module
const jsp = require('js-prototype-lib');

// install classes of extensions
jsp.install();                      // installs array and string
jsp.install('object');              // installs object prototypes (see warnings)
jsp.install('array', 'string');     // same as .install()

// and use them
console.log([1,2,3].last());        // should print 3

// if the extensions are no longer needed
// they can be uninstalled

jsp.uninstall('object');            // just object extensions
jsp.uninstall();                    // or all
```

## Extensions

The following prototype extensions are provided by this package:

## Strings

  ### sprintf
  
  Very similar to the orignal C function but accepts an object with values to use as replacement
  and references are made with the `%{elem}` syntax
  e.g. `"Call my %{relative}".sprintf({relative: 'mother'})`
  
  ### chomp [regular-expression | string = '\n']

  Like its perl cousin, removes the string or regular expression from the end of the string.
  If left unspecified, defaults to a newline.  The function returns the new string

  ### tr <search-character-set> <replacement-character-set>

  Equivalent to the *bash* translate function, replaces characters in the search character set
  with those in the replacement character set.  The sets must be of equal length as the replacements
  are one-for-one e.g. `'double fast :)'.tr('a) ', 'i(_')` yields `'double_fist :('`

  ### replaceall search-str replace-str

  Does what `.replace()` should have done, allows for replacing more than one instance of a string
  with another

  ### unindent

  Useful for adjusting multi-line strings that, in order to conform to code indention, include
  indents that don't display well to the user.  Unlike with *bash* heredocs, the determinant
  factor is the opening tick:
  ```js
  // don't do this
  var o = {
    s: `first line
    second line`
  }
  // do this instead
  var o = {
    s: `
    first line
    second line
    `
  }
  ```
  The function respects embedding (with respect to the leading line) such that:
  ```js
  var o = {
    s: `
      first line
         second line
      third line
    `
  }
  console.log(o.s.unindent());
  ```
  displays:
  > first line
  >    second line
  > third line

  ### heredoc

  Adjusts the content of multi-line strings that represent paragraphs necessarily cut
  into separate lines for the sake of code neatness but that do not display well to 
  users.  The function requires developers to double their newlines to insert empty lines
  ```js
  var s = `
      This paragraph should be
      one continuous line but was cut
      into multiple lines
      \n
      This is a second paragraph
      `;
  console.log(s.heredoc())
  ```
  will display to users:
  > This paragraph should be one continuous line but was cut into multiple lines
  
  > This is a second paragraph

  ### uc / lc / tc

  Upper-case, lower-case and title-cases for strings.  Title case turns 'iN a liTTle bOOk' 
  into 'In a Little Book'

  ### q quote-set = "'"

  Quotes the string with the given character or character set.  If quote set
  is left unspecified, defaults to ticks.  The method will not double quote so
  passing `"'test'".q()` returns `'test'`, not `''test''`
  
  For characters sets the first character serves as opening and the second as
  closing e.g. `"test".q("{}")` results in `"{test}"`.  The function doesn't 
  close match so passing `"test".q("{")` results in `"{test{"`

  Additionally, the method respects embedded quotes and spacing so `"  Ender's game\t".q()`
  yields `"'  Ender's game\t'"` and `" 'test' "` produces `"' 'test' '"`

  Finally, as a convenience double quotes can be used to quote by passing an empty string
  e.g. `'test'.q("")` results in `"test"` -- this is equivalent but nicer than: `'test'.q('"')`

  ### keyval key-separator = "=", record-separator = "\n", quote-all = false

  Returns an object from a string containing key/value pairs where keys and records
  are separated by the given parameters

  The object produced will contain numbers where these are found in the source but
  if everything should be turned into a string the final parameter may be indicated
  as true

  ### arr [delimiter-character-set] [callback]

  Splits the string by the character set specified (which defaults to the set shown
  above) and returns the resulting array.  If an optional callback is supplied, the
  method will iterate through the resulting array, providing each element to the
  callback

  **Note: the default value for any method that accepts a `delimiter-character-set`
  is `'/|,;. \t\n'`, which notably breaks by spaces.  In such cases where spaces must
  be preserved, specify the character set explicitly**

  ### splitn [delimiter-character-set] [segments = 2]

  Splits a string into the number of segments specified, for example: `'this/that/these'.splitn()`
  will regenerate `['this', 'that/these']`.  If the number of segments specified is greater
  than those available, the function returns the shorter of the two.  Specifying a single
  segment will return the entire string in an array

  ### nth n [delimiter-character-set]

  Returns the nth value in a string separated by any of the characters in the delimiter
  set e.g. `'eth/eos/btc'.nth(0)` returns 'eth', `'eth eos btc'.nth(1)` returns 'eos', etc.

  The method can also accept negative indexes, which begin at the end of the array e.g.
  `'eth,eos,btc'.nth(-1)` returns 'btc'.  Though the set of delimiter characters is rather
  broad, you can also specify your own e.g. `'eth-eos-btc'.nth(0, '-')` returns 'eth'

  ### extract regular-expression empty = false

  Used to extract values from a string as specified in the regular expression passed.  
  
  Unlike regular matching, this function captures global and recursive capture groups i.e. 
  either by passing multiple capture sequences in the same expression, or by specifying
  the /g modifier to the regexp, which is not normally supported by the `.match()` method.

  **return value**
  Ordinarily the function returns an unpacked array i.e. when the array contains a single
  element then that element is returned instead.  If the return value is an empty array,
  the `empty` parameter can cause the function to return a) when set to `true`, the original
  string, or b) set to anything else returns what is passed

  Below are some examples:
  ```javascript
  // no match
  'now is the time'.extract(/(hello)/)                // returns []
  'now is the time'.extract(/(hello)/, true)          // returns 'now is the time'
  'now is the time'.extract(/(hello)/, 'awesome')     // returns 'awesome'
  
  // the query below provides multiple capture groups
  'now is the time for all good men'.extract(/now (\w+) the (\w+) for (\w+)/)
  // returns ['is', 'time', 'all']

  // the query below provides a recursive capture group
  'You say "goodbye" and I say "hello"'.extract(/"(\w+)"/g)
  // returns ['goodbye', 'hello']
  ```

  ## json

  Parses the given Json string, returning an object.  Empty or whitespace strings
  return an empty object instead of issuing an exception

  ### resolve
  ### mkdir / rmdir / ls
  ### fex / chmod / chown / fstat
  ### cat / tee / cp / mv / rm / symlink

  This family of functions provides filesystem functionality on file paths.
  The functions make use of the *Sync* versions in the 'fs' package and behave 
  pretty much like their bash equivalents

  **- Notes -**
  The `.resolve()` method is equivalent to `require('path').resolve()` and can
  be used to expand tildes, double-dots, etc. e.g. `'..'.resolve()` yields
  the full path to the parent directory, whilst `'~/.bashrc`.resolve()` returns
  the full path to the bash resource file
  
  Both `mkdir` and `rmdir` both recurse e.g. `'/tmp/a/b/c/d'.mkdir()` creates
  each component in the path as needed, but in the case of the latter an 
  explicit directive is needed i.e. `'/tmp/a'.rmdir()` will fail but
  `'/tmp/a'.rmdir({recurse: true})` succeeds
  
  Symlinks take the target as a parameter, so `'sym1'.symlink('/tmp/x')` creates
  a symlink called `sym1` pointing to `/tmp/x`

  The `tee` method is used for writing to files but has two modes, 1) where the
  argument specifies the path, and 2) where the object the method is called on
  serves as the path
  
  The determining factor for which is which is the presence of slashes in the argument,
  but this creates ambiguity.  Consider the third call below where neither is clearly
  a path (because there are no slashes).  In this case, the the argument is presumed
  to be data, but this can be forced with the option shown:
  ```js
  '/tmp/t.txt'.tee('sample text')           // these two calls
  'sample text'.tee('/tmp/t.txt')           // are equivalent

  't'.tee('sample text')                    // this call is ambiguous so the argument is presumed data
  'sample text'.tee('t', {argIsPath: true}) // the option forces the argument to serve as a path
  ```

  The `ls` command accepts two optional parameters, a regular expression to match
  names against, and an options object, which is passed to the underlying `fs.readdirSync()`
  method.  Options may be passed without supplying a regular expression and vice-versa.
  
  Like `rmdir`, this method also supports an explicit recursion directive, therefore
  `'/tmp'.ls({recurse: true})` will return the entire tree under the /tmp directory.  The
  attribute 'symlinks` is also supported such that when set to true recursive listings
  will follow symlinks

  Additionally, Node versions below 10 do not support the `withFileTypes` option but this
  method polyfills so the output is consistent:
  ```js
  var d = '/var/log';
  d.ls()                        // could return ['system.log', 'mail.log', 'postfix.log']
  d.ls(/^s/)                    // regular expressions are nicer.  returns: ['system.log']
  d.ls({withFileTypes: true})   // returns fs.Dirent objects
  ```
  Other examples:
  ```javascript
  '~/.profile'.cat()    // would return the contents of your profile
  'x.tst'.rm()          // removes the file
  '~/t.txt'.mv('/tmp')  // would move t.txt in your home directory to the /tmp
  
  // cat accepts an encoding
  var s = '~/.bashrc'.cat('utf8')
  ```

## Arrays

   ## lc / uc

   Uppercases or lowercases every element in the array.  Non-destructive so use it this
   way: `var ls = ['a','b','c']; ls = ls.uc()`

   ### unique
   
   As the name suggests, returns the contents or the array, without duplicates
   
   ### trim
   
   Trims the contents of the array.  Elements in the array are only trimmed if they are strings
   
   ### flat
   
   Flattens nested arrays.  This method behaves identically to the implementation available 
   in NodeJs 11.0.0 and serves as a polyfill for older versions
   
   ### last n = 0
   
   Returns the last element in the array, if called without arguments.  If passed an
   integer, the nth element from the tail is returned e.g. `.last(1)` returns the penultimate
   element, `.last(2)` the element before it, etc.
   
   ### unpack
   
   If the array contains a single element, this extension returns it, otherwise it returns
   the array.  If any argument is passed to the method and the array is empty, `undefined`
   is returned

   ### keyval key = 'k', val = 'v'

   Converts a key/value array into an object where the array elements are expected to have
   a key and a value with the names passed to this function e.g. `{k: 'a', v: 3}` which 
   converts to `{a: 3}`

   ### json

   Converts the array to a Json string
   
## Objects

Object prototypes are typically problematic for packages that are badly written (packages that do 
`for (var i in o)` without calling `.hasOwnProperty()`), and there are many of those, therefore 
this module creates the methods as non-enumerable, which will be perfectly safe

  ### isEmpty

  Returns a boolean value indicating whether the object contains any visible members (this excludes
  functions and other attributes created with `enumerable: false`)
  
  ### keys
  
  Equivalent to `Object.keys()`

  ### vals
  ### vals callback-function

  This function has two modes, the first of which returns an array of the values within the object,
  and the second of which executes a callback function on each of the values.  The callback receives
  a sole argument consisting of the value e.g.
  ```js
  {a:1, b:2}.vals()                     // returns [1,2]
  {a:1}.vals(v => { console.log(v) })   // prints 1
  ```

  ### slice keys

  Returns a new object containing only the properties specified in the base object.  The key list may
  be provided as an array or a string-array
  ```js
  {a:1, b:1, c:1}.slice(['a', 'c'])     // returns {a:1, c:1}
  {a:1, b:1, c:1}.slice('a/c')          // returns {a:1, c:1}
  ```

  ### uc / lc [keys]

  Uppercases or lowercases the values in an object.  If no arguments are passed, all keys in the
  object are operated upon.  Alternatively the caller may pass an array of keys or a string to be
  converted into an array using the `String.arr()` method

  ### map fn
  
  Returns an object transformed according to the function passed
  
  ### each fn 
  
  Iterates through the properties of an object, performing a caller-defined function

  ### concat / assign o...

  These functions behave similarly.  The merge the elements in the parameter list with
  those of the referenced object.  They differ in that `assign` modifies the reference
  object whereas `concat` does not.  Both functions return the result.  Use like this:
  ```js
  var o = {a:1}

  // concat is non destructive
  console.log(o.concat({b:1}, {c:1}))   // {a:1, b:1, c:1}
  console.log(o)                        // {a:1}

  // whereas assign modifies the reference object
  console.log(o.assign({d:1}))          // {a:1, d:1}
  console.log(o)                        // {a:1, d:1}

  // so these two calls are equivalent
  console.log(o.concat({e:1}))
  console.log({}.assign(o, {e:1}))
  ```

  ### mv/p descriptor

  These methods move (rename) keys in the object by providing a descriptor map.  The keys
  in the map indicate which keys in the object will be affected, and the values of the map,
  the new key names in the object e.g. to rename 'a' to 'b': `{a:1}.mv({a: 'b'})` (yields
  `{b:1}`).  Key collisions produce no error but overwrite the original value

  The methods also delete keys in the given object when the value provided in the map is
  falsy e.g. `{a:1,b:2}.mv(a: undefined)`, `{a:1,b:2}.mv(a: null)` and `{a:1,b:2}.mv(a: '')`
  all produce `{b:2}`

  Finally, there are two versions of the function: 1) `mv` and 2) `mvp` where the latter
  preserves the underlying object.  They can be used like this:
  ```js
  var o = {a:1, b:2}
  var p = o.mvp({a: 'c'})
  console.log(p)  // produces {c:1, b:2}
  console.log(o)  // but leaves orginal alone: {a:1, b:2}
  
  // but mv is destructive
  o.mv({a: 'c'})
  console.log(o)  // produces {c:1, b:2}
  ```

  ### rm/p list

  Like mv/p, this method comes in destructive and non-destructive modes.  The method
  accepts a list or array of keys to remove from the object e.g. `{a:1, b:2, c:3}.rm('a', 'b')`
  and `var ls = ['a','b']; {a:1, b:2, c:3}.rm(...ls)` both produce `{c:3}`.  I also
  accepts a string-array: `{a:1, b:2, c:3}.rm('a/b')`

  Please note that to pass an array, spread notation is needed

  ### keyval key = 'k', val = 'v'
  ### keyval {ks = '=', rs = '\n'}

  Converts an object into a key/value array where each array entry is an object with two
  attributes, one called 'k' (or whatever is supplied to the function) containing the key
  name, and the other 'v' for the value.  Cf. `[].keyval()`

  The method has a second signature that produces a string instead of an array.  Passing
  a single object as a parameter, containing the keys `ks` and `rs` for key and record 
  separators (defaulted as shown) produces a string with the object values

  ### notIn o

  Returns the set of keys in the object that are not found in `o`.  Use it like this:
  `{a:1, b:1, c:1}.notIn({a:2,b:2}) // returns ['c']`
  
  ### getpath path
  ### setpath path value

  This function pair gets and sets deeply embedded values in an object.  Both work regardless
  of whether the path exists, creating it as needed and the path can be expressed in dots or
  slashes, whichever is more comfortable to the user:
  ```js
  var o = {}
  o.setpath('a/b/c', 1)
  console.log(o.a.b.c)            // outputs 1
  // or
  var o = {a: {b: {c: 2}}}
  console.log(o.getpath('a/b/c')) // outputs 2

  // paths can also be expressed using dot notation
  var o = {}
  o.setpath('a.b.c', 1)
  console.log(o.getpath('a.b.c')) // outputs 1
  ```

  ### json

   Converts the object to a Json string

## Errors

Errors are not easily examinable, thus attempting to create a Json string from one will fail.
By installing the error module it is possible to extract the object within an error:
```js
const jsp = require('js-prototype-lib')
jsp.install('error')
try {
   throw new Error('test')
}
catch(e) {
    console.log(JSON.stringify(e))        // produces '{}', but
    console.log(JSON.stringify(e.obj()))  // generates {"message": "error", "stack": "Error: test\n at Context.it..."}
}
```

## Common

The objects *Array*, *String* *Object* and *Number* have also been marked up with properties
that facilitate determining their type.  This short-circuits the need to do `typeof x == '...'`
comparisons, which is inconsistent with arrays where the result is 'object'.  Additionally, the
`.typeof` property is also defined for each object

Below are the properties available:
```js
var x = '';
console.log(x.isStr);             // prints true
console.log(x.isArr);             // prints false
console.log(x.isObj);             // prints false
console.log(x.isNbr);             // prints false
console.log(x.typeof);            // prints 'string'
x = [];
console.log(x.isStr);             // prints false
console.log(x.isArr);             // prints true
console.log(x.isObj);             // prints false
console.log(x.isNbr);             // prints false
console.log(x.typeof);            // prints 'array'
x = {};
console.log(x.isStr);             // prints false
console.log(x.isArr);             // prints false
console.log(x.isObj);             // prints true
console.log(x.isNbr);             // prints false
console.log(x.typeof);            // prints 'object'
x = 0;
console.log(x.isStr);             // prints false
console.log(x.isArr);             // prints false
console.log(x.isObj);             // prints false
console.log(x.isNbr);             // prints true
console.log(x.typeof);            // prints 'number'
```

# Notes

As this module may be included at multiple levels of a project (a project includes it but a dependency
of the project also includes it), and the versions at each level differ, the codebase makes sure that
only the latest version available is installed.

To accomplish this the *Array*, *Object* and *String* objects are marked up with the attributes `library`
and `version`, thus to check what version is loaded you can:

```js
const jsp = require('js-prototype-lib')
console.log(jsp.version().SemVer)

// or load some functions and check the objects
jsp.install('string')
console.log(String.version)
```
both of which could show:

> 1.0.11

# Contribute

If you have an extension you're fond of, post an issue on Github.  We're happy to add new functionality

# Licence

MIT
