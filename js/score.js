/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }

    // Old formula
    /*
    let score = (100 / Math.sqrt((rank - 1) / 50 + 0.444444) - 50) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    */
    // New formula
function calculateScore(rank, percent, minPercent) {
    // New scoring curve: Top 1 = 250 pts, Bottom level ~= 25 pts
    const maxPoints = 250;
    const minPoints = 25;
    const maxRank = 150; // Adjust to match your list size

    // Use a new exponential decay function
    const decayRate = Math.log(maxPoints / minPoints) / (maxRank - 1);
    const baseScore = maxPoints * Math.exp(-decayRate * (rank - 1));

    // Apply percent-based modifier
    let score = baseScore * ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    score = Math.max(0, score);

    if (percent !== 100) {
        return Math.round(score - score / 3);
    }

    return Math.max(Math.round(score), 0);
}

export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
