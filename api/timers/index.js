/**
 * Created by Grey on 16/7/19.
 */

export default function () {
  require('./backup')();
  require('./diaschedule')();
  require('./sync')();
  console.log('did load timers');
}
