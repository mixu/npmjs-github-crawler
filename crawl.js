var fs = require('fs'),
    client = require('mixu_minimal').Client;


function normalizeName(name) {
  // replace / with -
  return name.replace(/\//g, '-');
}

var moduleName = remaining.shift();
while(fs.existsSync('./cache/'+normalizeName(moduleName)+'.json')) {
  moduleName = remaining.shift();
}

/*


function fetchNext() {

  console.log('Fetch:', user.name);

  client
    .get('https://api.github.com/users/'+user.name)
    .data({
    client_id: '',
    client_secret: '',
    })
    .end(function(err, res) {
      var h = res.headers;
      if(res.headers['x-ratelimit-remaining']) {
        console.log('x-ratelimit-remaining', res.headers['x-ratelimit-remaining']);
      }
      (client.parse(function(err, res) {
        if (err) throw err;
        fs.writeFileSync('./cache/users/'+user.name+'/meta.json', JSON.stringify(res, null, 2));
        console.log(res);

        if(h['x-ratelimit-remaining'] > 0) {
          setTimeout(fetchNext, 1000);
        }
      }))(err, res);
    });

}
*/
