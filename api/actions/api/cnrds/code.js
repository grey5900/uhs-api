/**
 * Created by isaac on 16/8/8.
 */
import superagent from 'superagent';

export default function (req, params, ctx) {
  const {redisClient} = ctx;
  return new Promise((resolve, reject) => {
    superagent.get('http://hd.cnrds.net/hd/login.do')
      .end((error, response) => {
        // save code to redis
        const {user} = req.session;
        const id = `cnrds.${user._id}.key`;
        const cookie = response.headers['set-cookie'];
        console.log('14', error, id, cookie);
        redisClient.set(id, JSON.stringify(cookie));
        // get code image
        const request = superagent.get('http://hd.cnrds.net/hd/login.do?action=createrandimg');
        request.set('Cookie', cookie);
        request.end((error, response) => {
          resolve(response.body);
        });
      });
  });
}
