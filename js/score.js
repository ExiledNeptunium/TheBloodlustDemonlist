/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @param {Number} [totalRanks=150] Total number of ranks in the list
 * @returns {Number}
 */
export function score(rank, percent, minPercent, totalRanks = 150) {
    // Configuration - can be adjusted as needed
    const TOP_SCORE = 250;
    const BOTTOM_SCORE = 25;
    const PENALTY_FACTOR = 1/3; // Penalty for non-100% runs
    
    // Boundary checks
    if (rank > totalRanks) {
        return 0;
    }
    if (rank > totalRanks/2 && percent < 100) {
        return 0;
    }

    // Calculate base score with exponential decay
    const decayFactor = Math.log(BOTTOM_SCORE / TOP_SCORE) / (totalRanks - 1);
    let baseScore = TOP_SCORE * Math.exp(decayFactor * (rank - 1));
    
    // Apply percentage scaling
    let scaledScore = baseScore * 
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1));
    
    // Apply penalty for non-perfect runs
    if (percent != 100) {
        scaledScore -= scaledScore * PENALTY_FACTOR;
    }
    
    // Ensure score is within bounds and rounded
    return round(Math.max(0, scaledScore));
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
