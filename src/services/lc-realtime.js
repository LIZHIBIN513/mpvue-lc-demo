import { Realtime } from 'leancloud-realtime';
import strftime from 'strftime';

function formatLastMessageAt(dt) {
  return strftime('%Y-%m-%d', dt);
}

function getPeerId(clientId, conv) {
  let peerId = null;
  console.log(clientId, conv.members);
  conv.members.forEach((id) => {
    if (id !== clientId) {
      peerId = id;
    }
  });
  return peerId;
}

class LCRTSession {
  constructor(client) {
    this.client = client;
  }

  queryConvs() {
    return this.client.getQuery().containsMembers([this.client.id]).find().then((convs) => {
      const _convs = convs.map((conv) => {
        const peerId = getPeerId(this.client.id, conv);
        return {
          id: conv.id,
          members: conv.members,
          system: conv.system,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv._lastMessageAt,
          lastMessageAtFormated: formatLastMessageAt(conv._lastMessageAt),
          peerId,
          peerAvatarUrl: '',
          peerNickname: '',
        };
      }); // map-convs
      return new Promise((resolve) => {
        resolve(_convs);
      });
    });
  } // ~ queryCovns
  getConv(convId) {
    return this.client.getConversation(convId);
  } // ~ getConv
}

class LCRTManager {
  constructor() {
    this.rt = null;
    this.session = null;
  }
  setup(opts) {
    this.rt = new Realtime(opts);
  }

  login(uid) {
    return this.rt.createIMClient(uid).then((client) => {
      this.session = new LCRTSession(client);
      return new Promise((resolve) => {
        resolve(this.session);
      });
    });
  } // ~ login
}

const manager = new LCRTManager();

export {
  manager,
  getPeerId,
};
