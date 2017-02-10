var mysql = require(".././node_modules/mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1417789619',
    database: 'fun',
    multipleStatements: true
});
function setInsertSql(table,obj){
    var key = "",
        value = "";
    for( var k in obj ){
        key= key+k+",";
        value= value+ connection.escape(obj[k])+",";
    }
    key = key.substring(0,key.length-1);
    value = value.substring(0,value.length-1);
    return    "INSERT INTO "+table+" ( "+key+") VALUES ("+value+")";
}
function setUpdateSql(table,obj,where){
    var values = "";
    for( var k in obj ){
        values = values+( k +"="+obj[k]+",");
    }
    values = values.substring(0,values.length-1);
    return    "UPDATE  "+table+" SET "+values+" where "+where;
}
function query(sql,callback){
    connection.connect();
    connection.query(sql, function (error, results, fields) {
        if (error){
            throw error;
        }else{
            callback( results, fields);
        }
    });
    connection.end();
}


module.exports = {

    insert:function(table,obj,callback){
        var sql =   setInsertSql(table,obj);
        query(sql,callback);

    },
    multInsert:function(table,arr,callback){
        var sql = "";
        for(var i =0;i<arr.length;i++){
             sql = sql +  setInsertSql(table,arr[i]) + ";"
        }
        sql = sql.substring(0,sql.length-1);
        query(sql,callback);
    },
    update:function(table,obj,where,callback){
        var sql =   setUpdateSql(table,obj,where);
        query(sql,callback);
    },
    select:function(sql,callback){
        query(sql,callback);
    },
    selectPage:function(sql,page,limit,callback){
        var start = (page-1)*limit,
            end = limit;
        sql = sql + ("  limit "+start+","+end);
        query(sql,callback);

    }
};
