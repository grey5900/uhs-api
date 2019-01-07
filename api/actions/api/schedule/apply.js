import config from '../../config';
import moment from 'moment';
import {addMessage} from '../message/observers/func';
import {roleAuthPromise} from '../../lib/auth';
export default function (req) {

  return roleAuthPromise(req, 'create', 'Message', (resolve, reject) => {
    const {date, comment, receiver} = req.body;
        const user = req.session.user;
        console.log(user);
        const timeString = moment(date).format('MM月DD日');
        addMessage({
            title: `${user.name}因${comment}申请在${timeString}调班`,
            level: 3,
            receiver,
            creator: user.id
        }, {});
        resolve({
            code: config.code.success
        });
    });
}
