/**
 * Created by isaac on 16/8/16.
 */
import {CronJob} from 'cron';
import path from 'path';
import ChildProcess from 'child_process';

function getShellPath() {
  const scriptsPath = path.join(__dirname, '../scripts/backup/');
  let shellName = null;
  if (process.platform !== 'win32') {
    shellName = 'backup_db.sh';
  } else {
    shellName = 'backup_db.bat';
  }
  const shellPath = path.join(scriptsPath, shellName);
  console.log(shellPath);
  return shellPath;
}

let backupJob = null;
export default function () {
  if (!backupJob) {
    backupJob = new CronJob({
      cronTime: '30 00 * * *',
      onTick: () => {
        ChildProcess.execFile(getShellPath(), null, null, (error, stdout, stderr) => {
          console.log(error, stdout, stderr);
        });
      },
      start: false,
      timeZone: 'Asia/Chongqing'
    });
    backupJob.start();
    console.log('start backup cron job');
  }
}
