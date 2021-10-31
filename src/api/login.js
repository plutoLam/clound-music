import { request } from '@/utils'

// export const getLoginData = (phone, password) => request.get('/login/cellphone')
export function getLoginData(phone, password) {
  return request({
    url:'login/cellphone',
    params:{
      phone,
      password
    }
  });
}
let timestamp = new Date().getTime();
export function getUserDetailData(uid) {
  return request({
    url:'user/detail',
    params:{
      uid,
      timestamp
    }
  });
}

export function getQrKey() {
  return request({
    url:'login/qr/key',
    params:{
      timestamp
    }
  });
}

export function getQrImg(key) {
  return request({
    url:'login/qr/create',
    params:{
      key,
      qrimg:true,
      timestamp
    }
  });
}

export function getQrCheck(key) {
  return request({
    url:'login/qr/check',
    params:{
      key
    }
  });
}

