const { getUpdatedGameState } = require('../src/mcts/gameState');

describe('getUpdateGameState tests', () => {
    it('killing a creature', () => {
        const myBoard = [{
            id: 1,
            type: 'creature',
            power: 4,
            toughness: 5,
            sick: false,
            attacked: false,
        }];
        const oppBoard = [{
            id: 2,
            type: 'creature',
            power: 2,
            toughness: 4,
        }];
        const action = {
            type: 'attack',
            source: myBoard[0],
            target: oppBoard[0],
        };

        const gameState = { player: null, hand: null, myBoard, oppBoard };
        const newGameState = getUpdatedGameState(gameState, action);

        expect(newGameState).toEqual({
            player: null,
            hand: null,
            myBoard: [{
                id: 1,
                type: 'creature',
                power: 4,
                toughness: 3,
                sick: false,
                attacked: true,
            }],
            oppBoard: [],
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
            source: myBoard[0],
            target: oppBoard[0],
        };

        const gameState = { player: null, hand: null, myBoard, oppBoard };
        const newGameState = getUpdatedGameState(gameState, action);

        expect(newGameState).toEqual({
            player: null,
            hand: null,
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
            source: myBoard[0],
            target: oppBoard[0],
        };

        const gameState = { player: null, hand: null, myBoard, oppBoard };
        const newGameState = getUpdatedGameState(gameState, action);

        expect(newGameState).toEqual({
            player: null,
            hand: null,
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
            source: hand[0],
        };

        const gameState = { player, hand, myBoard, oppBoard };
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
});
