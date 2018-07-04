<template>
  <div>
    <div class="conv" v-for="(conv,index) in convs" :key="index">
      <div class="avatar-wrapper">
        <img class="avatar" :src="conv.peerAvatarUrl">
      </div>
      <div class="nickname" @click="openConv(conv.id)">{{conv.peerNickname}}</div>
      <div class="last-message"></div>
      <div class="last-message-at">{{ conv.lastMessageAtFormated }}</div>
    </div>
  </div>
</template>

<script>
// import { Realtime } from 'leancloud-realtime';
import Vue from 'vue';
import { getUserIconCached } from '@/services/huafer-api';
import { manager } from '@/services/lc-realtime';
import { Event } from 'leancloud-realtime';

export default {
  data() {
    return {
      motto: 'Hello World',
      userInfo: {},
      convs: [],
    };
  },

  components: {},

  methods: {
    openConv(convId) {
      wx.navigateTo({
        url: `/pages/message/conv/main?convId=${convId}`,
      });
    },
  },

  created() {},
  mounted() {
    const clientId = '614602';
    manager.login(clientId).then((session) => {
      session.client.on(Event.MESSAGE, (message, conv) => {
        console.log('<bus> message received:', message, conv);
        Vue.prototype.$bus.$emit('LCRT_MESSAGE', message, conv);
      });
      session.queryConvs().then((convs) => {
        this.convs = convs;
        for (let i = 0; i <= this.convs.length; i += 1) {
          const conv = this.convs[i];
          console.log(conv);
          getUserIconCached(conv.peerId).then((rsp) => {
            if (rsp.status === 200 && rsp.data.code === 200) {
              // console.log(rsp.data.obj.userInfo);
              conv.peerAvatarUrl = rsp.data.obj.userInfo.userIcon;
              conv.peerNickname = rsp.data.obj.userInfo.userName;
            }
          });
        }
      });
    });
  },
};
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/index';
.conv
  position relative
  width: 100%
  height: rpx(170)
  border-bottom: 1px solid #e2e2e2
  margin: 0
  padding: 0
  clear both
.avatar
  width: rpx(110)
  height: rpx(110)
  border-radius: 50%
.avatar-wrapper
  float: left;
  margin: rpx(30) rpx(30) auto rpx(34)
.nickname
  float: left
  font-size: rpx(30)
  margin: rpx(40) rpx(0) rpx(0) rpx(0)
.last-message
  float: left
  font-size: rpx(28)
  background-color: rgba(0,0,0, 0.5)
.last-message-at
  position: absolute
  color: #888
  font-size: rpx(24)
  top: 50%
  right: rpx(24)

</style>
