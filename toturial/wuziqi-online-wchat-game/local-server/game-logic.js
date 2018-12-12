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
        console.log('index = ', index);
        console.log('color = ', color);
        console.log('piecemap =', this._pieceMap);
        let countMap = [0, 0, 0, 0];
        for (let j = 0; j < countMap.length; j++) {
            countMap[j] = 0;
            let value = 1;
            if (j == 1) {
                value = 15;
            }
            if (j == 2) {
                value = 16;
            }
            if (j == 3) {
                value = 14;
            }
            for (let i = -4; i < 5; i++) {
                let startIndex = index + i * value;
                startIndex = startIndex.toString();
                console.log('寻找index ', i);
                if (this._pieceMap[startIndex] && this._pieceMap[startIndex] == color) {
                    console.log('存在');
                    countMap[j]++;
                } else {
                    console.log('不存在');
                    countMap[j] = 0;
                }
                if (countMap[j] == 5) {
                    return true;
                }
            }
            console.log('count map = ', countMap);
        }
        console.log('未胜利');
        return false;
    }
    getBoardData() {
        return this._pieceMap;
    }
    clearGameData() {
        this._pieceMap = {};
    }
}
module.exports = GameLogic