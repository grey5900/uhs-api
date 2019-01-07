/**
 * Created by Grey on 16/5/17.
 */

import '../../models/Patient';
import mongoose from 'mongoose';
import elasticsearch from 'elasticsearch';
const Position = mongoose.model('Position');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

router.get('/:searchString', function(req, res){
  client.search({
    q: req.params.searchString
  }).then(
      function(resp){
        res.send(resp.hits.hits);
        return;
      },
      function(err){
        res.send(err);
        return;
      }
    );
});

module.exports = router;