const { getSetOfPossibleActions } = require('../../src/mcts/newMain');
const { copy } = require('../../src/utils/tools');
const {
    creaHand,
    creaHandCharge,
    creaBoardAttacked,
    creaBoardCanAttack,
    creaBoardOpponent,
} = require('../samples/cards');

describe('getPossibleSets', () => {
    it('testing 0 possible action', () => {
        const player = {
            mana: 0,
        };
        const hand = [copy(creaHand)];
        const myBoard = [copy(creaBoardAttacked)];
        const oppBoard = [copy(creaBoardOpponent)];
        const game = {
            player, hand, myBoard, oppBoard,
        };
        const set = [];
        getSetOfPossibleActions(game, set);
        expect(set).toContainEqual([]);
        expect(set).toEqual([
            [],
        ]);
    });

    it('testing simple turnActions', () => {
        const player = {
            mana: 2,
        };
        const hand = [copy(creaHandCharge)];
        const myBoard = [];
        const oppBoard = [copy(creaBoardOpponent)];
        const game = {
            player, hand, myBoard, oppBoard,
        };
        const set = [];
        getSetOfPossibleActions(game, set);

        expect(set).toContainEqual([]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id }]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
        ]);
        expect(set).toHaveLength(3);

        expect(set).toEqual([
            [],
            [
                { type: 'play', source: creaHandCharge.id },
            ],
            [
                { type: 'play', source: creaHandCharge.id },
                { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
            ],
        ]);
    });

    it('testing multiple turnActions', () => {
        const player = {
            mana: 2,
        };
        const hand = [copy(creaHandCharge)];
        const myBoard = [copy(creaBoardCanAttack)];
        const oppBoard = [copy(creaBoardOpponent)];
        const game = {
            player, hand, myBoard, oppBoard,
        };
        const set = [];
        getSetOfPossibleActions(game, set);


        expect(set).toContainEqual([]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id }]);
        expect(set).toContainEqual([
            { type: 'attack', source: creaBoardCanAttack.id, target: creaBoardOpponent.id },
        ]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
        ]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaBoardCanAttack.id, target: creaBoardOpponent.id },
        ]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
            { type: 'attack', source: creaBoardCanAttack.id, target: creaBoardOpponent.id },
        ]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaBoardCanAttack.id, target: creaBoardOpponent.id },
            { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
        ]);
        expect(set).toContainEqual([
            { type: 'attack', source: creaBoardCanAttack.id, target: creaBoardOpponent.id },
            { type: 'play', source: creaHandCharge.id },
        ]);
        expect(set).toContainEqual([
            { type: 'attack', source: creaBoardCanAttack.id, target: creaBoardOpponent.id },
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
        ]);

        expect(set).toHaveLength(9);
    });

    it('testing turn one action', () => {
        const gameState = {
            phase: 'play',
            player: {
                health: 30,
                mana: 1,
                deck: 25,
                rune: 25,
                draw: 1,
            },
            opponent: {
                health: 30,
                mana: 1,
                deck: 25,
                rune: 25,
                draw: 1,
                hand: 5,
                oppActions: [],
            },
            hand: [
                {
                    number: 3,
                    id: 1,
                    location: 0,
                    type: 'creature',
                    ccm: 1,
                    power: 2,
                    toughness: 2,
                    abilities: [],
                    cardDraw: 0,
                },
                {
                    number: 6,
                    id: 3,
                    location: 0,
                    type: 'creature',
                    ccm: 2,
                    power: 3,
                    toughness: 2,
                    abilities: [],
                    cardDraw: 0,
                },
                {
                    number: 8,
                    id: 5,
                    location: 0,
                    type: 'creature',
                    ccm: 2,
                    power: 2,
                    toughness: 3,
                    abilities: [],
                    cardDraw: 0,
                },
                {
                    number: 14,
                    id: 7,
                    location: 0,
                    type: 'creature',
                    ccm: 4,
                    power: 9,
                    toughness: 1,
                    abilities: [],
                    cardDraw: 0,
                },
                {
                    number: 19,
                    id: 9,
                    location: 0,
                    type: 'creature',
                    ccm: 5,
                    power: 5,
                    toughness: 6,
                    abilities: [],
                    cardDraw: 0,
                },
            ],
            myBoard: [],
            oppBoard: [],
        };
        const set = [];
        getSetOfPossibleActions(gameState, set);
        expect(set).toContainEqual([{ type: 'play', source: 1 }]);
        expect(set).toContainEqual([]);
        expect(set.length).toEqual(2);
    });
});
