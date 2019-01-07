/**
 * Created by Grey on 16/7/15.
 */
import dialysis from './dialysis';
import machine from './machine';

export default function () {
  dialysis()
    .then(machine);
}