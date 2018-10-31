const debug = printErr;
let turnActions = [];
const bestTurn = { actions: [], score: -Infinity };
const memoHelper = {
    actions: {
        plays: new Map(),
        attacks: new Map(),
    },
    gameState: new Map(),
};
let timer;
const scale = {
    1: 2,
    2: 0.75,
    3: 2.5,
    4: 0,
    5: 2.5,
    6: 2,
    7: 2,
    8: 2,
    9: 3,
    10: 0.75,
    11: 1.5,
    12: 2,
    13: 2.5,
    14: 0,
    15: 2,
    16: 0.75,
    17: 2,
    18: 2.5,
    19: 2.5,
    20: 0.5,
    21: 2,
    22: 1.5,
    23: 2.5,
    24: 0.5,
    25: 0.75,
    26: 2.5,
    27: 2,
    28: 2.5,
    29: 3,
    30: 3,
    31: 0.5,
    32: 3.5,
    33: 3,
    34: 2.5,
    35: 2,
    36: 4,
    37: 3.5,
    38: 2.5,
    39: 2.5,
    40: 3,
    41: 2.5,
    42: 2,
    43: 3,
    44: 5,
    45: 4,
    46: 2.5,
    47: 2.5,
    48: 3,
    49: 4.5,
    50: 3,
    51: 3.5,
    52: 4,
    53: 4.5,
    54: 3.5,
    55: 2.5,
    56: 2,
    57: 0.75,
    58: 2,
    59: 1.5,
    60: 0.75,
    61: 2,
    62: 2.5,
    63: 2.5,
    64: 3,
    65: 3,
    66: 2,
    67: 3.5,
    68: 3,
    69: 4.5,
    70: 2.5,
    71: 1.5,
    72: 2,
    73: 3,
    74: 3,
    75: 2,
    76: 3,
    77: 0.75,
    78: 0.5,
    79: 0.75,
    80: 4.5,
    81: 2,
    82: 2.5,
    83: 0,
    84: 3,
    85: 2.5,
    86: 2,
    87: 2.5,
    88: 2,
    89: 2,
    90: 0.75,
    91: 2,
    92: 0.5,
    93: 2.5,
    94: 2.5,
    95: 3,
    96: 2.5,
    97: 2.5,
    98: 2.5,
    99: 3,
    100: 2,
    101: 3,
    102: 2,
    103: 3.5,
    104: 2.5,
    105: 3,
    106: 2.5,
    107: 2,
    108: 1,
    109: 1.5,
    110: 0.75,
    111: 3,
    112: 2,
    113: 0.5,
    114: 2,
    115: 2.5,
    116: 3,
    // 120: 3,
    // 122: 2.5,
    // 123: 2.5,
    // 129: 3.5,
    // 133: 2.5,
    // 135: 3.5,
    // 139: 5,
    // 141: 2.5,
    // 144: 4,
    // 150: 4,
    // 151: 5,
    // 152: 3.5,
    // 155: 3.5,
    // 158: 5,
    // 159: 2,
};

/** ************************************************* */
/**                tools functions                    */
/** ************************************************* */


function getPlayers() {
    const players = [];

    for (let i = 0; i < 2; i++) {
        const inputs = readline().split(' ');
        const player = {};
        ['health', 'mana', 'deck', 'rune', 'draw'].forEach((key, index) => {
            player[key] = parseInt(inputs[index]);
        });
        players.push(player);
    }
    return players;
}

function getCards() {
    const cards = [];
    const cardCount = parseInt(readline());
    for (let i = 0; i < cardCount; i++) {
        const card = {};
        const inputs = readline().split(' ');

        ['number', 'id', 'location', 'type', 'ccm', 'power', 'toughness', 'abilities', null, null, 'cardDraw'].forEach((key, index) => {
            if (key) {
                if (key === 'abilities') {
                    const abilities = inputs[index].split('').filter(ability => ability !== '-');
                    card.breakthrough = abilities.includes('B');
                    card.charge = abilities.includes('C');
                    card.drain = abilities.includes('D');
                    card.guard = abilities.includes('G');
                    card.lethal = abilities.includes('L');
                    card.ward = abilities.includes('W');
                } else if (key === 'type') {
                    const type = parseInt(inputs[index]);
                    switch (type) {
                        case 0:
                            card[key] = 'creature';
                            break;
                        case 1:
                            card[key] = 'greenItem';
                            break;
                        case 2:
                            card[key] = 'redItem';
                            break;
                        case 3:
                            card[key] = 'blueItem';
                            break;
                        default:
                            card[key] = 'other';
                    }
                } else {
                    card[key] = parseInt(inputs[index]);
                }
            }
        });
        cards.push(card);
        // var myHealthChange = parseInt(inputs[8]);
        // var opponentHealthChange = parseInt(inputs[9]);
    }
    return cards.sort((c1, c2) => c2.id - c1.id);
}

function getOpponentInfos() {
    const oppActions = [];
    const inputs = readline().split(' ');
    const oppHand = parseInt(inputs[0]);
    const actionsCount = parseInt(inputs[1]);
    for (let i = 0; i < actionsCount; i++) {
        const action = readline();
        oppActions.push(action);
    }
    return [oppHand, oppActions];
}


function getCardsFrom(cards, mode) {
    switch (mode) {
        case 'myBoard':
            return cards.filter(card => card.location === 1);
        case 'oppBoard':
            return cards.filter(card => card.location === -1);
        case 'hand':
            return cards.filter(card => card.location === 0);
        default:
            debug(`invalid mode : ${mode}`);
            return cards;
    }
}

function timeout() {
    return performance.now() - timer > 100;
}

function printObj(key, object) {
    printErr(`${key} : ${JSON.stringify(object, null, 2)}`);
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function canKill(crea1, crea2) {
    return crea2.ward ?
        false :
        (crea1.lethal || crea1.power >= crea2.toughness);
}

function splice(cards, id) {
    const index = cards.findIndex(_card => _card.id === id);
    cards.splice(index, 1);
}

function getCard(game, id) {
    const { hand, myBoard, oppBoard } = game;
    const [handArr, myBoardArr, oppBoardArr] = Object.values({ hand, myBoard, oppBoard });
    const cards = [...handArr, ...myBoardArr, ...oppBoardArr];
    return cards.find(card => card.id === id);
}


/** ************************************************* */
/**                  eval functions                   */
/** ************************************************* */

function onBoardCreatureScore(crea) {
    let score = 0;
    if (crea.lethal) {
        score += 8 + crea.power / 2;
        score += 4 * crea.toughness;
        score += 5 * crea.ward;
        score += 3 * crea.guard;
    } else {
        score += Math.sqrt(crea.power) * Math.sqrt(crea.toughness) / 4;
        score += 1.5 * crea.power * (1.5 + crea.ward);
        score += 1.5 * crea.toughness * (1.5 + crea.guard);
    }
    if (crea.location === 0 && crea.charge) {
        score += 2 * (1 + 3 * crea.lethal);
    }
    return score;
}

function getScore({
    hand, player, opponent, myBoard, oppBoard,
}) {
    let score = 0;
    // if (opponent.health <= 0) { return Infinity; }
    // if (player.health <= 0) { return -Infinity; }
    score += hand.reduce((acc, card) => acc + onBoardCreatureScore(card), 0) / 4;
    score += myBoard.reduce((acc, card) => acc + onBoardCreatureScore(card), 0);
    score -= oppBoard.reduce((acc, card) => acc + onBoardCreatureScore(card), 0);
    score += (30 - opponent.health) * 0.8;
    return score;
}


/** ************************************************* */
/**                  basic turnActions                */
/** ************************************************* */

function pick(number) {
    turnActions.push(`PICK ${number}`);
}

function pass() {
    turnActions.push('PASS');
}

function performActions() {
    turnActions.push(...bestTurn.actions.map(action => {
        let string = '';
        if (action.type === 'play') { string += `SUMMON ${action.source}`; }
        if (action.type === 'attack') { string += `ATTACK ${action.source} ${action.target}`; }
        return string;
    }));
}

function act() {
    print(turnActions.join(';'));
}


/** ************************************************* */
/**                 MCTS functions                    */
/** ************************************************* */

/** **** **** Play creature */

function playCreature(game, source) {
    source.sick = !source.charge;
    source.attacked = false;
    game.player.mana -= source.ccm;
    game.myBoard.push(source);
    splice(game.hand, source.id);
}

/** **** **** **** Attack */

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

/** **** **** Combat */

function combat(game, source, target) {
    source.attacked = true;
    if (!target || target === null) {
        attackFace(game, source);
    } else {
        attack(game.oppBoard, source, target);
        attack(game.myBoard, target, source);
    }
}

/** **** Update game state */

function getUpdatedGameState(game, { type, source, target }) {
    const key = JSON.stringify({ game, action: { type, source, target } });
    if (memoHelper.gameState.has(key)) {
        // debug('(update gs) memo used');
        return copy(memoHelper.gameState.get(key));
    }
    const newGame = copy(game);
    const sourceObj = getCard(newGame, source);
    const targetObj = target === -1 ? null : getCard(newGame, target);
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
    memoHelper.gameState.set(key, copy(newGame));
    return newGame;
}

/** **** **** Plays */

function getPossiblePlays(game) {
    const { hand, player } = game;
    // @TODO find all possible targets for spells
    return hand.filter(card => card.ccm <= player.mana)
        .map(card => ({
            type: 'play',
            source: card.id,
        }));
}

/** **** **** Attacks */

function getPossibleAttacks(game) {
    const { myBoard, oppBoard } = game;
    const key = JSON.stringify({ myBoard, oppBoard });
    if (memoHelper.gameState.has(key)) {
        debug('(attacks) memo used !');
        return copy(memoHelper.gameState.get(key));
    }
    const attacks = [];
    // @TODO add face attacks
    const oppGuards = oppBoard.filter(crea => crea.guard);
    myBoard.filter(crea => !crea.sick && !crea.attacked)
        .forEach((crea) => {
            if (oppGuards.length > 0) {
                oppGuards.forEach((opp) => {
                    attacks.push({
                        type: 'attack',
                        source: crea.id,
                        target: opp.id,
                    });
                });
            } else {
                oppBoard.forEach((opp) => {
                    attacks.push({
                        type: 'attack',
                        source: crea.id,
                        target: opp.id,
                    });
                });
                attacks.push({
                    type: 'attack',
                    source: crea.id,
                    target: -1,
                });
            }
        });
    return attacks;
}

/** **** Possible actions */

function getPossibleActions(game) {
    // const {
    //     player: { mana }, hand, myBoard, oppBoard,
    // } = game;
    // const key = JSON.stringify({
    //     player: { mana }, hand, myBoard, oppBoard,
    // });
    // if (memoHelper.actions.has(key)) {
    //     debug('(actions) memo used !');
    //     return memoHelper.actions.get(key);
    // }
    const actions = [];
    actions.push(...getPossiblePlays(game));
    actions.push(...getPossibleAttacks(game));
    // memoHelper.actions.set(key, actions);
    return actions;
}


/** Sets of actions */

function getSetOfPossibleActions(game, set = [], actual = []) {
    set.push(actual);
    if (timeout()) {
        debug('timeout, breaking the loop');
        return;
    }
    const actions = getPossibleActions(game);
    // printObj('actions', actions);
    if (actions.length === 0) {
        // set.push(actual);
        // const score = getScore(game);
        return;
    }

    actions.forEach((action) => {
        if (timeout()) {
            debug('timeout, breaking the loop');
            return;
        }
        const newActual = copy(actual);
        const newGameState = getUpdatedGameState(game, action);
        const newScore = getScore(newGameState);
        newActual.push(action);
        if (newScore > bestTurn.score) {
            bestTurn.actions = newActual;
            bestTurn.score = newScore;
        }
        getSetOfPossibleActions(newGameState, set, newActual);
    });
}

/** ************************************************* */
/**                 main game loop                    */
/** ************************************************* */

function play(gameState) {
    // printObj('gameState', gameState);
    const set = [];
    const t0 = performance.now();
    getSetOfPossibleActions(gameState, set);
    const t1 = performance.now();
    // debug(`possibleSets : ${Math.round((t1 - t0))} milliseconds.`);
    // printObj('Actions', set);
    debug(`chosen between ${set.length} turns`);
    printObj('bestTurn', bestTurn);
    performActions();
    pass();
    return set;
}

/** ************************************************* */
/**                  draft                            */
/** ************************************************* */

function draft({ player }, cards) {
    printObj('player', player);
    printObj('cards', cards);
    cards.forEach((card, index) => { card.draftId = index; });

    cards.forEach((card) => {
        if (!Object.keys(scale).includes(card.number.toString())) {
            debug(`card ${card.number} not in the scale`);
            card.score = -1;
        } else {
            card.score = scale[card.number]; // + curve[card.ccm] * player.deck / 60;
            debug('score : ', card.score);
        }
    });
    cards.sort((card1, card2) => card2.score - card1.score);
    // curve[cards[0].ccm]--;

    pick(cards[0].draftId);
}

/** ************************************************** */

function think(gameState, cards) {
    const { phase } = gameState;
    debug(`Phase : ${phase}`);
    if (phase === 'draft') {
        draft(gameState, cards);
    }
    if (phase === 'play') {
        play(gameState);
    }
}

/** ************************************************** */
/** **************** EXPORTS ************************* */
/** ************************************************** */

// module.exports = {
//     play,
//     getSetOfPossibleActions,
//     getUpdatedGameState,
// };

/** ************************************************** */

while (true) {
    turnActions = [];
    const [player, opponent] = getPlayers();
    const [oppHand, oppActions] = getOpponentInfos();
    opponent.hand = oppHand;
    opponent.oppActions = oppActions;
    const cards = getCards();
    const phase = player.mana ? 'play' : 'draft';
    const gameState = {
        phase,
        player,
        opponent,
        hand: getCardsFrom(cards, 'hand'),
        myBoard: getCardsFrom(cards, 'myBoard'),
        oppBoard: getCardsFrom(cards, 'oppBoard'),
    };
    bestTurn.actions = [];
    bestTurn.score = -Infinity;
    timer = performance.now();
    think(gameState, cards);
    act();
}
