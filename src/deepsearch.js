const tab = [2, 4, 5, 3, 1];
const cards = [
    {
        number: 1,
        id: -1,
        location: 0,
        type: 0,
        ccm: 2,
        power: 3,
        toughness: 1,
        abilities: [],
        cardDraw: 0,
    },
    {
        number: 2,
        id: -1,
        location: 0,
        type: 2,
        ccm: 4,
        power: -1,
        toughness: -1,
        abilities: [],
        cardDraw: 0,
    },
    {
        number: 3,
        id: -1,
        location: 0,
        type: 1,
        ccm: 5,
        power: 4,
        toughness: 0,
        abilities: [
            'W',
        ],
        cardDraw: 0,
    },
    {
        number: 4,
        id: -1,
        location: 0,
        type: 1,
        ccm: 3,
        power: 4,
        toughness: 0,
        abilities: [
            'W',
        ],
        cardDraw: 0,
    },
    {
        number: 5,
        id: -1,
        location: 0,
        type: 1,
        ccm: 1,
        power: 4,
        toughness: 0,
        abilities: [
            'W',
        ],
        cardDraw: 0,
    },
];

/**
 * Returns the Sets of all combinations of cards
 * @param rest
 * @param active
 * @param res
 * @returns {Array}
 */
function search(rest, active = [], res = []) {
    if (rest.length === 0) {
        res.push(active);
        return active;
    }
    search(rest.slice(1), [...active, rest[0]], res);
    search(rest.slice(1), active, res);

    return res;
}

/**
 * Returns only the sets of cards that are playable with the available mana
 * @param cards
 * @param mana
 * @returns {*[]}
 */
function getPlayableSets(cards, mana) {
    return cards
        .filter(tab => tab.map(a => a.ccm).reduce((a, b) => a + b, 0) <= mana)
        .sort((t1, t2) => t2.map(a => a.ccm).reduce((a, b) => a + b, 0) - t1.map(a => a.ccm).reduce((a, b) => a + b, 0));
}

const mana = 4;
const res = search(cards);
const playable = getPlayableSets(res, mana);

const readable = playable.map(tab => tab.map(e => ({ id: e.number, ccm: e.ccm })));
console.log(playable);
console.log(readable);
