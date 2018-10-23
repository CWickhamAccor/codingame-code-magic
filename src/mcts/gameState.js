const { canKill, splice, copy, getCard } = require('../utils/tools');

function attack(board, source, target) {
    if (canKill(source, target)) {
        splice(board, target.id);
    } else {
        target.toughness -= source.power;
    }
}

function combat(game, source, target) {
    source.attacked = true;
    attack(game.oppBoard, source, target);
    attack(game.myBoard, target, source);
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

function getPossibleSetsOfActions(game, set = [], actual = []) {
    set.push(actual);
    const actions = getPossibleActions(game);
    if (actions.length === 0) {
        return;
    }

    actions.forEach((action) => {
        const newActual = copy(actual);
        newActual.push(action);
        const newGameState = getUpdatedGameState(game, action);
        getPossibleSetsOfActions(newGameState, set, newActual);
    });
}

// function getPossibleSetsOfActions(game, set = [[]]) {
//     const actions = getPossibleActions(game);
//     if (actions.length === 0) {
//         return set;
//     }
//     // actions.push({ type: null });
//
//     actions.forEach((action) => {
//         const newGameState = getUpdatedGameState(game, action);
//         set.push([action]);
//         set.push([action, ...getPossibleSetsOfActions(newGameState)]);
//     });
//     set.push(actions);
//     return set;
// }


module.exports = {
    attack,
    getUpdatedGameState,
    getPossibleAttacks,
    getPossiblePlays,
    getPossibleActions,
    getPossibleSetsOfActions,
};
