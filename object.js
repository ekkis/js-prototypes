module.exports = {
    keys() {
        return Object.keys(this);
    },
    isEmpty() {
        return this.keys().length == 0;
    },
    map(fn, acc = {}) {
        var r = (acc, k) => (fn(this, k, acc), acc);
        return this.keys().reduce(r, acc);
    },
    each(fn) {
        this.keys().forEach(k => fn(k, this))  
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
    notIn(o) {
        var ok = o.keys();
        return this.keys().filter(k => ok.indexOf(k) == -1);
    },
    getpath(path) {
        var p = mkpath(this, path);
        return p.o[p.k]; 
    },
    setpath(path, v) {
        var p = mkpath(this, path);
        p.o[p.k] = v;
        return p.o;
    },
    json() {
        return JSON.stringify(this);
    }
}

function mkpath(o, path) {
    path = path.replace(/\./g, '/').split('/');
    var k = path.pop();
    path.forEach(k => { if (!o[k]) o[k] = {}; o = o[k]; })
    return {k, o};
}