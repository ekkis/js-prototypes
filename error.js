module.exports = {
    obj() {
        var r = (acc, k) => (acc[k] = this[k], acc);
        return Object.getOwnPropertyNames(this).reduce(r, {})
    },
    json() {
        return JSON.stringify(this.obj());
    }
}