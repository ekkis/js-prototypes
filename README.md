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

## Arrays

   ### unique
   
   As the name suggests, returns the contents or the array, without duplicates
   
   ### trim
   
   Trims the contents of the array.  Elements in the array are only trimmed if they are strings
   
   ### flat
   
   Flattens nested arrays.  This method behaves identically to the implementation available 
   in NodeJs 11.0.0 and serves as a polyfill for older versions
   
   ### last(n)
   
   Returns the last element in the array, if called without arguments.  If passed an
   integer, the nth element from the tail is returned e.g. `.last(1)` returns the penultimate
   element, `.last(2)` the element before it, etc.
   
   ### unpack
   
   If the array contains a single element, this extension returns it, otherwise it returns
   the array.  If any argument is passed to the method and the array is empty, `undefined`
   is returned

   ### keyval(key = 'k', val = 'v')

   Converts a key/value array into an object where the array elements are expected to have
   a key and a value with the names passed to this function e.g. `{k: 'a', v: 3}` which 
   converts to `{a: 3}`
   
## Strings

  ### sprintf
  
  Very similar to the orignal C function but accepts an object with values to use as replacement
  and references are made with the `%{elem}` syntax
  e.g. `"Call my %{relative}".sprintf({relative: 'mother'})`
  
  ### uc

  A shorter name for `.toUpperCase()`
  
  ### lc
  
  A shorter name for `.toLowerCase()`

  ### tc

  Title case.  Turns 'iN a liTTle bOOk' into 'In a Little Book'.
  
## Objects

Object prototypes are typically problematic for packages that are badly written (packages that do 
`for (var i in o)` without calling `.hasOwnProperty()`), and there are many of those, therefore 
this module creates the methods as non-enumerable, which will be perfectly safe

  ### keys
  
  Equivalent to `Object.keys()`
  
  ### map(fn)
  
  Returns an object transformed according to the function passed
  
  ### each(fn)
  
  Iterates through the properties of an object, performing a caller-defined function

  ### keyval(key = 'k', val = 'v')

  Converts an object into a key/value array where each array entry is an object with two
  attributes, one called 'k' (or whatever is supplied to the function) containing the key
  name, and the other 'v' for the value.  Cf. `[].keyval()`
  
## Common

Each of *Array*, *String* and *Object* provide method to determine type such as `.isObj()`,
`.isStr()` and `.isArr()` that will indicate when a variable contains a certain type of object.
This can be used like this:
```js
var x = '';
console.log(x.isStr());             // prints true
console.log(x.isArr());             // prints false
console.log(x.isObj());             // prints false
x = [];
console.log(x.isStr());             // prints false
console.log(x.isArr());             // prints true
console.log(x.isObj());             // prints false
x = {};
console.log(x.isStr());             // prints false
console.log(x.isArr());             // prints false
console.log(x.isObj());             // prints true
```

# Notes

As this module may be included at multiple levels of a project (a project includes it but a dependency
of the project also includes it), and the versions at each level differ, the codebase makes sure that
only the latest version available is installed.

To accomplish this the *Array*, *Object* and *String* objects are marked up with the attributes `library`
and `version` which indicate such that:

```js
console.log(String.version)
```
may show:

> 1

which would correspond to '1.0.0' -- if that version of the package has been installed

# Contribute

If you have an extension you're fond of, post an issue on Github.  We're happy to add new functionality

# Licence

MIT
