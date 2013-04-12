var db = require('nano')('http://localhost:5984/registry');

function get(limit, skip) {
db.list({ limit: limit, skip: skip }, function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      console.log(doc);
    });
  }
});
}

get(10, 0);

setTimeout(function() { get(10, 10); }, 3000);
