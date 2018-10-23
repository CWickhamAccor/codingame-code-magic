const { getPossibleSetsOfActions } = require('../../src/mcts/gameState');
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
        getPossibleSetsOfActions(game, set);
        expect(set).toContainEqual([]);
        expect(set).toEqual([
            [],
        ]);
    });

    it('testing simple actions', () => {
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
        getPossibleSetsOfActions(game, set);

        expect(set).toContainEqual([]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id }]);
        expect(set).toContainEqual([
            { type: 'play', source: creaHandCharge.id },
            { type: 'attack', source: creaHandCharge.id, target: creaBoardOpponent.id },
        ]);
        expect(set.length).toEqual(3);

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

    it('testing multiple actions', () => {
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
        getPossibleSetsOfActions(game, set);


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

        expect(set.length).toEqual(9);
    });
});
