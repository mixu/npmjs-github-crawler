var db = require('nano')('http://10.1.10.42:5984/registry');

var remaining = [],
    current = 0;

// fetch package names from the local npm
function getPackageNames(skip, limit, callback) {
  if(arguments.length == 1) {
    limit = 50; // 50 items
  }
  db.list({ limit: limit, skip: skip }, function(err, body) {
    current += 100;
    if (!err) {
      body.rows.forEach(function(row) {
        remaining.push(row.key);
      });
      callback();
    }
  });
}

function skipUntilMissing(cb) {
  if(remaining.length == 0) {
    return getPackageNames(current, 100, function() {
      skipUntilMissing(cb);
    });
  }
  cb(remaining.shift());
}


function fetchNext() {
  // first, get the next name (or replenish the list of names if needed)
  skipUntilMissing(function(moduleName) {
    // get the document
    db.get(moduleName, function(err, doc) {
      if (err) throw err;
      if(doc.repository && doc.repository.type && doc.repository.type == 'git') {
        var output = { key: moduleName, type: doc.repository.type, url: doc.repository.url };
        console.log(JSON.stringify(output));
        fetchNext();
      } else {
        // retry
        fetchNext();
      }
    });
  });
}

// start
fetchNext();
