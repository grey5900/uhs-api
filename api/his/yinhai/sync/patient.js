/**
 * Created by isaac on 16/7/10.
 */
export default function (connection, jzh) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_pat " +
      "WHERE jzh = :jzh",
      [jzh],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
}

export function allPatient(connection) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_pat ",
      [],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
}
