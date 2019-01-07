/**
 * Created by Grey on 15/10/29.
 */
import url from 'url';
import moment from 'moment';
import jwt from 'jwt-simple';
import mongoose from 'mongoose';
import {getUID} from './util';
const token_secret = 'omk-136f7caa-3067-43ad-9861-a09e37caa6af-veritas';
const pathWhiteList = ['/login', '/logout'];

export const kExpirePeriod = 30 * 60 * 1000; // half an hour

var jwtEncode = function (data) {
  return jwt.encode(data, token_secret);
};

export function jwtDecode(data) {
  return jwt.decode(data, token_secret);
}

export function roleAuth(req, action, resource, next) {
  const Role = mongoose.model('Role');

  return (resolve, reject) => {
    const {user, exp} = req.session;
    const parsed_url = url.parse(req.url, true);
    if (pathWhiteList.indexOf(parsed_url.path) !== -1) {
      next(resolve, reject);
    } else if (user) {
      const now = Date.now();
      console.log('will check', exp, now);
      if (exp < now) {
        reject({msg: '会话已过期!', redirect: '/login', status: 410});
      } else {
        req.session.exp = now + kExpirePeriod; // add half an hour
        console.log('will update', req.session.exp, now);
        if (action && resource) {
          Role.findOne({role: user.role})
            .exec((error, role) => {
              if (error) {
                console.log(error);
                reject({msg: error.message});
              } else if (role) {
                const {permissions} = role;
                const obj = permissions.find(looper => looper.model === resource);
                if (obj && obj.allow.indexOf(action) !== -1) {
                  // allow
                  next(resolve, reject);
                } else {
                  reject({msg: '无该权限！'});
                }
              } else {
                reject({msg: '无法识别的角色！'});
              }
            });
        } else {
          //ignore rbac check
          next(resolve, reject);
        }
      }
    } else {
      reject({msg: '请登陆!', redirect: '/login', status: 301});
    }
  }
}

export function roleAuthPromise(req, action, resource, next) {
  return new Promise(roleAuth(req, action, resource, next));
}

var addRoleFilter = function (req, args, field) {
  const user = req.session.user;
  if (user) {
    if (user.role === 'director') {
      if (!field) {
        field = 'hospital';
      }
      args[field] = user.hospital;
    }
  }
};

export function genToken(userID, ext) {

  const expires = moment().add(4, 'hours').valueOf();
  return jwtEncode({
    iss: userID,
    exp: expires,
    ext: ext
  });
}

export function getIP(req) {
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  return ip;
}

export default {
  genToken,
  getIP,
  addRoleFilter
};
