/**
 * Created by isaac on 16/8/8.
 */
import cheerio from 'cheerio';
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
        const request = superagent.post(kHost + 'login.do?action=login');
        request.set('Cookie', cookie);
        request.set('user-agent', kUserAgent);
        request.type('form');
        request.send(req.body);
        request.end((error, response) => {
          const {text} = response;
          console.log('text', text);
          if (error || text.indexOf('ERROR CODE') !== -1 || text.indexOf('踢出该用户') !== -1) {
            reject({msg: '登录失败!'});
          } else {
            superagent.get(kHost + 'user.do?action=adduserform&op=self')
                      .set('Cookie', cookie)
                      .set('user-agent', kUserAgent)
                      .end((err, response) => {
                        const $ = cheerio.load(response.text);
                        const inputs = $('input');
                        console.log('inputs', inputs[4]);
                        const doctorName = inputs[4].attribs.value;
                        resolve({
                          code: code.success,
                          data: doctorName
                        });
                      });
          }
        });
      } else {
        reject({msg: 'Fail to get code'});
      }
    });
  });
}
