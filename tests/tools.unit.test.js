const { copy, getCard, splice } = require('../src/utils/tools');
const {
    creaHand,
    creaHandCharge,
    creaBoardCanAttack,
    creaBoardAttacked,
    creaBoardOpponent,
} = require('./samples/cards');

describe('copy test', () => {
    it('testing on a basic object', () => {
        const card = { toughness: 3 };
        const a = { card };
        const b = copy(a);
        card.toughness = 5;
        expect(a).toEqual({ card: { toughness: 5 } });
        expect(b).toEqual({ card: { toughness: 3 } });
    });
});

function testGetCard(expected, game) {
    const { id } = expected;
    expect(getCard(game, id)).toEqual(expected);
}

describe('getCard test', () => {
    const game = {
        hand: [copy(creaHand), copy(creaHandCharge)],
        myBoard: [copy(creaBoardCanAttack), copy(creaBoardAttacked)],
        oppBoard: [copy(creaBoardOpponent)],
    };

    it('creaHand', () => {
        testGetCard(creaHand, game);
    });

    it('creaHandCharge', () => {
        testGetCard(creaHandCharge, game);
    });

    it('creaBoardAttacked', () => {
        testGetCard(creaBoardAttacked, game);
    });

    it('creaBoardCanAttack', () => {
        testGetCard(creaBoardCanAttack, game);
    });

    it('creaBoardOpponent', () => {
        testGetCard(creaBoardOpponent, game);
    });
});

describe('test splice', () => {
    const tab = [
        { id: 4 },
        { id: 5 },
        { id: 6 },
    ];
    it('removing 4', () => {
        const newTab = copy(tab);
        splice(newTab, 4);
        expect(newTab).toEqual([
            { id: 5 },
            { id: 6 },
        ]);
    });
    it('removing 5', () => {
        const newTab = copy(tab);
        splice(newTab, 5);
        expect(newTab).toEqual([
            { id: 4 },
            { id: 6 },
        ]);
    });
    it('removing 6', () => {
        const newTab = copy(tab);
        splice(newTab, 6);
        expect(newTab).toEqual([
            { id: 4 },
            { id: 5 },
        ]);
    });
});
