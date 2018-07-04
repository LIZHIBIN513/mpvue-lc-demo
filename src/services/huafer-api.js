
import Vue from 'vue';

const settings = {
  baseUrl: 'http://localhost:8080/api',
};

function url(uri) {
  return settings.baseUrl + uri;
}

function getUserIcon(uid) {
  const params = {
    userId: uid,
  };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  return Vue.prototype.$http.post(url('/user/v1/getUserIcon'), params, config);
}

const _userIconCache = {};

function getUserIconCached(uid) {
  let ret = _userIconCache[uid];
  if (!ret) {
    _userIconCache[uid] = getUserIcon(uid);
    ret = _userIconCache[uid];
  }
  return ret;
}

export {
  url,
  getUserIconCached,
};
