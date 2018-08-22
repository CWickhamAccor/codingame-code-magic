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
    65: 2.5,
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
    120: 3,
    122: 2.5,
    123: 2.5,
    129: 3.5,
    133: 2.5,
    135: 3.5,
    139: 5,
    141: 2.5,
    144: 4,
    150: 4,
    151: 5,
    152: 3.5,
    155: 3.5,
    158: 5,
    159: 2,
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
    let danger = 0;
    if (crea.abilities.includes('L')) {
        danger += 8 + crea.power / 2;
        danger += 4 * crea.toughness;
        danger += 5 * crea.abilities.includes('W');
        danger += 3 * crea.abilities.includes('G');
    } else {
        danger += 2 * crea.power * (1 + crea.abilities.includes('W'));
        danger += 3 * crea.toughness * (1 + crea.abilities.includes('G'));
    }
    const oldDanger = (crea.power + crea.toughness + crea.abilities.includes('L') + crea.abilities.includes('G')) / 2 + crea.abilities.length;
    //printObj('old/new', [oldDanger, danger]);
    return danger;
}

function getValue(removal) {
    if (removal.toughness === -99) {
        return 25;
    }
    return 5 * ((removal.ccm - removal.toughness) / 2 - removal.cardDraw);
}

function getWeaker(crea1, crea2){
    return crea1.power - crea2.power;
}

function getStronger(crea1, crea2){
    return crea2.power - crea1.power;
}

function hasAbility(crea1, crea2, ability){
    return crea2.abilities.includes(ability) - crea1.abilities.includes(ability);
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
    if (!card.abilities.includes('C')){
        card.sick = true;
    }
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

function attack(card, target, cards, opponent) {
    if (target === null) {
        debug(`[ATTACK] ${card.id} attack face`);
        actions.push(`ATTACK ${card.id} -1`);
        opponent.health -= card.power;
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
            card.score = scale[card.number] + curve[card.ccm] * player.deck / 60;
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

/**
 *  Combat
 */

function combat(creatures, oppCreatures, player, opponent) {
    // get all non-summoning sick creatures
    const availableCreas = [...creatures].filter(crea => !crea.sick);

    while(availableCreas.length > 0){

        /** Sorting **/

        const oppCreaWithWard = oppCreatures.filter(_crea => _crea.abilities.includes('W'));
        const oppCreaWithGard = oppCreatures.filter(_crea => _crea.abilities.includes('G'));

        oppCreaWithWard.sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));
        oppCreaWithGard.sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));

        //if opponent has a Guard creature
        if (oppCreaWithGard.length > 0) {
            const [bestGuard] = oppCreaWithGard;
            if (bestGuard.abilities.includes('W')) {
                // Find a useless creature/smaller ward creature, we will attack with it first
                debug('use a ward or smaller creature to attack the guard + ward');
                availableCreas.sort((crea1, crea2) => {
                    return hasAbility(crea1, crea2, 'W') || getWeaker(crea1, crea2);
                });
            } else {
                // get Creatures that can kill it, take the worst one
                const creaThatCanKillIt = availableCreas.filter(crea => crea.abilities.includes('L') || crea.power >= bestGuard.toughness);
                if (creaThatCanKillIt.length > 0) {
                    //if some crea can kill it, use the worst one that can kill it
                    debug('some crea can kill the guard, we use the worst one');
                    availableCreas.sort((crea1, crea2) => {
                        const canKill = (crea, guard) => {
                            return crea.abilities.includes('L') || crea.power >= guard.toughness;
                        };
                        return canKill(crea2, bestGuard) - canKill(crea1, bestGuard) || getWeaker(crea1, crea2);
                    });
                } else {
                    // Sort creatures with lethal & ward first then stronger
                    debug('nobody can kill the guard crea so we strike with our best crea');
                    debug('use lethal & ward first, then stronger');
                    availableCreas.sort((crea1, crea2) => {
                        if (crea1.abilities.includes('L') && crea2.abilities.includes('L')) {
                            return hasAbility(crea1, crea2, 'W') || getWeaker(crea1, crea2);
                        } else if (!crea1.abilities.includes('L') && !crea2.abilities.includes('L')) {
                            return hasAbility(crea1, crea2, 'W') || getStronger(crea1, crea2) || crea2.toughness - crea1.toughness;
                        }

                        return hasAbility(crea1, crea2, 'L');
                    });
                }
            }
        }
        //if opponent has a Ward creature
        else if (oppCreaWithWard.length > 0) {
            // Find a useless creature/smaller ward creature, we will attack with it first
            debug('use a ward or smaller creature to attack the ward');
            availableCreas.sort((crea1, crea2) => {
                return hasAbility(crea1, crea2, 'W') || getWeaker(crea1, crea2);
            });
        } else {
            // Sort creatures with lethal & ward first then stronger
            debug('use lethal & ward first, then stronger');
            availableCreas.sort((crea1, crea2) => {
                if (crea1.abilities.includes('L') && crea2.abilities.includes('L')) {
                    return hasAbility(crea1, crea2, 'W') || getWeaker(crea1, crea2);
                } else if (!crea1.abilities.includes('L') && !crea2.abilities.includes('L')) {
                    return hasAbility(crea1, crea2, 'W') || getStronger(crea1, crea2) || crea2.toughness - crea1.toughness;
                }

                return hasAbility(crea1, crea2, 'L');
            });
        }

        const [crea] = availableCreas;

        /** Action **/

        // if creature has 0 power we skip it
        if (crea.power === 0){
            availableCreas.shift();
        }
        // else we find a target and we attack
        else {
            const target = getTarget(crea, availableCreas, oppCreatures, player, opponent);
            attack(crea, target, oppCreatures, opponent);
            availableCreas.shift();
        }
    }
}

function getTarget(crea, availableCreas, oppCreatures, player, opponent) {
    const oppCreaWithWard = oppCreatures.filter(_crea => _crea.abilities.includes('W'));
    const oppCreaWithGard = oppCreatures.filter(_crea => _crea.abilities.includes('G'));
    const oppCreaWithLethal = oppCreatures.filter(_crea => _crea.abilities.includes('L'));

    oppCreaWithWard.sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));
    oppCreaWithGard.sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));

    let target = null;

    // check if we have or oppo has lethal on board
    const [totalDamage, oppDamage] = [availableCreas, oppCreatures].map(arr => arr.map(a => a.power).reduce((a, b) => a + b, 0));
    debug(`totalDamage : ${totalDamage}`);
    debug(`oppDamage : ${oppDamage}`);

    if (oppDamage > player.health){
        debug('opponent has lethal on board');
    }

    if (oppCreatures.length === 0){
        debug('no creature on board');
        return null;
    } else if (oppCreaWithGard.length > 0) {
        target = oppCreaWithGard[0];
        debug('target is the best guard creature');
    } else if (opponent.health <= totalDamage) {
        debug('we have lethal here');
        return null;
    } else if (crea.abilities.includes('W') && oppCreaWithLethal.length > 0){
        oppCreaWithLethal.sort((crea1, crea2) => {
            return hasAbility(crea1, crea2, 'L') || crea2.power + crea2.toughness - (crea1.power + crea1.toughness)
        });
        target = oppCreaWithLethal.shift();
        debug('target is the best lethal creature (I have ward)');
    } else if (crea.abilities.includes('L')) {
        const creaturesStronger = [...oppCreatures].sort((crea1, crea2) => crea2.power + crea2.toughness - (crea1.power + crea1.toughness));
        target = creaturesStronger.shift();
        debug('target is the best creature (I have lethal)');
        while (target && target.abilities.includes('W') && creaturesStronger.length >= 0){
            target = creaturesStronger.shift() || null;
            debug('target has ward, we select another one');
        }
    } else if (oppCreaWithWard.length > 0) {
        const [bestWard] = oppCreaWithWard;
        if (getDangerosity(bestWard) > getDangerosity(crea) && !crea.abilities.includes('L')){
            debug('target is the best ward creature');
            target = bestWard;
        }
    }
    if (target === null) {
        oppCreatures.sort((crea1, crea2) => getStronger(crea1, crea2) || crea2.abilities.length - crea1.abilities.length);
        const creaturesWeaker = oppCreatures.filter(oppCrea => oppCrea.power < crea.toughness && !oppCrea.abilities.includes('L'))
        const creaturesWeakerICanKill = creaturesWeaker.filter(oppCrea => oppCrea.toughness <= crea.power && !oppCrea.abilities.includes('W'));
        const creatureStrongerICanKill = oppCreatures.filter(oppCrea => oppCrea.toughness <= crea.power && oppCrea.power > crea.power && !oppCrea.abilities.includes('W'))

        if (creatureStrongerICanKill.length > 0) {
            target = creatureStrongerICanKill[0];
            debug('target is a crea stronger I can kill');
        }
        if (creaturesWeaker.length > 0) {
            if (creaturesWeakerICanKill.length > 0){
                target = creaturesWeakerICanKill[0];
                debug('target is a crea weaker I can kill');
            } else {
                target = creaturesWeaker[0];
                debug(`target is a crea weaker I can't kill`);
            }
        }
    }
    return target;
}

/**
 *  Main
 **/

function main(hand, creatures, oppCreatures, player) {
    let playableCards = getPlayable(hand, player);
    debug(`${player.mana} mana available`);
    debug(`${playableCards.length} cards playable`);

    while (playableCards.length > 0) {
        const combinations = getCombinations(playableCards);
        const playableSets = getPlayableSets(combinations, player.mana);
        const readableSets = getReadableSets(playableSets);

        playableSets.map((set,i) => {
            //printObj('set', set);
        });

        const [bestCombination] = playableSets;
        printObj('Best set', readableSets[0]);

        playableCards.sort((card1, card2) => {
            return card2.type - card1.type || card2.ccm - card1.ccm;
        });

        //look for a good target for the removal
        oppCreatures.sort((crea1, crea2) => {
            return crea2.power - crea1.power || crea2.toughness - crea1.toughness;
        });

        // for each removal, if we have a good target we use it
        // then we look for a creature to play
        const [card] = bestCombination;

        // Sort creatures to know which one to pump
        creatures.sort((crea1, crea2) => {
            return crea2.power - crea1.power || crea2.toughness - crea1.toughness
        });
        //possible targets for pump spells
        const worstCreature = creatures.slice(-1)[0];
        const [bestCreature] = creatures;

        /** Play cards **/
        //handle creatures
        if (card.type === 0) {
            player.mana -= card.ccm;
            playCreature(card);
        }
        //handle pump spells
        else if (card.type === 1 && worstCreature) {
            handlePumpSpell(card, hand, player, worstCreature, bestCreature, oppCreatures);
        }
        //handle removals
        else if (card.type >= 2 && oppCreatures.length > 0) {
            handleRemoval(card, oppCreatures, hand, player);
        } else {
            debug(`card ${card.id} not handled`);
            splice(hand, card.id);
        }
        playableCards = getPlayable(hand, player);
    }
}

function handlePumpSpell(card, hand, player, worstCreature, bestCreature, oppCreatures){
    printObj('worstCrea', worstCreature);
    printObj('bestCrea', bestCreature);
    const oppLethalCreatures = oppCreatures.filter(c => c.abilities.includes('L'));

    // special handle for lethal pumps
    if (card.abilities.includes('L')){
        if (worstCreature.abilities.includes('L')){
            debug(`don't play pump on a creature that's already lethal`);
            splice(hand, card.id);
        } else if(worstCreature.power + card.power === 0) {
            debug(`don't put lethal pumpspells on 0 power creatures`);
            splice(hand, card.id);
        } else if(worstCreature.power >= 4 && !card.abilities.includes('G')) {
            debug(`don't put lethal pumpspells that don't give guard on 4+ power creatures`);
        } else {
            debug('giving lethal to the worst creature');
            player.mana -= card.ccm;
            playPump(card, worstCreature, hand);
        }
    }
    // special handle for pumps that are good on the best creature
    else if (card.abilities.includes('W') || card.abilities.includes('G') || card.abilities.includes('D')){
        if (bestCreature.abilities.includes('G') && !card.abilities.includes('W')){
            debug(`don't play pump on a creature that's already guard (except for ward)`);
            splice(hand, card.id);
        } else {
            debug('playing pump on the best creature');
            player.mana -= card.ccm;
            playPump(card, bestCreature, hand);
        }
    }
    // power pump go on the worst creature
    else {
        if (oppLethalCreatures.length > 0) {
            debug(`don't play power pump when opp has lethal creatures in play`);
        }
        debug('playing pump on the worst creature');
        player.mana -= card.ccm;
        playPump(card, worstCreature, hand);
    }
}

function handleRemoval(card, oppCreatures, hand, player){
    let played = false;
    oppCreatures.forEach(target => {
        const danger = getDangerosity(target);
        const value = getValue(card);
        debug(`danger = ${danger}`);
        debug(`value = ${value}`);
    });

    oppCreatures.sort((crea1, crea2) => getDangerosity(crea2) - getDangerosity(crea1));

    oppCreatures.some(target => {
        const danger = getDangerosity(target);
        const value = getValue(card);
        debug(`danger = ${danger}`);
        debug(`value = ${value}`);
        if (danger > value) {
            debug('target is legit');
            if (target.toughness + card.toughness <= 0 && (!target.abilities.includes('W') || card.abilities.includes('W'))) {
                debug('removal can kill it');
                player.mana -= card.ccm;
                played = true;
                playRemoval(card, target, hand, oppCreatures);
                return played;
            } else {
                debug(`removal can't kill it`);
                debug(`${target.toughness} + ${card.toughness} = ${target.toughness + card.toughness}`);
            }
        }
        else {
            debug(`target isn't good enough`);
        }
    });
    if (!played) {
        debug(`no good target found for ${card.id}`);
        splice(hand, card.id);
    }
}

/**
 * Returns the Sets of all combinations of cards
 */
function getCombinations(rest, active = [], res = []){
    if (rest.length === 0){
        res.push(active);
        return active;
    } else {
        getCombinations(rest.slice(1), [...active, rest[0]], res);
        getCombinations(rest.slice(1), active, res);
    }
    return res;
}

/**
 * Returns only the sets of cards that are playable with the available mana
 */
function getPlayableSets(cards, mana) {
    return cards
        .filter(tab => tab.map(a => a.ccm).reduce((a, b) => a + b, 0) <= mana)
        .sort((t1, t2) => t2.map(a => a.ccm).reduce((a, b) => a + b, 0) - t1.map(a => a.ccm).reduce((a, b) => a + b, 0));
}

/**
 * Returns a simplified version of the sets that is readable
 */
function getReadableSets(set){
    return set.map(tab => tab.map(e => {
        return {id: e.number, ccm: e.ccm};
    }));
}

/****************************************************/
/*                  loop                            */
/****************************************************/

function game(player, opponent, cards, opponentHand) {
    let hand = getCardsFrom(cards, 'hand');
    let oppBoard = getCardsFrom(cards, 'oppBoard');
    let board = getCardsFrom(cards, 'board');

    debug('main 1');
    main(hand, board, oppBoard, player);

    board = getCardsFrom(cards, 'board');

    debug('combat');
    combat(board, oppBoard, player, opponent);

    board = getCardsFrom(cards, 'board');
    oppBoard = getCardsFrom(cards, 'oppBoard');
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
