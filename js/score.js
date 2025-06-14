/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Example pack definitions
 */
export const levelPacks = [
  {
    name: "Original Top 1 Pack",
    levels: ["Firework", "Firework", "Firework"]
  },
  {
    name: "The Gambling Trilogy",
    levels: ["Firework", "Firework", "Firework"]
  },
  {
    name: "Free Points Pack",
    levels: ["Firework", "Firework", "Firework"]
  }
];

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @param {String} levelName Name of the level
 * @param {Set<string>} beatenLevels Set of completed level names
 * @returns {Number}
 */
export function score(rank, percent, minPercent, levelName, beatenLevels) {
    if (rank > 150) return 0;
    if (rank > 75 && percent < 100) return 0;

    let score = 250 * Math.exp(-(Math.log(250 / 25) / 80) * (rank - 1)) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    score = Math.max(0, score);

    // Bonus for completed packs
    for (const pack of levelPacks) {
        if (pack.levels.includes(levelName)) {
            const completed = pack.levels.every(name => beatenLevels.has(name));
            if (completed) {
                score += 162350; // arbitrary bonus for completing the pack
                break;
            }
        }
    }

    if (percent !== 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
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
