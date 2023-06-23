<template>
  <div class="sensors">
    <h1>Capteurs :</h1>

    <form @submit.prevent="addSensor" class="form">
      <input v-model="newSensor.id" placeholder="ID" required>
      <input v-model="newSensor.name" placeholder="Name" required>
      <button type="submit">Ajouter un capteur</button>
    </form>

    <ul>
      <li v-for="sensor in sensors" :key="sensor.id">
        {{ sensor.name }}
        <button @click="removeSensor(sensor.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      sensors: [],
      newSensor: { id: '', name: '' },
    }
  },
  methods: {
    getSensors() {
      axios.get('http://localhost:3000/sensors')
        .then(response => {
          this.sensors = response.data;
        });
    },
    addSensor() {
      axios.post('http://localhost:3000/sensors', this.newSensor)
        .then(response => {
          this.sensors.push(response.data);
          this.newSensor = { id: '', name: '' };
        });
    },
    removeSensor(id) {
      axios.delete(`http://localhost:3000/sensors/${id}`)
        .then(response => {
          this.sensors = this.sensors.filter(sensor => sensor.id !== response.data.id);
        });
    }
  },
  created() {
    this.getSensors();
  }
}
</script>

<style>
.sensors {
  margin-top: 20px;
}

input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}

button {
  background: #5E5DF0;
  border-radius: 999px;
  box-shadow: #5E5DF0 0 10px 20px -10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
  margin: 5px;
}

ul {
  padding-top: 20px;
}

li {
  padding: 5px;
}

form {
  padding: 10px;
}
</style>
