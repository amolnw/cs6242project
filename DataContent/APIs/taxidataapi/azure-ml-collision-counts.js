var req = require('request');
exports.handler =  (event, context, callback) => {
    var h3 = event['h3'];
    var weekday = event['weekday'];
    var hour = event['hour'];
    console.log('event is ' + JSON.stringify(event));
    console.log('event json is ' + JSON.stringify(event['json']));
    const params = {
        url: 'https://ussouthcentral.services.azureml.net/workspaces/a33bc535e638467295fcc065406e10e8/services/0ef59aaa15e04dd9b3169b827fc87016/execute?api-version=2.0&details=true',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eKn/KvcZKnH4lePXOGdkOS1c03Ab+KbaGB5NvMLbaDRN37aPQSIlZjmGhRgkn0ovblfSHQg01L6LuvWjAxaapQ==' },
        json: event
    };    
/*
    const params = {
        url: 'https://ussouthcentral.services.azureml.net/workspaces/a33bc535e638467295fcc065406e10e8/services/d9e9ca48b2ab4fdd9a87fdf0868c728e/execute?api-version=2.0&details=true',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer mFzMN1A+dJatX0rW4KoTXAZH+PyX8OPQH/92w+dK/gRALCo/i5+RMRLPUyBgT2cp4DO6swpLtQCNfj124k7a3g==' },
        json: '{\
            "Inputs": {\
              "input1": {\
                "ColumnNames": [\
                  "latitude",\
                  "longitude",\
                  "weekday",\
                  "hour"\
                ],\
                "Values": [\
                  [\
                    "39.01997",\
                    "-62.15469",\
                    "Wed",\
                    "9"        ],\
                  [\
                    "40.57442",\
                    "-74.00723",\
                    "Sun",\
                    "0"        ],\
                  [\
                    "40.57414",\
                    "-73.98085",\
                    "Tue",\
                    "20"\
                              ]\
                ]\
              }\
            },\
            "GlobalParameters": {}\
          }'
    };
*/    
    console.log('------before req call ------');
    try {
        console.log('------req ------' + JSON.stringify(params));
            req.post(params, function(err, res, body) {
                console.log('------ calling ------');
                if(err){
                    console.log('------error------', err);
                    callback(err);
                } else{
                    console.log('------success--------', body);
                    callback(null,body);
                }
            });
    }catch(err) {
        console.log('------ error calling  ------' + err);
    }

//                    callback(pickup_error);
//                    callback(null,pickup_results);

};
  




