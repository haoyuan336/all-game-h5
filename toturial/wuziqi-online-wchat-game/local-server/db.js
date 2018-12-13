const mysql = require('mysql');
let client = undefined;
const query = function (sql, cb) {
    client.getConnection((err, connection) => {
        if (err) {
            console.log('get connection = ' + err);
            if (cb) {
                cb(err);
            }
        } else {
            connection.query(sql, (connErr, result) => {
                if (connErr) {
                    console.log(sql + connErr);
                    if (cb) {
                        cb(connErr);
                    }
                } else {
                    if (cb) {
                        cb(null, result);
                    }
                }
                connection.release();
            })
        }
    });
};
const getPlayerScore = function (key, cb) {
    let sql = 'select * from score_table where `key` = ' + '"' + key + '"' + ';';
    query(sql, (err, data) => {
        if (err) {
            console.log('err = ', err)
            cb(err);
        } else {
            console.log('data', data);
            if (data[0]) {
                cb(null, data[0]);
            } else {
                cb(null, null);
            }
        }
    });
}
exports.getPlayerScore = getPlayerScore;

exports.setPlayerScore = function (key, score) {
    getPlayerScore(key, (err, data) => {
        if (err != null || data == null) {
            let sql = 'insert into score_table (`key`,`value`) values (' + '"' + key +'",' + score + ');';
            query(sql, ()=>{

            });
        } else {
            let sql = 'update score_table set `value` = ' + score + ' where `key` = ' + '"' + key + '";';
            console.log('set player score = ', sql);
            query(sql, (err, data) => {

            });
        }
    })
}
exports.getRankList = function(cb){
    let sql = 'select * from rank_table;';
    query(sql, cb);
}
exports.updateRankList = function(rankData){
    let selectSql = 'select * from rank_table;'
    query(selectSql, (err, data)=>{
        if (!err || data.length == 0){
            console.log('数据库里面没有排行榜数据')
            //先插入一条再说
            let sql = 'insert into rank_table (`value`) values ( \''  + JSON.stringify(rankData) + '\'' +');';
            console.log('sql =' , sql);
            query(sql, ()=>{
                console.log('插入数据成功');
            })
        }else{
            let sql = 'udpate rank_table set `value` = \'' + JSON.stringify(rankData) + '\';';
            query(sql, ()=>{
                console.log('update success');
            });
        }
    });
}

exports.connect = function () {
    client = mysql.createPool({
        "host": "127.0.0.1",
        "port": 3306,
        "user": "root",
        "password": "chu7758521",
        "database": "wuziqi_world_rank"
    });
};