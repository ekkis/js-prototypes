var jspath = require('path');
var flat = require('./array').flat

var self = module.exports = {
    fs: require('fs'),
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
    unindent() {
        var level = this.match(/^\n?([ \t]*)/);
        var re = new RegExp('^' + level[1], 'gm');
        return this.trim().replace(re, '');
    },
    heredoc() {
        return this.unindent()
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
        if (!v) v = '"';
        var [qb, qe] = v.split('');
        if (!qe) qe = qb;
        var re = new RegExp("^[X]|[X]$".replace(/X/g, v), "g");
        return qb + this.replace(re, '') + qe;
    },
    arr(dc, cb) {
        if (typeof dc == 'function') { cb = dc; dc = '' }
        var ret = this.split(charSet(dc));
        if (!cb) return ret;
        ret.forEach(v => cb(v));
    },
    splitn(dc, n = 2) {
        if (Number.isInteger(dc)) { n = dc; dc = ''}
        if (n < 2) return [this.toString()];
        if (!dc) dc = '/|,;.\t\n';
        
        var ret = [], s = this.toString();
        for (var i = 0; i < n - 1; i++) {
            let m = s.match(charSet(dc));
            if (!m) break;
            ret[i] = s.substr(0, m.index);
            s = s.substr(m.index + m[0].length);
        }
        ret[i] = s;
        return ret;
    },
    nth(n, dc) {
        var r = this.arr(dc);
        if (n < 0) n = r.length + n;
        return r[n] || '';
    },
    extract(re, empty = false) {
        var m, ret = [];
        if (isRegExpGlobal(re))
            while (m = re.exec(this)) ret = ret.concat(m.slice(1));
        else {
            m = this.match(re);
            if (m) ret = m.slice(1);
        }
        return ret.length == 0
            ? (empty == true 
                ? this.toString() 
                : (empty == false ? ret : empty)
            )
            : ret.length == 1 
            ? ret[0] 
            : ret;
    },
    json() {
        return JSON.parse(this);
    },
    resolve() {
        return jspath.resolve(this.toString());
    },
    mkdir(opts) {
        // var path = this.toString();
        // self.fs.mkdirSync(path, Object.assign(opts, {recursive: true}));
        var path = this.toString().resolve().split('/');
        for (var i = 2; i <= path.length; i++) {
            var d = path.slice(0, i).join('/');
            if (!self.fs.existsSync(d))
                self.fs.mkdirSync(d, opts);
        }
    },
    rmdir(opts = {}) {
        var path = this.toString();
        if (opts.recurse) path.ls({recurse: true, withFileTypes: true})
            .sort((a,b) => a.name.length < b.name.length ? 1 : -1)
            .forEach(o => {
                if (o.isDirectory()) self.fs.rmdirSync(o.name);
                else self.fs.unlinkSync(o.name);
            })
        self.fs.rmdirSync(path);
    },
    ls(re, opts = {}) {
        var path = this.toString();
        if (re) {
            var rex = re instanceof RegExp;
            if (!rex) { opts = re; re = undefined; }
        }
        var ret;
        if (!opts.recurse) ret = ls(path, re, opts);
        else {
            ret = lsr(path, re, opts);
            if (!opts.withFileTypes) ret = ret.map(o => o.name);
        }
        if (rex) ret = ret.filter(nm => (
            typeof nm == 'object' ? nm.name : nm).match(re)
        );
        return ret;
    },
    cat(opts = 'utf8') {
        return self.fs.readFileSync(this.toString(), opts);
    },
    tee(s, opts = {}) {
        var argIsPath = 'argIsPath' in opts
            ? opts.argIsPath 
            : s.indexOf('/') > -1
            ;
        var [path, data] = swap(!argIsPath, s, this.toString());
        self.fs.writeFileSync(path, data, opts);
    },
    cp(dst, flags) {
        self.fs.copyFileSync(this.toString(), dst, flags);
    },
    mv(dst) {
        self.fs.renameSync(this.toString(), dst);
    },
    rm() {
        self.fs.unlinkSync(this.toString());
    },
    chmod(mode) {
        return self.fs.chmodSync(this.toString(), mode);
    },
    chown(uid, gid) {
        self.fs.chownSync(this.toString(), uid, gid);
    },
    fex() {
        return self.fs.existsSync(this.toString());
    },
    fstat(opts) {
        return self.fs.statSync(this.toString(), opts);
    }
}

function isRegExpGlobal(re) {
    var mods = re.toString().split('/')[2];
    return mods.indexOf('g') > -1;
}

function charSet(dc) {
    if (!dc) dc = '/|,;.\t\n';
    return new RegExp('[' + dc + ']+');
}

function swap(cond, a, b) {
    return cond ? [b, a] : [a, b];
}

function ls(path, re, opts = {}) {
    var ret = self.fs.readdirSync(path, opts);
    // node v8 does not support withFileTypes so we must emulate it
    if (opts.withFileTypes && typeof ret[0] == 'string') {
        ret = ret.map(fn => {
            var ret = self.fs.statSync(path + '/' + fn)
            if (!ret.name) ret.name = fn;   // node v8 doesn't return the name
            return ret;
        })
    }
    return ret;
}

function lsr(path, re, opts) {
    if (!path.endsWith('/')) path += '/'
    try {
        var ret = ls(path, re, Object.assign({withFileTypes: true}, opts))
            .map(o => {
                o.name = path + o.name;
                var ret = [o]
                if (o.isDirectory()) 
                    ret = ret.concat(lsr(o.name, re, opts))
                return ret;
            })
        return Array.prototype.flat ? ret.flat() : flat(ret);
    }
    catch(e) {
        console.error(e);
    }        
}