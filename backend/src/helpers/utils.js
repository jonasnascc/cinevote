function wilsonScore(positive, negative) {
    const n = positive + negative;
    if (n === 0) return 0;

    const z = 1.96; // 95% confidence
    const phat = positive / n;

    return (
        (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) /
        (1 + z * z / n)
    );
}

module.exports = {
    wilsonScore
}