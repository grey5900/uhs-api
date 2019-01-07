/**
 * Created by isaac on 16/7/10.
 */
export default function (connection) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_user_all ",
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
