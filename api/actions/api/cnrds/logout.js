/**
 * Created by isaac on 16/8/9.
 */
import superagent from 'superagent';
import {kHost, kUserAgent, code} from '../../config';

export default function (req, params, ctx) {
  const {redisClient} = ctx;
  return new Promise((resolve, reject) => {
    const {user} = req.session;
    const id = `cnrds.${user._id}.key`;
    redisClient.get(id, (error, reply) => {
      if (reply) {
        const cookie = JSON.parse(reply);
        const request = superagent.post(kHost + 'login.do?action=logout');
        request.set('Cookie', cookie);
        request.set('user-agent', kUserAgent);
        request.end((error, response) => {
          if (error) {
            reject({msg: '退出失败'});
          } else {
            resolve({
              code: code.success,
              msg: '退出成功'
            });
            redisClient.del(id);
          }
        });
      } else {
        reject({msg: '未登录'});
      }
    });
  });
}
