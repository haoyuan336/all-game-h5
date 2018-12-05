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
    checkWin(color) {
        let pieceList = [];
        for (let i in this._pieceMap) {
            if (this._pieceMap[i] == color) {
                pieceList.push(i);
            }
        }
        if (pieceList < 5) {
            //首先棋子的数量少于5  不可能赢的
            return false;
        }
        pieceList.sort((a, b) => {
            parseInt(a) - parseInt(b);
        });
        //首先分几种情况
        //首先是横列的情况


        if (this.checkFivePiece(pieceList)) {
            return true;
        }
        return false;
    }
    checkFivePiece(pieceList) {
        let index = 0;
        let oldNum = 'none';
        let countList = [1, 1, 1];

        while (index < pieceList.length) {
            let number = parseInt(pieceList[index]);
            let endNumber = number % 15;
            if (oldNum != 'none') {

                if (endNumber - oldNum % 15 == 1) {
                    countList[0]++;
                    if (countList[0] == 5) {
                        return true;
                    }

                } else {
                    countList[0] = 1;
                }

                if (number - oldNum == 0) {
                    countList[1]++;
                    if (countList[1] == 5) {
                        return true;
                    }
                } else {
                    countList[1] = 1;
                }
            }
            oldNum = number;
            index++;
        }
        return false;
    }
    getBoardData() {
        return this._pieceMap;
    }
}
module.exports = GameLogic