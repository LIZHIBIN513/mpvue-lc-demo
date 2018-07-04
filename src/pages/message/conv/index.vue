<template>
  <div class="container">
    <div class="message-view">
      <div v-for="(message, index) in messages" :key="index">
        <div class="bubble">{{ message.text }}</div>
        <div>{{ dummy() }}</div>
      </div>
    </div>
    <div class="message-form">
      <input placeholder="text" v-model="message"/>
      <button @click="send">Send</button>
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
    dummy() {
      return 'Hello';
    },
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
      if (!this.message) {
        wx.showToast({ title: '不能发送空消息', icon: 'none' });
        return;
      }
      manager.session.getConv(this.convId).then((conv) => {
        const message = new TextMessage(this.message);
        console.log('message sending', this.message, message);
        return conv.send(message);
      }).then((message) => {
        console.log('message sent', message);
        this.messages.push(message);
      });
    }, // ~ send
  },
};
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/index';
.container
  margin: 0
  padding: 0
.message-view
  background-color: rgba(255,0,0,0.5)
  width: 100%
  height: 100%
  overflow-y: scroll
</style>
