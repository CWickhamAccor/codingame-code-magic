const player = {
    mana: 2,
};

const hand = [
    {
        id: 0,
        type: 'creature',
        power: 3,
        toughness: 2,
        ccm: 2,
    },
];

const myBoard = [
    {
        id: 1,
        type: 'creature',
        power: 4,
        toughness: 5,
        sick: false,
        attacked: false,
    },
];

const oppBoard = [
    {
        id: 2,
        type: 'creature',
        power: 2,
        toughness: 4,
    },
    {
        id: 3,
        type: 'creature',
        power: 1,
        toughness: 1,
    },
];

module.exports = {
    player,
    hand,
    myBoard,
    oppBoard,
};
