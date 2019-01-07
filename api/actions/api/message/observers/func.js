/**
 * Created by isaac on 16/7/3.
 */
import mongoose from 'mongoose';
import {jwtDecode} from '../../../lib/auth';
const Message = mongoose.model('Message');

export function getUID(request) {
  let result = null;
  if (request) {
    const {user} = request.session;
    if (user) {
      result = user._id;
    } else {
      const token = request.headers["x-access-token"];
      result = jwtDecode(token).iss;
    }
  }
  return result;
}

export function addMessage(args, ctx) {
  console.log('createMessage', args);
  const message = new Message(args);
  message.has_read = false;
  message.save((error) => {
    if (error) {
      console.log(error);
    } else {
      const io = ctx && ctx.io;
      console.log('addMessage:', io, ctx);
      if (io) {
        io.emit('msg', {name: 'uhs.notify.message.new'});
      }
    }
  });
}
