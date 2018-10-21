const { getPossibleSetsOfActions } = require('../src/mcts/gameState');

describe('getPossibleSets', () => {
    it('testing 0 possible action', () => {
        const player = {
            mana: 0,
        };
        const hand = [{
            id: 0,
            type: 'creature',
            ccm: 2,
        }];
        const myBoard = [{
            id: 0,
            type: 'creature',
            power: 1,
            toughness: 1,
            sick: false,
            attacked: true,
        }];
        const oppBoard = [{
            id: 4,
            type: 'creature',
            power: 1,
            toughness: 1,
            sick: false,
            attacked: false,
        }];
        const game = { player, hand, myBoard, oppBoard };
        const set = getPossibleSetsOfActions(game);
        expect(set).toEqual([
            [],
        ]);
    });

    it('testing simple actions', () => {
        const player = {
            mana: 2,
        };
        const hand = [{
            id: 0,
            type: 'creature',
            ccm: 2,
            charge: true,
        }];
        const myBoard = [];
        const oppBoard = [{
            id: 4,
            type: 'creature',
        }];
        const game = { player, hand, myBoard, oppBoard };
        const set = getPossibleSetsOfActions(game);
        expect(set).toEqual([
            [],
            [
                {
                    type: 'play',
                    source: {
                        id: 0,
                        type: 'creature',
                        ccm: 2,
                        charge: true,
                        sick: false,
                        attacked: false,
                    },
                },
            ],
            [
                {
                    type: 'play',
                    source: {
                        id: 0,
                        type: 'creature',
                        ccm: 2,
                        charge: true,
                        sick: false,
                        attacked: false,
                    },
                },
                {
                    type: 'attack',
                    source: {
                        id: 0,
                        type: 'creature',
                        ccm: 2,
                        charge: true,
                        sick: false,
                        attacked: false,
                    },
                    target: {
                        id: 4,
                        type: 'creature',
                    },
                },
            ],
        ]);
    });

    // it('testing multiple actions', () => {
    //     const player = {
    //         mana: 2,
    //     };
    //     const hand = [{
    //         id: 0,
    //         type: 'creature',
    //         ccm: 2,
    //         charge: true,
    //     }];
    //     const myBoard = [];
    //     const oppBoard = [{
    //         id: 4,
    //         type: 'creature',
    //     }];
    //     const game = { player, hand, myBoard, oppBoard };
    //     const set = getPossibleSetsOfActions(game);
    //     expect(set).toEqual([
    //         [],
    //         [
    //             {
    //                 type: 'play',
    //                 source: {
    //                     id: 0,
    //                     type: 'creature',
    //                     ccm: 2,
    //                     charge: true,
    //                     sick: false,
    //                     attacked: false,
    //                 },
    //             },
    //         ],
    //         [
    //             {
    //                 type: 'play',
    //                 source: {
    //                     id: 0,
    //                     type: 'creature',
    //                     ccm: 2,
    //                     charge: true,
    //                     sick: false,
    //                     attacked: false,
    //                 },
    //             },
    //             {
    //                 type: 'attack',
    //                 source: {
    //                     id: 0,
    //                     type: 'creature',
    //                     ccm: 2,
    //                     charge: true,
    //                     sick: false,
    //                     attacked: false,
    //                 },
    //                 target: {
    //                     id: 4,
    //                     type: 'creature',
    //                 },
    //             },
    //         ],
    //     ]);
    // });
});
