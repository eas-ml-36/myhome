var table = "dht11";
var table_gas = "gas_meter";
var dbRegion = "eu-west-1";
var IdentityPoolId = "eu-west-1:71d91a98-3817-4733-a443-1b15956aca97";
var userPoolId = "eu-west-1_J7hdueI51";
var IdKey = "cognito-idp.eu-west-1.amazonaws.com/" + userPoolId;
var retParams = window.location.href.split('#')[1];
var idTokenNameVal = retParams.split('&')[0];
var idToken = idTokenNameVal.split('=')[1];

AWS.config.update({
  region: dbRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
    Logins: {
        [IdKey] : idToken
    }
  })
});


var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

function metricGraph(){
    var params = {
        TableName: table,
        ProjectionExpression: "#index, payload",
        ExpressionAttributeNames: {'#index': 'datetime'}
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log("Error", err);
        } else {

            data.Items.sort(function(x, y){
                return new Date(x.datetime) - new Date(y.datetime);
            })

            var humidity = [];
            for (var i = 0; i < data.Items.length; i++) {
                humidity.push(data.Items[i].payload.humidity);
            }

            var temperature = [];
            for (var i = 0; i < data.Items.length; i++) {
                temperature.push(data.Items[i].payload.temp);
            }

            var time = [];
            for (var i = 0; i < data.Items.length; i++) {
                time.push(data.Items[i].payload.datetime);
            }
            
            var ctx = document.getElementById('temperature_graph');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                 labels: time,
                 datasets: [{
                 label: 'temperature (degC)',
                 data: temperature,
                 backgroundColor: [
                 'rgba(255, 99, 132, 0.2)'
                 ],
                 borderColor: [
                 'rgba(255, 99, 132, 0.2)'
                 ],
                 borderWidth: 1,
                 pointRadius:0,
                 lineTension:0
                }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: "time",
                distribution: "linear",
                time: {unit: "day"
            }
            }]
        }
    }
});
var ctx = document.getElementById('humidity_graph');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
     labels: time,
     datasets: [{
     label: 'humidity (%)',
     data: humidity,
     backgroundColor: [
        'rgba(54, 162, 235, 0.2)'
     ],
     borderColor: [
        'rgba(54, 162, 235, 0.2)'
     ],
     borderWidth: 1,
     pointRadius: 0,
     lineTension:0
    }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: "time",
                distribution: "linear",
                time: {unit: "day"
            }
            }]
        }
    }
});         
    }
  }
}

function gasGraph(){
    var params = {
        TableName: table_gas,
        ProjectionExpression: "#index, payload",
        ExpressionAttributeNames: {'#index': 'datetime'}
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log("Error", err);
        } else {

            data.Items.sort(function(x, y){
                return new Date(x.datetime) - new Date(y.datetime);
            })

            var gas = [];
            for (var i = 0; i < data.Items.length; i++) {
                gas.push(data.Items[i].payload.gas_m3);
            }

            var time = [];
            for (var i = 0; i < data.Items.length; i++) {
                time.push(data.Items[i].payload.datetime);
            }
            
            var ctx = document.getElementById('gas_graph');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                 labels: time,
                 datasets: [{
                 label: 'gas (m3)',
                 data: gas,
                 backgroundColor: [
                 'rgba(60, 179, 113, 0.2)'
                 ],
                 borderColor: [
                 'rgba(60, 179, 113, 0.2)'
                 ],
                 borderWidth: 1,
                 pointRadius:0,
                 lineTension:0
                }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }],
            xAxes: [{
                type: "time",
                distribution: "linear",
                time: {unit: "day"
            }
            }]
        }
    }
});
        }
    }};
    
