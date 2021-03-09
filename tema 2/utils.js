const checkRouteParams = (requiredParams = [], givenParams = {}) => {
    return requiredParams.map(param => Object.keys(givenParams).indexOf(param) !== -1).reduce((a, b) => a && b, true);
}

module.exports.checkRouteParams = checkRouteParams;