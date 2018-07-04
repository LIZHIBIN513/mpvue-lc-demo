<template>
  <div class="container">
    <scroll-view scroll-y="true" class="message-view" :scroll-into-view="scrollBottomView">
      <div v-for="(message, index) in messages" :key="index">
        <div class="bubble">{{ message.text }}</div>
        <div>{{ dummy() }}</div>
      </div>
      <div id="scrollBottom" class="scrollBottomEle"></div>
    </scroll-view>
    <div class="message-form">
      <input class="message-input" placeholder="text" v-model="message"/>
      <button class="send-btn" @click="send">Send</button>
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
        scrollBottomView: 'scrollBottom',
        toDiv: '',
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
    background #f7f9fb
  .message-view
    width: 100%
    height 90%
  .message-form
    background #fff
    width 100%
    height rpx(110)
    line-height rpx(110)
    box-shadow rpx(0) rpx(-2) rpx(20) #ccc
    position fixed
    bottom 0
    left 0
    display flex
    align-items center
    .message-input
      flex 1
      height rpx(88)
      border rpx(1) solid #ccc
      margin-left rpx(30)
      border-radius rpx(10)
      padding 0 rpx(15) 0 rpx(15)
      font-size rpx(32)
    .send-btn
      font-size rpx(30)
      height rpx(88)
      line-height rpx(88)
      width rpx(140)
      margin 0 rpx(32) 0 rpx(20)
  .scrollBottomEle
    height rpx(10)
  .fix-iphonex
    bottom 100rpx!important;
</style>
