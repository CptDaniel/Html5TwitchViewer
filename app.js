var express = require('express'),
    app = express(),
    https = require('https'),
    router = express.Router(),
    async = require('async');



router.get('/api', function(req, res) {
    async.waterfall([
            function(callback) {
                var arr = [];
                var resarr = '';
                https.get('https://api.twitch.tv/kraken/streams?game=League+of+Legends&limit=15', function(resp) {
                    resp.setEncoding('utf8')
                    resp.on('data', function(d) {
                        resarr += d;
                    });
                    resp.on('end', function() {
                        resarr = JSON.parse(resarr);
                        resarr.streams.forEach(function(e) {
                            arr.push(e);
                        });
                        callback(null, arr);
                    });
                });


            },
            function(names, done) {
                var arr = [];
                async.each(names, function(e, callback) {
                    var bla = '';
                    https.get('https://api.twitch.tv/api/channels/' + e.channel.name + '/access_token', function(resp) {
                        resp.setEncoding('utf8')
                        resp.on('data', function(d) {
                            bla += d;
                        });
                        resp.on('end', function() {
                            bla = JSON.parse(bla);
                            arr.push(bla);
                            callback(null);
                        });
                    });
                }, function(err) {
                    if (err) throw err;
                    done(null, arr);
                });
            }
        ],

        function(err, result) {
            console.log('LAST STEP');
            if (err) throw err;
            var link = {};
            result.forEach(function(e) {

                var name = JSON.parse(e.token);
                link[name.channel] = 'http://usher.justin.tv/api/channel/hls/' + name.channel + '.m3u8?token=' + e.token + '&sig=' + e.sig;
            });
            res.json(link);
        });

});


app.use(express.static(__dirname + "/public"));
app.use('/bower_components', express.static(__dirname + "/bower_components"));
app.use(router);
app.listen(5050);