var req = require('request');
exports.handler =  (event, context, callback) => {
    var h3 = event['h3'];
    var weekday = event['weekday'];
    var hour = event['hour'];
    console.log('event is ' + JSON.stringify(event));
    console.log('event json is ' + JSON.stringify(event['json']));
    const params = {
        url: 'https://ussouthcentral.services.azureml.net/workspaces/a33bc535e638467295fcc065406e10e8/services/0ef59aaa15e04dd9b3169b827fc87016/execute?api-version=2.0&details=true',
        headers: { 'Content-Type': 'application/json' },
        json: event
    };    
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
};
  




