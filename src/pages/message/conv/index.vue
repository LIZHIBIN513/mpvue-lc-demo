<template>
  <div>
    <ul>
      <li>convId: {{ conv.id }}</li>
      <li>peerId: {{ conv.peerId}}</li>
    </ul>
    <input placeholder="text" v-model="message"/>
    <button @click="send">Send</button>
    <div v-for="(message, index) in messages" :key="index">
      <span>*</span>
      <span>{{ message.text }}</span>
      <small>{{ message.timestamp }}</small>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { getUserIconCached } from '@/services/huafer-api';
import { manager, getPeerId } from '@/services/lc-realtime';
import { TextMessage } from 'leancloud-realtime';

export default {
  data() {
    return {
      convId: '',
      conv: {
        id: '',
        peerId: '',
        peerNickname: '',
        peerAvatarUrl: '',
      },
      message: '',
      messages: [],
    };
  },
  mounted() {
    this.convId = this.$root.$mp.query.convId;
    console.log(manager.session);
    Vue.prototype.$bus.$on('LCRT_MESSAGE', this.onMessageReceived);
    manager.session.getConv(this.convId).then((conv) => {
      this.conv.id = conv.id;
      this.conv.peerId = getPeerId(manager.session.client.id, conv);
      getUserIconCached(this.conv.peerId).then((rsp) => {
        this.conv.peerNickname = rsp.data.obj.userInfo.userName;
        this.conv.peerAvatarUrl = rsp.data.obj.userInfo.userIcon;
      });
      console.log('conv:', conv);
      conv.queryMessages().then((messages) => {
        console.log(messages);
        this.messages = messages;
      });
    });
  },
  beforeDestroy() {
    Vue.prototype.$bus.$off('LCRT_MESSAGE', this.onMessageReceived);
  },
  methods: {
    onMessageReceived(message, conv) {
      console.log('<conv>', message, conv);
      if (conv.id !== this.convId) {
        console.log(`not this conv, ${conv.id}, ${this.convId}`);
        return;
      }
      this.messages.push(message);
      console.log(this.messages);
    },
    send() {
      manager.session.getConv(this.convId).then((conv) => {
        console.log('message sending', this.message);
        return conv.send(new TextMessage(this.message));
      }).then((message) => {
        console.log('message sent', message);
      });
    }, // ~ send
  },
};
</script>
