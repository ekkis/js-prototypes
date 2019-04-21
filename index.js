const pkg = require('./package.json');
const VER = semVerToInt(pkg.version);

var extensions = {
    string: {
        uc() { 
            return this.toUpperCase(); 
        },
        lc() { 
            return this.toLowerCase(); 
        },
        tc() {
            return this.toLowerCase().split(/\b/)
                .map(s => s.length > 1 ? (s.charAt(0).toUpperCase() + s.substr(1)) : s)
                .join('');
        },
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
        keyval(ks = "=", rs = "\n", qa = false) {
            var ret = {};
            this.split(rs).forEach(s => {
                if (!s) return;
                var [k, v] = s.split(ks);
                ret[k] = v.match(/^\d+(?:\.\d+)?$/) && !qa ? parseFloat(v) : v;
            });
            return ret;
        },
        q(v = "'") {
            var [qb, qe] = v.split('');
            if (!qe) qe = qb;
            var re = new RegExp("^[X]|[X]$".replace(/X/g, v), "g");
            return qb + this.replace(re, '') + qe;
        },
        isStr: true,
        isArr: false,
        isObj: false
    },
    array: {
        unique() { 
            return this.filter((e, pos) => this.indexOf(e) == pos);
        },
        trim(nonempty = false) {
            var ret = this;
            if (nonempty) ret = ret.filter(s => !!s);
            return ret.map(s => typeof s == 'string' ? s.trim() : s);
        },
        flat(depth = 1) {
            var r = (ret, v) => ret.concat(Array.isArray(v) && depth > 0 ? v.flat(depth - 1) : v);
            return this.reduce(r, []);
        },
        last(n = 0) {
            return this[this.length - (n + 1)];
        },
        unpack() {
            var l = this.length;
            return l == 1 ? this[0] 
                : l == 0 && arguments.length > 0
                ? undefined
                : this;
        },
        keyval(key = 'k', val = 'v') {
            var r = (acc, v) => { acc[v[key]] = v[val]; return acc; };
            return this.reduce(r, {});
        },
        isStr: false,
        isArr: true,
        isObj: false
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
        },
        keyval(key = 'k', val = 'v') {
            if (key.isObj) {
                var opts = {ks: '=', rs: '\n'}.concat(key);
                var r = (o, k, acc) => {
                    acc.push(k + opts.ks + o[k]);
                    return acc;
                }
                return this.map(r, []).join(opts.rs);
            }
            var r = (o, k, acc) => {
                acc.push({[key]: k, [val]: o[k]});
                return acc;
            }
            return this.map(r, []);
        },
        concat(...ls) {
            return Object.assign(this, ...ls);
        },
        mv(o) {
            o.map((self, k, acc) => {
                if (o[k]) this[o[k]] = this[k];
                delete this[k];
            })
            return this;
        },
        mvp(o) {
            return this.map((self, k, acc) => {
                if (k in o) {
                    if (o[k]) acc[o[k]] = self[k];
                }
                else acc[k] = self[k];
            })
        },
        rm(...ls) {
            ls.forEach(k => delete this[k]);
            return this;
        },
        rmp(...ls) {
            var ret = {}.concat(this);
            ls.forEach(k => delete ret[k]);
            return ret;
        },
        isStr: false,
        isArr: false,
        isObj: true
    }
}

var self = module.exports = {
    extensions,
    force: false,
    install(...r) {
        if (r.length == 0) r = ['array', 'string', 'object'];
        iterate(this.ls(...r), (o, nm, fn) => {
            const lib = 'js-prototype-lib';
            if (!o.library) o.library = lib;
            if (o.library != lib || (o.version || 0) > VER) return;
    
            o.version = VER;
            if (!o.prototype[nm] || self.force) Object.defineProperty(
                o.prototype, nm, {
                    configurable: true, enumerable: false,
                    writable: true, value: fn,
                }
            );
        })
    },
    uninstall(...r) {
        if (r.length == 0) r = ['array', 'string', 'object'];
        iterate(this.ls(...r), (o, k) => {
            delete o.prototype[k];
        })
    },
    ls(...ls) {
        return ls.map(
            k => (k in extensions)
            ? Object.keys(extensions[k]).map(s => k + ':' + s)
            : k
        )
        .reduce((ret, v) => ret.concat(v), []);
    }
}

// support functions

function iterate(ls, cb) {
    for (var i = 0; i < ls.length; i++) {
        var [prot, fn] = ls[i].split(':');
        var o = eval(prot.replace(prot[0], prot[0].toUpperCase()));
        cb(o, fn, extensions[prot][fn]);
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