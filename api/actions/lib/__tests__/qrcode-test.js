
import {encode, decode} from '../qrcode';
const result = encode('uhs://', 'patient?id=56d071b6d97bcd188e2be37a');
console.log(result);

decode(result, (real) => {
  console.log('decoded: ', real);
}, (error) => {
  console.log(error);
});
