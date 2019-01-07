/**
 * Created by isaac on 16/8/23.
 */
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

export default function (patientID) {
  fs.readFile(path.join(__dirname, './laboratory.html'), (error, data) => {
    if (error) {
      console.log(error);
    } else {
      const $ = cheerio.load(data);
      const trs = $('tr');
      const length = trs.length;
      for (let idx = 1; idx < length; ++idx) {
        const row = trs[idx];
        const rowObjects = $(row).children();
        if (rowObjects.length > 2) {
          console.log(idx, row.length, rowObjects.length);
          for (let jdx = 0; jdx < rowObjects.length; ++jdx) {
            const td = rowObjects[jdx];
            console.log($(td).text());
          }
        }
      }
    }
  });
}
