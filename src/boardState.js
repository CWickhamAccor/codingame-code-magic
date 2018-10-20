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

const player = {
    mana: 2,
};

function deepCopy(obj) {
    return Object.assign({}, obj);
}

function canKill(crea1, crea2) {
    // return !crea2.abilities.includes('W') && (crea1.abilities.includes('L') || crea1.power >= crea2.toughness);
    return crea1.power >= crea2.toughness;
}

function splice(cards, id) {
    const index = cards.findIndex(_card => _card.id === id);
    cards.splice(index, 1);
}

function attack(board, source, target) {
    source.attacked = true;
    if (canKill(source, target)) {
        splice(board, target);
    } else {
        target.toughness -= source.power;
    }
}

function combat(game, source, target) {
    source.sick = true;
    attack(game.oppBoard, source, target);
    attack(game.myBoard, target, source);
}

function playCreature(game, source) {
    source.sick = true;
    source.attacked = false;
    game.player.mana -= source.ccm;
    game.myBoard.push(source);
    splice(game.hand, source);
}

function getUpdatedGameState(game, { type, source, target }) {
    const newGame = deepCopy(game);
    switch (type) {
        case 'attack':
            combat(newGame, source, target);
            break;
        case 'play':
            if (source.type === 'creature') {
                playCreature(newGame, source);
            }
            break;
        default:
            break;
    }
    return newGame;
}

function getPossibleActions(game) {
    const actions = [];
    actions.push(...getPossiblePlays(game));
    actions.push(...getPossibleAttacks(game));
    return actions;
}

function getPossiblePlays(game) {
    const { hand, player } = game;
    const plays = hand.filter(card => card.ccm <= player.mana)
        .map(card => ({
            type: 'play',
            source: card,
        }));
    return plays;
}

function getPossibleAttacks(game) {
    const { myBoard, oppBoard } = game;
    const attacks = [];
    myBoard.filter(crea => !crea.sick && !crea.attacked)
        .forEach((crea) => {
            oppBoard.forEach((opp) => {
                attacks.push({
                    type: 'attack',
                    source: crea,
                    target: opp,
                });
            });
        });
    return attacks;
}

const game = {
    player,
    hand,
    myBoard,
    oppBoard,
};

const actions = [
    {
        type: 'attack',
        source: myBoard[0],
        target: oppBoard[0],
    },
    {
        type: 'play',
        source: hand[0],
    },
];

const possibleActions = getPossibleActions(game);
console.log(JSON.stringify(possibleActions, null, 2));

console.log(' \x1b[36m--------\n state : initial\n --------\x1b[0m');
console.log(JSON.stringify(game, null, 2));

possibleActions.forEach((action, i) => {
// actions.forEach((action, i) => {
    const newGame = getUpdatedGameState(game, action);
    console.log(` \x1b[36m--------\n state : ${i}\n --------\x1b[0m`);
    console.log(JSON.stringify(game, null, 2));
    console.log(JSON.stringify(newGame, null, 2));
});
