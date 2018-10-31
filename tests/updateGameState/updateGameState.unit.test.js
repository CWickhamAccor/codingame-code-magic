const { getUpdatedGameState } = require('../../src/mcts/newMain');
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
        const gameState = {
            player, hand, myBoard, oppBoard,
        };
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

    it('playing a creature from a full hand', () => {
        const gameState = {
            phase: 'play',
            player: {
                mana: 12,
            },
            opponent: {},
            hand: [
                {
                    number: 3,
                    id: 1,
                    type: 'creature',
                    ccm: 1,
                    power: 2,
                    toughness: 2,
                },
                {
                    number: 6,
                    id: 3,
                    type: 'creature',
                    ccm: 2,
                    power: 3,
                    toughness: 2,
                },
                {
                    number: 8,
                    id: 5,
                    type: 'creature',
                    ccm: 2,
                    power: 2,
                    toughness: 3,
                },
                {
                    number: 14,
                    id: 7,
                    type: 'creature',
                    ccm: 4,
                    power: 9,
                    toughness: 1,
                },
                {
                    number: 19,
                    id: 9,
                    type: 'creature',
                    ccm: 5,
                    power: 5,
                    toughness: 6,
                },
                {
                    number: 16,
                    id: 11,
                    type: 'creature',
                    ccm: 4,
                    power: 6,
                    toughness: 2,
                },
                {
                    number: 5,
                    id: 13,
                    type: 'creature',
                    ccm: 2,
                    power: 4,
                    toughness: 1,
                },
                {
                    number: 22,
                    id: 15,
                    type: 'creature',
                    ccm: 6,
                    power: 7,
                    toughness: 5,
                },
            ],
            myBoard: [],
            oppBoard: [
                {
                    number: 8,
                    id: 12,
                    type: 'creature',
                    ccm: 2,
                    power: 2,
                    toughness: 3,
                },
            ],
        };
        const action = {
            type: 'play',
            source: 1,
        };
        const newGameState = getUpdatedGameState(gameState, action);
        expect(newGameState.myBoard).toHaveLength(1);
    });

    it('attacking a creature and killing it', () => {
        const gameState = {
            phase: 'play',
            player: {
                health: 30,
                mana: 2,
                deck: 19,
                rune: 25,
                draw: 1,
            },
            opponent: {
                health: 28,
                mana: 6,
                deck: 19,
                rune: 25,
                draw: 1,
                hand: 6,
                oppActions: [
                    '109 SUMMON 10',
                ],
            },
            hand: [
                {
                    number: 61,
                    id: 21,
                    location: 0,
                    type: 'creature',
                    ccm: 9,
                    power: 10,
                    toughness: 10,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                },
                {
                    number: 22,
                    id: 15,
                    location: 0,
                    type: 'creature',
                    ccm: 6,
                    power: 7,
                    toughness: 5,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                },
                {
                    number: 16,
                    id: 11,
                    location: 0,
                    type: 'creature',
                    ccm: 4,
                    power: 6,
                    toughness: 2,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                },
            ],
            myBoard: [
                {
                    number: 18,
                    id: 17,
                    location: 1,
                    type: 'creature',
                    ccm: 4,
                    power: 7,
                    toughness: 4,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                },
                {
                    number: 5,
                    id: 13,
                    location: 1,
                    type: 'creature',
                    ccm: 2,
                    power: 4,
                    toughness: 1,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                },
                {
                    number: 109,
                    id: 19,
                    location: 0,
                    type: 'creature',
                    ccm: 5,
                    power: 5,
                    toughness: 6,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                    sick: true,
                    attacked: false,
                },
            ],
            oppBoard: [
                {
                    number: 109,
                    id: 10,
                    location: -1,
                    type: 'creature',
                    ccm: 5,
                    power: 5,
                    toughness: 6,
                    breakthrough: false,
                    charge: false,
                    drain: false,
                    guard: false,
                    lethal: false,
                    ward: false,
                    cardDraw: 0,
                },
            ],
        };
        const action = {
            type: 'attack',
            source: 17,
            target: 10,
        };
        const newGameState = getUpdatedGameState(gameState, action);
        expect(newGameState.oppBoard).toHaveLength(0);
    });
});
