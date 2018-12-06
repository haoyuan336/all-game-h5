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
        let countMap = [{}, {}, {}, {}];
        for (let i = 0; i < pieceList.length; i++) {
            let number = parseInt(pieceList[i]);
            for (let z in countMap) {
                for (let j in countMap[z]) {
                    let value = 1;
                    if (z == 1) {
                        value = 16;
                    }
                    if (z == 2) {
                        value = 15;
                    }
                    if (z == 3){
                        value = 14;
                    }
                    if (number - parseInt(j) == value) {
                        countMap[z][number] = countMap[z][j] + 1;
                        delete countMap[z][j];
                    }
                    if (countMap[z][number] == 5){
                        return true;
                    }
                }
                if (!countMap[z][number]) {
                    countMap[z][number] = 1;
                }

            }
            console.log('count map ' , countMap);
        }
        // for (let i = 0 ; i < countMap.length ; i ++){
        //     for (let j in countMap[i]){
        //         if (countMap[i][j] == 5){
        //             return true;
        //         }
        //     }
        // }   
        
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