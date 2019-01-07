/**
 * Created by isaac on 16/7/10.
 */

import oracledb from 'oracledb';
import config from './config';
import * as sync from './sync';
import saveOrder from './order';

export function unload(connection) {
  connection.close();
}

export function init(callback) {
  oracledb.getConnection(config, (err, connection) => {
    if (err) {
      console.error(err);
    } else {
      callback({sync, connection, unload, saveOrder});
    }
  });
}

export default {
  init,
  unload,
  sync,
  saveOrder
};
