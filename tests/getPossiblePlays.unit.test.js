const { getPossibleActions, getPossibleAttacks, getPossiblePlays } = require('../src/mcts/gameState')

describe('getPossiblePlays', () => {
    it('testing getPossibleAttacks', () => {
        const myBoard = [
            {
                id: 0,
                type: 'creature',
                power: 1,
                toughness: 1,
                sick: false,
                attacked: false,
            },
            {
                id: 1,
                type: 'creature',
                power: 2,
                toughness: 2,
                sick: false,
                attacked: false,
            },
            {
                id: 2,
                type: 'creature',
                power: 3,
                toughness: 3,
                sick: true,
                attacked: false,
            },
            {
                id: 3,
                type: 'creature',
                power: 4,
                toughness: 4,
                sick: false,
                attacked: true,
            },
        ];
        const oppBoard = [
            {
                id: 4,
                type: 'creature',
                power: 1,
                toughness: 1,
                sick: false,
                attacked: false,
            },
            {
                id: 5,
                type: 'creature',
                power: 2,
                toughness: 2,
                sick: false,
                attacked: false,
            },
        ];
        const [crea1, crea2, crea3, crea4] = myBoard;
        const [crea5, crea6] = oppBoard;
        const attacks = getPossibleAttacks({ myBoard, oppBoard });
        expect(attacks).toEqual([
            {
                type: 'attack',
                source: crea1,
                target: crea5,
            },
            {
                type: 'attack',
                source: crea1,
                target: crea6,
            },
            {
                type: 'attack',
                source: crea2,
                target: crea5,
            },
            {
                type: 'attack',
                source: crea2,
                target: crea6,
            },
        ]);
    });

    it('testing getPossiblePlays', () => {
        const player = {
            mana: 4,
        };
        const hand = [
            {
                id: 0,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 2,
            },
            {
                id: 1,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 4,
            },
            {
                id: 2,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 6,
            },
        ];
        const [crea1, crea2, crea3] = hand;
        const plays = getPossiblePlays({ player, hand });
        expect(plays).toEqual([
            {
                type: 'play',
                source: crea1,
            },
            {
                type: 'play',
                source: crea2,
            },
        ]);
    });

    it('testing getPossibleActions', () => {
        const myBoard = [
            {
                id: 0,
                type: 'creature',
                power: 1,
                toughness: 1,
                sick: false,
                attacked: false,
            },
            {
                id: 1,
                type: 'creature',
                power: 2,
                toughness: 2,
                sick: false,
                attacked: false,
            },
            {
                id: 2,
                type: 'creature',
                power: 3,
                toughness: 3,
                sick: true,
                attacked: false,
            },
            {
                id: 3,
                type: 'creature',
                power: 4,
                toughness: 4,
                sick: false,
                attacked: true,
            },
        ];
        const oppBoard = [
            {
                id: 4,
                type: 'creature',
                power: 1,
                toughness: 1,
                sick: false,
                attacked: false,
            },
            {
                id: 5,
                type: 'creature',
                power: 2,
                toughness: 2,
                sick: false,
                attacked: false,
            },
        ];
        const player = {
            mana: 4,
        };
        const hand = [
            {
                id: 6,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 2,
            },
            {
                id: 7,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 4,
            },
            {
                id: 8,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 6,
            },
        ];

        const [crea1, crea2, crea3, crea4] = myBoard;
        const [crea5, crea6] = oppBoard;
        const [crea7, crea8, crea9] = hand;
        const gameState = { hand, player, myBoard, oppBoard };
        const actions = getPossibleActions(gameState);

        expect(actions).toEqual([
            {
                type: 'play',
                source: crea7,
            },
            {
                type: 'play',
                source: crea8,
            },
            {
                type: 'attack',
                source: crea1,
                target: crea5,
            },
            {
                type: 'attack',
                source: crea1,
                target: crea6,
            },
            {
                type: 'attack',
                source: crea2,
                target: crea5,
            },
            {
                type: 'attack',
                source: crea2,
                target: crea6,
            },
        ]);
    });

    it('testing getPossibleActions with 0 action', () => {
        const myBoard = [
            {
                id: 0,
                type: 'creature',
                power: 1,
                toughness: 1,
                sick: true,
                attacked: false,
            },
            {
                id: 1,
                type: 'creature',
                power: 2,
                toughness: 2,
                sick: true,
                attacked: false,
            },
            {
                id: 2,
                type: 'creature',
                power: 3,
                toughness: 3,
                sick: true,
                attacked: false,
            },
            {
                id: 3,
                type: 'creature',
                power: 4,
                toughness: 4,
                sick: false,
                attacked: true,
            },
        ];
        const oppBoard = [
            {
                id: 4,
                type: 'creature',
                power: 1,
                toughness: 1,
                sick: false,
                attacked: false,
            },
            {
                id: 5,
                type: 'creature',
                power: 2,
                toughness: 2,
                sick: false,
                attacked: false,
            },
        ];
        const player = {
            mana: 0,
        };
        const hand = [
            {
                id: 6,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 2,
            },
            {
                id: 7,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 4,
            },
            {
                id: 8,
                type: 'creature',
                power: 3,
                toughness: 2,
                ccm: 6,
            },
        ];

        const [crea1, crea2, crea3, crea4] = myBoard;
        const [crea5, crea6] = oppBoard;
        const [crea7, crea8, crea9] = hand;
        const gameState = { hand, player, myBoard, oppBoard };
        const actions = getPossibleActions(gameState);

        expect(actions).toEqual([]);
    });
});
