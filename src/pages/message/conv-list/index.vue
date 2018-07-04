<template>
  <div class="container">
    <div v-for="(conv,index) in convs" :key="index">
      <div><img class="userinfo-avatar" :src="conv.peerAvatarUrl"></div>
      <div @click="openConv(conv.id)">{{conv.peerNickname}}</div>
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
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
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

<style scoped>
.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}
</style>
