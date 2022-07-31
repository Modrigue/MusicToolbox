"use strict";
function getRandomNumber(minNumber, maxNumber /* included */) {
    return Math.floor(minNumber + (maxNumber + 1 - minNumber) * Math.random());
}
function getRandomGaussianNumber(minNumber, maxNumber /* included */) {
    return Math.floor(minNumber + (maxNumber + 1 - minNumber) * randomGauss());
}
function randomGauss() {
    const nbRandomCalls = 3;
    let res = 0;
    for (let i = 0; i < nbRandomCalls; i++)
        res += Math.random();
    return res / nbRandomCalls;
}
//# sourceMappingURL=random_tools.js.map