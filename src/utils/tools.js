function copy(obj) {
    return Object.assign({}, obj);
}

function canKill(crea1, crea2) {
    return crea2.ward ?
        false :
        (crea1.lethal || crea1.power >= crea2.toughness);
}

function splice(cards, id) {
    const index = cards.findIndex(_card => _card.id === id);
    cards.splice(index, 1);
}

module.exports = {
    copy,
    canKill,
    splice,
};
