function resolve(method, func) {
    return require(`./${method}_${func}.js`).data;
}

module.exports = { resolve }