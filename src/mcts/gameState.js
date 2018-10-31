const {
    canKill, splice, copy, getCard,
} = require('../utils/tools');

function attack(myBoard, source, target) {
    if (canKill(source, target)) {
        splice(myBoard, target.id);
    } else {
        target.toughness -= source.power;
    }
}

function attackFace(game, source) {
    game.opponent.health -= source.power;
}

function combat(game, source, target) {
    source.attacked = true;
    if (!target || target === null) {
        attackFace(game, source);
    } else {
        attack(game.oppBoard, source, target);
        attack(game.myBoard, target, source);
    }
}

function playCreature(game, source) {
    source.sick = !source.charge;
    source.attacked = false;
    game.player.mana -= source.ccm;
    game.myBoard.push(source);
    splice(game.hand, source);
}

function getUpdatedGameState(game, { type, source, target }) {
    const newGame = copy(game);
    const sourceObj = getCard(newGame, source);
    const targetObj = getCard(newGame, target);
    switch (type) {
        case 'attack':
            combat(newGame, sourceObj, targetObj);
            break;
        case 'play':
            if (sourceObj.type === 'creature') {
                playCreature(newGame, sourceObj);
            } else {
                debug('trying to play a noncreature spell !');
            }
            break;
        default:
            break;
    }
    return newGame;
}

function getPossiblePlays(game) {
    const { hand, player } = game;
    // @TODO find all possible targets for spells
    return hand.filter(card => card.ccm <= player.mana)
        .map(card => ({
            type: 'play',
            source: card.id,
        }));
}

function getPossibleAttacks(game) {
    const { myBoard, oppBoard } = game;
    const attacks = [];
    // @TODO add face attacks
    myBoard.filter(crea => !crea.sick && !crea.attacked)
        .forEach((crea) => {
            oppBoard.forEach((opp) => {
                attacks.push({
                    type: 'attack',
                    source: crea.id,
                    target: opp.id,
                });
            });
        });
    return attacks;
}

function getPossibleActions(game) {
    const actions = [];
    actions.push(...getPossiblePlays(game));
    actions.push(...getPossibleAttacks(game));
    return actions;
}

function getScore({
    player, opponent, hand, myBoard, oppBoard,
}) {
    if (opponent.health <= 0) {
        return Infinity;
    }
    const scoreHand = hand.length;
    const scoreBoard = myBoard.length + myBoard.reduce((crea, acc) => acc + crea.power, 0);
    const scoreOppBoard = oppBoard.length + oppBoard.reduce((crea, acc) => acc + crea.power, 0);
    const scoreOppHealth = (30 - opponent.health) / 10;
    return scoreHand + scoreBoard + scoreOppBoard + scoreOppHealth;
}

function getSetOfPossibleActions(game, set = [], actual = []) {
    set.push(actual);
    const actions = getPossibleActions(game);
    if (actions.length === 0) {
        // const score = getScore(game);
        return;
    }

    actions.forEach((action) => {
        const newActual = copy(actual);
        newActual.push(action);
        const newGameState = getUpdatedGameState(game, action);
        getSetOfPossibleActions(newGameState, set, newActual);
    });
}


module.exports = {
    attack,
    getUpdatedGameState,
    getPossibleAttacks,
    getPossiblePlays,
    getPossibleActions,
    getSetOfPossibleActions,
};
