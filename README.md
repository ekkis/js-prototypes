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

## Arrays

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
   
## Objects

Object prototypes are typically problematic for packages that are badly written (packages that do 
`for (var i in o)` without calling `.hasOwnProperty()`), and there are many of those, therefore 
this module creates the methods as non-enumerable, which will be perfectly safe

  ### keys
  
  Equivalent to `Object.keys()`

  ### isEmpty

  Returns a boolean value indicating whether the object contains any visible members (this excludes
  functions and other attributes created with `enumerable: false`)
  
  ### map fn
  
  Returns an object transformed according to the function passed
  
  ### each fn 
  
  Iterates through the properties of an object, performing a caller-defined function

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
  o.mv({a: 'c})
  console.log(o)  // produces {c:1, b:2}
  ```

  ### rm/p list

  Like mv/p, this method comes in destructive and non-destructive modes.  The method
  accepts a list or array of keys to remove from the object e.g. `{a:1, b:2, c:3}.rm('a', 'b')`
  and `var ls = ['a','b']; {a:1, b:2, c:3}.rm(...ls)` both produce `{c:3}`

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
