async function resolve(method, func) {
    return await require(`./${method}_${func}.js`).getData();
}

module.exports = { resolve }