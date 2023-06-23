<template>
  <div id="app">
    <h1>Dashboard :</h1>
    <br>
    <h3>Température salle 1</h3>
    <h3>{{ temperature }}°C</h3>
    <h3>Action: {{ action }}</h3>
    <h3>Temperature (exterieur) : {{ ambientTemperature }}°C</h3>
    <sensors></sensors>
  </div>
</template>

<script>
import axios from 'axios';
import Sensors from './components/Sensors.vue';

export default {
  components: {
    Sensors,
  },
  data() {
    return {
      temperature: 0,
      action: '',
      ambientTemperature: 0,
    }
  },
  methods: {
    getTemperature() {
      axios.get('http://localhost:3000/temperature')
        .then(response => {
          this.temperature = response.data.temperature;
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            axios.get(`http://localhost:3000/action?lat=${lat}&lon=${lon}`)
              .then(response => {
                this.action = response.data.action;
                this.ambientTemperature = response.data.ambientTemperature;
              });
          });
        });
    }
  },
  created() {
    this.getTemperature();
    this.interval = setInterval(() => this.getTemperature(), 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
}
</script>
