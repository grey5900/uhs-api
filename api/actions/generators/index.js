/**
 * Created by isaac on 16/2/26.
 */

import config from '../../config';
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;

export default function () {
  // require('./admin')(targetUrl);
  // require('./hospital')(targetUrl);
  // require('./machine')(targetUrl);
  // require('./sheet')(targetUrl);
  // require('./sheet/dummy')(targetUrl);
  // require('./diagnosis/type')(targetUrl);
  // require('./physicalexam')(targetUrl);
  // require('./doctor')(targetUrl);
  // require('./drug/cy/type')(targetUrl);
  // require('./meta')(targetUrl);
  require('./role')(targetUrl);
  // require('./diseasetype')(targetUrl);
  // require('./drug/erythropoietin')(targetUrl);
}
