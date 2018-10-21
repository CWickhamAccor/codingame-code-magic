const { canKill, splice, copy } = require('../utils/tools');

function attack(board, source, target) {
    if (canKill(source, target)) {
        splice(board, target);
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

function getPossiblePlays(game) {
    const { hand, player } = game;
    // @TODO find all possible targets for spells
    return hand.filter(card => card.ccm <= player.mana)
        .map(card => ({
            type: 'play',
            source: card,
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
                    source: crea,
                    target: opp,
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

function getPossibleSetsOfActions(game, set = [[]]) {
    const actions = getPossibleActions(game);
    set.push(actions);
    if (actions === []) {
        return set;
    }
    actions.forEach((action) => {
        const newGameState = getUpdatedGameState(game, action);
        set.push([action, ...getPossibleActions(newGameState)]);
    });
    return set;
}

module.exports = {
    attack,
    combat,
    playCreature,
    getUpdatedGameState,
    getPossibleAttacks,
    getPossiblePlays,
    getPossibleActions,
    getPossibleSetsOfActions,
};
