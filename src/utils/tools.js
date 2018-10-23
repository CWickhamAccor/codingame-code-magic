function copy(obj) {
    // return Object.assign({}, obj);
    return JSON.parse(JSON.stringify(obj));
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

function getCard(game, id) {
    const { hand, myBoard, oppBoard } = game;
    const [handArr, myBoardArr, oppBoardArr] = Object.values({ hand, myBoard, oppBoard });
    const cards = [...handArr, ...myBoardArr, ...oppBoardArr];
    return cards.find(card => card.id === id);
}

module.exports = {
    copy,
    canKill,
    splice,
    getCard,
};
