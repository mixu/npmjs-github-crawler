var fs = require('fs'),
    client = require('mixu_minimal').Client;

var repos = fs.readFileSync('./list.json')
              .toString()
              .split('\n')
              .map(function(line) {
                var result;
                try {
                  result = JSON.parse(line);
                } catch(e) {}
                return result;
              }).filter(function(item) {
                return !!item;
              });

// console.log(repos.length, repos[repos.length - 1]);

function normalizeName(name) {
  // replace / with -
  return name.replace(/\//g, '-');
}

var ghRe  = /^(?:https?:\/\/|git(?::\/\/|@))github.com[:\/](.*?)(?:.git)?$/;

function fetchNext() {
  var mod = repos.shift();
  if(!mod) return;
  while(!mod.key ||
        !mod.url ||
        fs.existsSync('./cache/'+normalizeName(mod.key)+'.json') ||
        !(parts = mod.url.match(ghRe))) {
    mod = repos.shift();
    if(!mod) return;
  }

  var ghUrl = parts[1];

  console.log('Fetch:', ghUrl);


  client
    .get('https://api.github.com/repos/'+ghUrl)
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
        fs.writeFileSync('./cache/'+normalizeName(mod.key)+'.json', JSON.stringify(res, null, 2));
        console.log(res);

        if(h['x-ratelimit-remaining'] > 0) {
          setTimeout(fetchNext, 1000);
        }
      }))(err, res);
    });

}

fetchNext();
