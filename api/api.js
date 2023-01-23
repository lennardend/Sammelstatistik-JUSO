async function resolve(method, func, request) {
    return await require(`./${method}_${func}.js`).getData(request);
}

module.exports = { resolve }