var dbconnection = require('./dbconfig');

exports.handler =  (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    dbconnection.getConnection(function(err, connection) {
        if(!err) {
            var h3 = event['h3'];
            var weekday = event['weekday'];
            var hour = event['hour'];

            console.log("Input from request ... " + JSON.stringify(event));
            console.log("h3 value from request ... " + JSON.stringify(h3));
            console.log("weekday value from request ... " + JSON.stringify(weekday));
            console.log("hour value from request ... " + JSON.stringify(hour));
            
            if(h3 ==null || h3.length==0){
                error="please provide valid h2 zone(s) h3 should be an array";
                console.log("h3 error ... " + JSON.stringify(error));
                callback(error);
            }
            if(weekday == null){
                error="please provide valid weekday (weekday should be an array";
                console.log("weekday error ... " + JSON.stringify(error));
                callback(error);
            }
            if(hour==null){
                error="please provide valid hour";
                console.log("hour error ... " + JSON.stringify(error));
                callback(error);
            }
            var sql = "";
            var params = [];
            if(h3 ==null || h3.length==0){
                sql="SELECT h3, count(*) as collision_count \
                from nyctaxidb.nyc_taxi_collision_info\
                where weekday=? and hour=?\
                group by h3, weekday,hour";
                params = [weekday,hour];
            }else{
                var innerselect = "";
                h3.forEach(element => {
                    innerselect = innerselect + "select '" + element + "' as akey union ";
                });
                sql="select I.akey as h3, coalesce(Y.collision_count,0) as collision_count from ( " + innerselect + "\
                select '" + h3[h3.length - 1] + "') as I\
                left join \
                (SELECT h3, count(*) as collision_count \
                from nyctaxidb.nyc_taxi_collision_info\
                where weekday=? and hour=?  and h3 in (?)\
                group by h3, weekday,hour) Y\
                on BINARY I.akey = BINARY Y.h3";
/*
                sql="SELECT h3, count(*) as collision_count \
                from nyctaxidb.nyc_taxi_collision_info\
                where weekday=? and hour=?  and h3 in (?)\
                group by h3, weekday,hour";
*/
                console.log('sql is ' + sql);                
                params = [weekday,hour,h3];
            }

            console.log("Database is connected ... nn " + sql);
            
            connection.query(sql, params, function (collision_error, collision_results, pickup_fields) {
                connection.release();
                if (collision_error) {
                    console.log("Database error ... " + JSON.stringify(collision_error));
                    callback(collision_error);
                }else{
                    callback(null,collision_results);
                } 
            });
            
        }else{
            console.log("Error connecting database ... nn " + JSON.stringify(err));
            callback(error);
        }

    });
  };