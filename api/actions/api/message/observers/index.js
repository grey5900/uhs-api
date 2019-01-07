/**
 * Created by isaac on 16/5/21.
 */
import processors from './processors';
import './sheet';
import './dialysis';
import './patient';
import './schedule';

export function judge(name, request, context) {
  var processor = processors[name];
  if (processor) {
    processor(request, context);
  }
}
