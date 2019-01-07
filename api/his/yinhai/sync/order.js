/**
 * Created by isaac on 16/7/13.
 */
export default function (connection, sync_time) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_mzyz " +
      "WHERE kssj > :kssj",
      [sync_time],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
}
