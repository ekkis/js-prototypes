const pkg = require('./package.json');
const ver = semVerToInt(pkg.version);

module.exports = {
    install: (ls = ['array', 'string']) => {
        iterate(ls, (o, k, x) => {
            if (!o.prototype[k]) o.prototype[k] = x[k];
        })
    },
    uninstall: (ls = ['array', 'string', 'object']) => {
        iterate(ls, (o, k) => {
            delete o.prototype[k];
        })
    }
}

var extensions = {
    array: {
        unique() { 
            return this.filter((e, pos) => this.indexOf(e) == pos);
        },
        trim() {
            return this.map(s => typeof s == 'string' ? s.trim() : s);
        },
        flat(depth = 1) {
            var r = (ret, v) => ret.concat(Array.isArray(v) && depth > 0 ? v.flat(depth - 1) : v);
            return this.reduce(r, []);
        },
        unpack() {
            var l = this.length;
            return l == 1 ? this[0] 
                : l == 0 && arguments.length > 0
                ? undefined
                : this;
        }
    },
    string: {
        sprintf(o) {
            var s = this.toString();
            if (typeof o != 'object') return s;
            for (var k in o)
                s = s.replace(new RegExp('%{' + k + '}', 'g'), o[k]);
            return s;
        },
        trimln() {
            return this.trim()
                .replace(/^[ \t]*/gm, '')
                .replace(/([^\n])\n/g, '$1 ');
        },
        uc() { 
            return this.toUpperCase(); 
        },
        lc() { 
            return this.toLowerCase(); 
        }
    },
    object: {
        keys() {
            return Object.keys(this);
        },
        map(fn, acc = {}) {
            var r = (acc, k) => (fn(this, k, acc), acc);
            return this.keys().reduce(r, acc);
        },
        each(fn) {
            this.map(fn, this);    
        }
    }
}

// support functions

function iterate(ls, cb) {
    if (typeof type == 'string') type = [type];
    for (var i = 0; i < ls.length; i++) {
        var o = eval(ls[i].replace(ls[i][0], ls[i][0].toUpperCase()));
        if (o.ekkis >= ver) continue;
        o.ekkis = ver;
        var x = extensions[ls[i]];
        for (var k in x) {
            if (x.hasOwnProperty(k)) cb(o, k, x);
        }
    }
}

// https://gist.github.com/dislick/914e67444f8f71df3900bd77ccec6091
function semVerToInt(version) {
    // Split a given version string into three parts.
    let parts = version.split('.');
    // Check if we got exactly three parts, otherwise throw an error.
    if (parts.length !== 3) {
        throw new Error('Received invalid version string');
    }
    // Make sure that no part is larger than 1023 or else it
    // won't fit into a 32-bit integer.
    parts.forEach((part) => {
        if (part >= 1024) {
           throw new Error(`Version string invalid, ${part} is too large`);
        }
    });
    // Let's create a new number which we will return later on
    let numericVersion = 0;
    // Shift all parts either 0, 10 or 20 bits to the left.
    for (let i = 0; i < 3; i++) {
        numericVersion |= parts[i] << i * 10;
    }
    return numericVersion;
}