/* eslint-disable object-curly-newline */
const { player, hand, myBoard, oppBoard } = require('../samples');
const { getPossibleActions, getUpdatedGameState } = require('./gameState');

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
