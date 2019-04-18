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
                console.log("h3 error ... " + JSON.stringify(err));
                callback(error);
            }
            if(weekday == null){
                error="please provide valid weekday (weekday should be an array";
                console.log("weekday error ... " + JSON.stringify(err));
                callback(error);
            }
            if(hour==null){
                error="please provide valid hour";
                console.log("hour error ... " + JSON.stringify(err));
                callback(error);
            }
            var sql = "";
            var params = [];
            if(h3 ==null || h3.length==0){
                sql="select h3,pickup_count \
                from nyctaxidb.nyc_taxi_pickup_grpby_info \
                where weekday=? and hour= ?";
                params = [weekday,hour,weekday,hour];       
            }else{
                var innerselect="";
                h3.forEach(element => {
                    innerselect = innerselect + "select '" + element + "' as akey union ";
                });
                sql="select I.akey as h3, coalesce(Y.pickup_count,0) as pickup_count from ( " + innerselect + "\
                select '" + h3[h3.length - 1] + "') as I\
                left join \
                (SELECT h3, pickup_count \
                from nyctaxidb.nyc_taxi_pickup_grpby_info\
                where weekday=? and hour=?  and h3 in (?)\
                group by h3, weekday,hour) Y\
                on BINARY I.akey = BINARY Y.h3";

/*
                sql="select h3,pickup_count \
                from nyctaxidb.nyc_taxi_pickup_grpby_info \
                where weekday=? and hour= ? and h3 in (?)";
*/                
                params = [weekday,hour,h3];
            }


            var pickup_traffic=[];
            var collision_data=[];
            var results={};
            console.log("Database is connected ... nn " + sql);
            
            connection.query(sql, params, function (pickup_error, pickup_results, pickup_fields) {
                connection.release();
                if (pickup_error) {
                    console.log("Database error ... " + JSON.stringify(pickup_error));
                    callback(pickup_error);
                }else{
                    callback(null,pickup_results);

                } 
            });
            
        }else{
            console.log("Error connecting database ... nn " + JSON.stringify(err));
            callback(error);
        }

    });
  };