class GameLogic {
    constructor() {
        this._pieceMap = {};
    }
    movePiece(index, color) {

        if (!this._pieceMap[index]) {
            this._pieceMap[index] = color;
            return true;
        } else {
            return false;
        }
    }
    checkWin(index, color) {
        let countMap = [0, 0, 0, 0];
        for (let j = 0; j < countMap.length; j++) {
            countMap[j] = 0;
            let value = 1;
            if (j == 1) {
                value = 13;
            }
            if (j == 2) {
                value = 14;
            }
            if (j == 3) {
                value = 12;
            }
            for (let i = -4; i < 5; i++) {
                let startIndex = index + i * value;
                startIndex = startIndex.toString();
                if (this._pieceMap[startIndex] && this._pieceMap[startIndex] == color) {
                    countMap[j]++;
                } else {
                    countMap[j] = 0;
                }
                if (countMap[j] == 5) {
                    return true;
                }
            }
        }
        return false;
    }
    getBoardData() {

        let data = [];
        for (let i in this._pieceMap) {
            data.push({
                index: i,
                color: this._pieceMap[i]
            })
        }

        return data;
    }
    clearGameData() {
        this._pieceMap = {};
    }
}
module.exports = GameLogic