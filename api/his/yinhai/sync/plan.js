/**
 * Created by isaac on 16/7/10.
 */
export function allTreatPlan(connection) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_plan ",
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

export default function (connection, jzh) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_plan " +
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

export function searchPlan(connection, jzh, name) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "SELECT * " +
      "FROM flhis.vomk_mt_plan " +
      "WHERE jzh = :jzh AND yyxmmc LIKE %:name%",
      [jzh, name],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
}
