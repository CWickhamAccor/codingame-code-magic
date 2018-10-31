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
    score += (30 - opponent.health) * 4;
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
    myBoard.filter(crea => !crea.sick && !crea.attacked)
        .forEach((crea) => {
            oppBoard.forEach((opp) => {
                attacks.push({
                    type: 'attack',
                    source: crea.id,
                    target: opp.id,
                });
            });
            // attacks.push({
            //     type: 'attack',
            //     source: crea.id,
            //     target: -1,
            // });
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
    const actions = getPossibleActions(game);
    // printObj('actions', actions);
    if (actions.length === 0) {
        // set.push(actual);
        // const score = getScore(game);
        return;
    }

    actions.forEach((action) => {
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
    printObj('gameState', gameState);
    const set = [];
    const t0 = performance.now();
    getSetOfPossibleActions(gameState, set);
    const t1 = performance.now();
    // debug(`possibleSets : ${Math.round((t1 - t0))} milliseconds.`);
    // printObj('Actions', set);
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

    // cards.forEach((card) => {
    //     if (!Object.keys(scale).includes(card.number.toString())) {
    //         debug(`card ${card.number} not in the scale`);
    //         card.score = -1;
    //     } else {
    //         card.score = scale[card.number] + curve[card.ccm] * player.deck / 60;
    //         debug('score : ', card.score);
    //     }
    // });
    // cards.sort((card1, card2) => card2.score - card1.score);
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
    think(gameState, cards);
    act();
}
