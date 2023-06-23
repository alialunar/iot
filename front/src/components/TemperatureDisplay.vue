<template>
  <div class="block">
    <h2>Capteur {{ sensorId }}</h2>
    <h3>{{ temperature }}°C</h3>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['sensorId'],
  data() {
    return {
      temperature: 0,
    }
  },
  methods: {
    getTemperature() {
      axios.get(`http://localhost:3000/temperature/${this.sensorId}`)
        .then(response => {
          this.temperature = response.data.temperature;
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

<style>
.block {
  background-color:rgb(249, 248, 247, 0.1);
  display: flex;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;
}
</style>
