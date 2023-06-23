const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const client  = mqtt.connect('mqtt://localhost:1883');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let temperature = 20;
let sensors = [];

client.on('connect', function () {
    client.subscribe('temperature');
});

client.on('message', function (topic, message) {
    temperature = parseFloat(message).toFixed(2);
    console.log('📍 Temperature receptionné :', temperature, 'C');
});

app.get('/temperature', (req, res) => {
    res.json({ temperature });
});

app.get('/action', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const apiKey = '53734a53c6b38b9de7eab762216bdaeb';

    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const ambientTemperature = response.data.main.temp;

        const date = new Date();
        const month = date.getMonth();

        const isSpringOrSummer = month >= 3 && month <= 8;
        const isWinter = month <= 2 || month == 11;

        let action = 'N/A';

        if (isSpringOrSummer) {
            if (temperature > 22) {
                action = 'Climatisation : ON';
            } else if (temperature < 19) {
                action = 'Climatisation : OFF';
            }
        } else if (isWinter) {
            if (temperature > 22) {
                action = 'Chauffage : OFF';
            } else if (temperature < 19) {
                action = 'Chauffage : ON';
            }
        }

        res.json({ action, measuredTemperature: temperature, ambientTemperature });
    } catch (error) {
        res.json({ error: error.toString() });
    }
});

app.get('/sensors', (req, res) => {
    res.json(sensors);
});

app.post('/sensors', (req, res) => {
    sensors.push(req.body);
    res.json(req.body);
});

app.put('/sensors/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sensor = sensors.find(s => s.id === id);

    if (sensor) {
        Object.assign(sensor, req.body);
        res.json(sensor);
    } else {
        res.status(404).json({ error: '😢 Capteur non trouvé' });
    }
});

app.delete('/sensors/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sensors = sensors.filter(s => s.id !== id);

    res.json({ id });
});

app.listen(3000, () => {
    console.log('👋 App listening on port 3000');
});
