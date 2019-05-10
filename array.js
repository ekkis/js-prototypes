module.exports = {
    lc() {
        return this.map(o => o.lc());
    },
    uc() {
        return this.map(o => o.uc());
    },
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
    json() {
        return JSON.stringify(this);
    }
}

