const { getUpdatedGameState } = require('../../src/mcts/gameState');
const { copy } = require('../../src/utils/tools');
const {
    creaHand,
    creaHandCharge,
    creaBoardCanAttack,
    creaBoardAttacked,
    creaBoardOpponent,
    creaBoardPower,
} = require('../samples/cards');

describe('getUpdateGameState tests', () => {
    it('killing a creature', () => {
        const player = {};
        const hand = [];
        const myBoard = [copy(creaBoardPower)];
        const oppBoard = [copy(creaBoardOpponent)];
        const action = {
            type: 'attack',
            source: creaBoardPower.id,
            target: creaBoardOpponent.id,
        };

        const gameState = {
            player, hand, myBoard, oppBoard,
        };
        const newGameState = getUpdatedGameState(gameState, action);

        const expectedBoard = copy(creaBoardPower);
        expectedBoard.attacked = true;
        expectedBoard.toughness = 1;

        expect(newGameState).toEqual({
            player: {},
            hand: [],
            myBoard: [expectedBoard],
            oppBoard: [],
        });

        expect(gameState).toEqual({
            player: {},
            hand: [],
            myBoard: [creaBoardPower],
            oppBoard: [creaBoardOpponent],
        });
    });

    it('trading creatures', () => {
        const myBoard = [{
            id: 1,
            type: 'creature',
            power: 3,
            toughness: 2,
            sick: false,
            attacked: false,
        }];
        const oppBoard = [{
            id: 2,
            type: 'creature',
            power: 2,
            toughness: 3,
        }];
        const action = {
            type: 'attack',
            source: myBoard[0].id,
            target: oppBoard[0].id,
        };

        const gameState = {
            player: {}, hand: [], myBoard, oppBoard,
        };
        const newGameState = getUpdatedGameState(gameState, action);

        expect(newGameState).toEqual({
            player: {},
            hand: [],
            myBoard: [],
            oppBoard: [],
        });
    });

    it('losing a creatures in combat', () => {
        const myBoard = [{
            id: 1,
            type: 'creature',
            power: 1,
            toughness: 2,
            sick: false,
            attacked: false,
        }];
        const oppBoard = [{
            id: 2,
            type: 'creature',
            power: 2,
            toughness: 3,
        }];
        const action = {
            type: 'attack',
            source: myBoard[0].id,
            target: oppBoard[0].id,
        };

        const gameState = {
            player: {}, hand: [], myBoard, oppBoard,
        };
        const newGameState = getUpdatedGameState(gameState, action);

        expect(newGameState).toEqual({
            player: {},
            hand: [],
            myBoard: [],
            oppBoard: [{
                id: 2,
                type: 'creature',
                power: 2,
                toughness: 2,
            }],
        });
    });

    it('playing a creature', () => {
        const player = {
            mana: 2,
        };
        const hand = [{
            id: 0,
            type: 'creature',
            power: 3,
            toughness: 2,
            ccm: 2,
        }];
        const myBoard = [];
        const oppBoard = [];
        const action = {
            type: 'play',
            source: hand[0].id,
        };

        const gameState = {
            player, hand, myBoard, oppBoard,
        };
        const newGameState = getUpdatedGameState(gameState, action);

        expect(newGameState).toEqual({
            player: {
                mana: 0,
            },
            hand: [],
            myBoard: [{
                id: 0,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 2,
                attacked: false,
                sick: true,
            }],
            oppBoard: [],
        });
    });

    it('some random attack', () => {
        const player = { mana: 0 };
        const hand = [];
        const myBoard = [
            {
                id: 11, type: 'creature', power: 0, toughness: 1, sick: false, attacked: false,
            },
            {
                id: 1, type: 'creature', ccm: 2, power: 0, toughness: 1, charge: true, sick: false, attacked: false,
            },
        ];
        const oppBoard = [{
            id: 12, type: 'creature', power: 1, toughness: 2,
        }];
        const action = {
            type: 'attack',
            source: 11,
            target: 12,
        };
        const gameState = { player, hand, myBoard, oppBoard };
        const newGameState = getUpdatedGameState(gameState, action);
        expect(newGameState).toEqual({
            player: { mana: 0 },
            hand: [],
            myBoard: [{
                id: 1, type: 'creature', ccm: 2, power: 0, toughness: 1, charge: true, sick: false, attacked: false,
            }],
            oppBoard: [{
                id: 12, type: 'creature', power: 1, toughness: 2,
            }],
        });
    });
});
