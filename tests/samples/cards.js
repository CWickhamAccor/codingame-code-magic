const creaHand = {
    id: 0,
    type: 'creature',
    ccm: 2,
    power: 0,
    toughness: 1,
    sick: true,
    attacked: false,
};

const creaHandCharge = {
    id: 1,
    type: 'creature',
    ccm: 2,
    power: 0,
    toughness: 1,
    charge: true,
    sick: false,
    attacked: false,
};

const creaBoardAttacked = {
    id: 10,
    type: 'creature',
    power: 0,
    toughness: 1,
    sick: false,
    attacked: true,
};

const creaBoardCanAttack = {
    id: 11,
    type: 'creature',
    power: 0,
    toughness: 1,
    sick: false,
    attacked: false,
};

const creaBoardOpponent = {
    id: 12,
    type: 'creature',
    power: 1,
    toughness: 2,
};

const creaBoardPower = {
    id: 13,
    type: 'creature',
    ccm: 2,
    power: 2,
    toughness: 2,
    charge: false,
    sick: false,
    attacked: false,
};

module.exports = {
    creaHand,
    creaHandCharge,
    creaBoardAttacked,
    creaBoardCanAttack,
    creaBoardOpponent,
    creaBoardPower,
};
