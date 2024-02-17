<script setup>
import { io } from 'socket.io-client';
import {onBeforeMount ,ref } from 'vue';

const socket = io('http://localhost:3001');
const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisplay = ref('');

onBeforeMount(() => {
  socket.emit('findAllMessages',{}, (response) => {
    messages.value = response;
  });
});

socket.on('message', (message) => {
  messages.value.push(message);
});

let timeout;
const emitTyping = () => {
  socket.emit('typing', {isTyping:true});
  timeout = setTimeout(() => {
    socket.emit('typing', {isTyping:false});
  }, 2000);
}

const join = () => {
  socket.emit('join', {name: name.value}, (names) => {
    joined.value = true;
  });
}

const sendMessage = () => {
  socket.emit('createMessage', {text: messageText.value}, (response) => {
    messageText.value = '';
  });
}

socket.on('typing', (data) => {
  if(data.isTyping) {
    typingDisplay.value = data.name + 'is typing...';
  } else {
    typingDisplay.value = '';
  }
});

</script>

<template>
  <div class="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
      <label>What's your name?</label>
      <input v-model="name" />
      <button type="submit">Send</button>
      </form>
    </div>
    <div class="chat-container">
      <div class="message-container">
        <div v-for="message in messages">
            [{{message.name}}]: {{message.text}}
        </div>
      </div>

      <div v-if="typingDisplay">
        {{typingDisplay}}
      </div>

      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input v-model="messageText" @input="emitTyping" />
          <button type="submit">Send</button>
        </form>

      </div>
    </div>
  </div>
  
</template>

<style scoped>
@import './assets/base.css';
.chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}
</style>
