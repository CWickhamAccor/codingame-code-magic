const debug = printErr;
let actions = [];
const scale = {
    1: 2,
    2: 0.75,
    3: 2.5,
    4: 0,
    5: 2.5,
    6: 2,
    7: 2,
    8: 2,
    9: 2,
    10: 0.75,
    11: 1.5,
    12: 2,
    13: 2.5,
    14: 0,
    15: 2,
    16: 0.75,
    17: 2,
    18: 2.5,
    19: 2,
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
    44: 4.5,
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
    64: 2,
    65: 2.5,
    66: 2,
    67: 3.5,
    68: 2.5,
    69: 4.5,
    70: 2.5,
    71: 1.5,
    72: 2,
    73: 2.5,
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
    84: 0,
    85: 2.5,
    86: 2,
    87: 2.5,
    88: 2.5,
    89: 2,
    90: 0.75,
    91: 2,
    92: 0.5,
    93: 2.5,
    94: 2.5,
    95: 3,
    96: 2.5,
    97: 2,
    98: 2.5,
    99: 3,
    100: 2,
    101: 2.5,
    102: 2,
    103: 3,
    104: 2.5,
    105: 3,
    106: 2.5,
    107: 2,
    108: 1,
    109: 1.5,
    110: 0.75,
    111: 2.5,
    112: 2,
    113: 0.5,
    114: 2,
    115: 2.5,
    116: 3,
    120: 3,
    122: 2.5,
    123: 2.5,
    133: 2.5,
    139: 5,
    141: 2.5,
    144: 4,
    150: 4.5,
    151: 5,
    152: 3.5,
    155: 3.5,
    158: 5,
    159: 3,
};
const curve = {
    0: 0,
    1: 2,
    2: 5,
    3: 5,
    4: 5,
    5: 3,
    6: 3,
    7: 2,
    8: 1,
    9: 1,
    10: 1,
    11: 1,
    12: 1,
};


/****************************************************/
/*               get data functions                 */

/****************************************************/

function getPlayers() {
    const players = [];

    for (let i = 0; i < 2; i++) {
        const inputs = readline().split(' ');
        const player = {};
        ['health', 'mana', 'deck'/*, 'rune'*/].forEach((key, index) => {
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
                    card[key] = inputs[index].split('').filter(ability => ability !== '-');
                } else {
                    card[key] = parseInt(inputs[index]);
                }
            }
        });
        cards.push(card);
        // var myHealthChange = parseInt(inputs[8]);
        // var opponentHealthChange = parseInt(inputs[9]);
        // var cardDraw = parseInt(inputs[10]);
    }
    return cards;
}

function getCardsFrom(cards, mode){
    switch (mode){
        case 'board':
            return cards.filter(card => card.location === 1);
        case 'oppBoard':
            return cards.filter(card => card.location === -1);
        case 'hand':
            return cards.filter(card => card.location === 0);
        default :
            debug(`invalid mode : ${mode}`);
            return cards;
    }
}

function getDangerosity(crea) {
    return (crea.power + crea.toughness + crea.abilities.length) / 2;
}

function getValue(removal) {
    return removal.ccm - removal.cardDraw;
}

function getCard(cards, id) {
    const [card] = cards.filter(_card => _card.id === id);
    return card;
}

function getPlayable(cards, player) {
    return cards.filter(card => card.location === 0 && card.ccm <= player.mana);
}

function splice(cards, id) {
    const index = cards.findIndex(_card => _card.id === id);
    cards.splice(index, 1);
}

function printObj(key, object) {
    printErr(`${key} : ${JSON.stringify(object, null, 2)}`);
}

/****************************************************/
/*                  actions                         */
/****************************************************/

function playRemoval(card, target, cards, oppCreatures) {
    debug(`[PLAY] removal ${card.id} on ${target.id}`);
    card.location = -2;
    splice(cards, card.id);
    splice(oppCreatures, target.id);
    actions.push(`USE ${card.id} ${target.id}`);
}

function playCreature(card) {
    debug(`[PLAY] ${card.id}`);
    card.location = 1;
    actions.push(`SUMMON ${card.id}`);
}

function playPump(card, target, cards) {
    debug(`[PLAY] pump ${card.id} on ${target.id}`);
    card.location = -2;
    splice(cards, card.id);
    target.power += card.power;
    target.toughness += card.toughness;
    target.abilities.push(...card.abilities);
    actions.push(`USE ${card.id} ${target.id}`);
}

function attack(card, target, cards) {
    if (target === null) {
        debug(`[ATTACK] ${card.id} attack face`);
        actions.push(`ATTACK ${card.id} -1`);
    } else {
        debug(`[ATTACK] ${card.id} attack ${target.id}`);
        actions.push(`ATTACK ${card.id} ${target.id}`);

        // handle creature dying
        if ((card.power >= target.toughness || card.abilities.includes('L')) && !target.abilities.includes('W')) {
            debug('target is dead');
            splice(cards, target.id);
        } else {
            //remove ward after attacking a ward creature
            if (target.abilities.includes('W')){
                const index = target.abilities.indexOf('W');
                target.abilities.splice(index, 1);
            } else {
                target.toughness -= card.power;
            }
        }
    }
}

function pick(number) {
    actions.push(`PICK ${number}`)
}

function pass() {
    actions.push('PASS');
}

function act() {
    print(actions.join(';'));
}

/****************************************************/

function playGame(phase, player, opponent, cards, opponentHand) {
    printErr(`Phase : ${phase}`);
    if (phase === 'draft') {
        draft(player, cards);
    }
    if (phase === 'game') {
        game(player, opponent, cards, opponentHand);
    }
    act();
}

/****************************************************/
/*                  draft                           */

/****************************************************/

function draft(player, cards) {
    printObj('player', player);
    printObj('cards', cards);
    cards = cards.map((card, index) => {
        card.draftId = index;
        return card;
    });

    cards.forEach((card) => {
        if (!Object.keys(scale).includes(card.number.toString())) {
            debug(`card ${card.number} not in the scale`);
            card.score = -1;
        } else {
            card.score = scale[card.number]/* + curve[card.ccm] * player.deck / 30*/;
            debug('score : ', card.score);
        }
    });
    cards.sort((card1, card2) => card2.score - card1.score);
    curve[cards[0].ccm]--;
    pick(cards[0].draftId);
}


/****************************************************/
/*                  phases                          */

/****************************************************/

function combat(creatures, oppCreatures, opponent) {
    // Sort creatures with lethal first then stronger
    creatures.sort((crea1, crea2) => {
        if (crea1.abilities.includes('L') && crea2.abilities.includes('L')) {
            return crea1.power - crea2.power;
        } else if (!crea1.abilities.includes('L') && !crea2.abilities.includes('L')) {
            return crea2.power - crea1.power;
        }

        return crea2.abilities.includes('L') - crea1.abilities.includes('L');
    });

    creatures.forEach((crea) => {
        if (crea.power === 0) {
            return;
        }
        const oppCreaWithGard = oppCreatures.filter(_crea => _crea.abilities.includes('G'));
        oppCreaWithGard.sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));

        let target = null;

        if (oppCreaWithGard.length > 0) {
            target = oppCreaWithGard[0];
            debug('target is the best guard creature');
        } else if (opponent.health <= crea.power) {
            target = null;
            debug('we have lethal here');
        } else if (crea.abilities.includes('L') && oppCreatures.length > 0) {
            const creaturesStronger = [...oppCreatures].sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));
            target = creaturesStronger[0];
            debug('target is the best creature');
        } else {
            const creaturesWeaker = oppCreatures.filter(oppCrea => oppCrea.power < crea.toughness && !oppCrea.abilities.includes('L'))
                .sort((crea1, crea2) => crea2.power - crea1.power);
            const creatureStrongerICanKill = oppCreatures.filter(oppCrea => oppCrea.toughness <= crea.power && oppCrea.power > crea.power && !oppCrea.abilities.includes('W'))
                .sort((crea1, crea2) => crea2.power - crea1.power);
            if (creatureStrongerICanKill.length > 0) {
                target = creatureStrongerICanKill[0];
                debug('target is a crea stronger I can kill');
            }
            if (creaturesWeaker.length > 0) {
                target = creaturesWeaker[0];
                debug('target is a crea weaker');
            }
        }
        attack(crea, target, oppCreatures);
    });
}

function main(hand, creatures, oppCreatures, player) {
    let playableCards = getPlayable(hand, player);
    debug(`${player.mana} mana available`);
    debug(`${playableCards.length} cards playable`);
    //printObj('creatures', creatures);

    while (playableCards.length > 0) {
        playableCards.sort((card1, card2) => {
            return card2.type - card1.type || card2.ccm - card1.ccm;
        });
        //printObj('playableCards', playableCards);

        //look for a good target for the removal
        oppCreatures.sort((crea1, crea2) => {
            return crea2.power - crea1.power || crea2.toughness - crea1.toughness;
        });

        // for each removal, if we have a good target we use it
        // then we look for a creature to play
        const [target] = oppCreatures;
        const [card] = playableCards;

        // Sort creatures to know which one to pump
        creatures.sort((crea1, crea2) => {
            return crea2.power - crea1.power || crea2.toughness - crea1.toughness
        });
        const worstCreature = creatures.slice(-1)[0];
        const [bestCreature] = creatures;

        printObj('worstCrea', worstCreature);
        printObj('bestCrea', bestCreature);

        //handle creatures
        if (card.type === 0) {
            player.mana -= card.ccm;
            playCreature(card);
        }
        //handle pump spells
        else if (card.type === 1 && worstCreature) {
            // special handle for lethal pumps
            if (card.abilities.includes('L')){
                if (worstCreature.abilities.includes('L')){
                    debug(`don't play pump on a creature that's already lethal`);
                    splice(hand, card.id);
                } else {
                    debug('giving lethal to the worst creature');
                    player.mana -= card.ccm;
                    playPump(card, worstCreature, hand);
                }
            }
            else if (card.abilities.includes('W') || card.abilities.includes('G') || card.abilities.includes('D')){
                if (bestCreature.abilities.includes('G')){
                    debug(`don't play pump on a creature that's already guard`);
                    splice(hand, card.id);
                } else {
                    debug('playing pump on the best creature');
                    player.mana -= card.ccm;
                    playPump(card, bestCreature, hand);
                }
            } else {
                debug('playing pump on the worst creature');
                player.mana -= card.ccm;
                playPump(card, worstCreature, hand);
            }
        }
        //handle removals
        else if (card.type >= 2 && target) {
            const danger = getDangerosity(target);
            const value = getValue(card);
            debug(`danger = ${danger}`);
            debug(`value = ${value}`);
            if (danger > value) {
                debug('target is legit');
                if (target.toughness + card.toughness <= 0 && !target.abilities.includes('W')) {
                    debug('removal can kill it');
                    player.mana -= card.ccm;
                    playRemoval(card, target, hand, oppCreatures);
                } else {
                    debug(`removal can't kill it`);
                    debug(`${target.toughness} + ${card.toughness} = ${target.toughness + card.toughness}`);
                    splice(hand, card.id);
                }
            }
            else {
                debug(`no good target found for ${card.id}`);
                splice(hand, card.id);
            }
        } else {
            debug(`card ${card.id} not handled`);
            splice(hand, card.id);
        }
        playableCards = getPlayable(hand, player);
    }
}


/****************************************************/
/*                  loop                            */

/****************************************************/

function game(player, opponent, cards, opponentHand) {
    let hand = getCardsFrom(cards, 'hand');
    const oppBoard = getCardsFrom(cards, 'oppBoard');
    let board = getCardsFrom(cards, 'board');
    //const chargeCreaturesAndRemovals = hand.filter(card => (card.type === 0 && card.abilities.includes('C')) || card.type >= 2);
    const chargeCreaAndSpells = hand.filter(card => card.type !== 0 || card.abilities.includes('C'));

    debug('main 1');

    main(chargeCreaAndSpells, board, oppBoard, player);

    board = getCardsFrom(cards, 'board');

    debug('combat');
    combat(board, oppBoard, opponent);

    board = getCardsFrom(cards, 'board');
    hand = getCardsFrom(cards, 'hand');

    debug('main 2');
    main(hand, board, oppBoard, player);

    debug('end of turn');

    pass();
}

while (true) {
    actions = [];
    const [player, opponent] = getPlayers();
    const opponentHand = parseInt(readline());
    const cards = getCards();
    const phase = player.mana ? 'game' : 'draft';

    playGame(phase, player, opponent, cards, opponentHand);
}
