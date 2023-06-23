const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');

let temperature = 20;  // initial temperature
const min = -40;
const max = 80;
let heating = false;
let cooling = false;

client.on('connect', function () {
    client.subscribe('ac-control');
    client.subscribe('heater-control');

    setInterval(function(){
        simulateSensor();
        client.publish('temperature', temperature.toString());
        console.log('📍 capteur température :', temperature);
    }, 5000);
});

client.on('message', function (topic, message) {
    switch (topic) {
        case 'ac-control':
            cooling = message.toString() === 'on';
            break;
        case 'heater-control':
            heating = message.toString() === 'on';
            break;
    }
});

function simulateSensor() {
    const change = (Math.random() * 2 - 1) * 2; 
    temperature += change;

    if (heating && temperature < 19) {
        temperature += 2;  
    } else if (cooling && temperature > 22) {
        temperature -= 2; 
    }

    if (temperature < min) {
        temperature = min;
    }
    else if (temperature > max) {
        temperature = max;
    }
}
