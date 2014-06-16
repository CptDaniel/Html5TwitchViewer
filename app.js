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
                if (req.query.offset) {
                    var offset = req.query.offset;
                } else {
                    var offset = 0;
                }

                https.get('https://api.twitch.tv/kraken/streams?limit=20&offset='+offset, function(resp) {
                    resp.setEncoding('utf8');
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
                async.each(names, function(e, callback) {
                    var bla = '';
                    https.get('https://api.twitch.tv/api/channels/' + e.channel.name + '/access_token', function(resp) {
                        resp.setEncoding('utf8')
                        resp.on('data', function(d) {
                            bla += d;
                        });
                        resp.on('end', function() {
                            bla = JSON.parse(bla);
                            bla = 'http://usher.justin.tv/api/channel/hls/' + e.channel.name + '.m3u8?token=' + bla.token + '&sig=' + bla.sig;
                            names[names.indexOf(e)] = [e, bla];
                            callback(null);
                        });
                    });
                }, function(err) {
                    if (err) throw err;
                    done(null, names);
                });
            }
        ],

        function(err, result) {
            if (err) throw err;
            // var link = {};
            // result.forEach(function(e) {//     var name = JSON.parse(e[1].token);
            //     link[name.channel] = 'http://usher.justin.tv/api/channel/hls/' + name.channel + '.m3u8?token=' + e.token + '&sig=' + e.sig;
            // });
            var sendarr = JSON.stringify(result);
            res.json(sendarr);
        });

});


router.get('/api/search/:query', function(req, res) {
    var search = req.params.query;
    var stream = req.query.name;
    if(search === "stream") {

        async.waterfall([
                function(callback) {
                    var arr = [];
                    var resarr = '';
                    https.get('https://api.twitch.tv/kraken/streams/'+stream, function(resp) {
                        resp.setEncoding('utf8')
                        resp.on('data', function(d) {
                            resarr += d;
                        });
                        resp.on('end', function() {
                            resarr = JSON.parse(resarr);
                            callback(null, resarr.stream);
                        });
                    });


                },
                function(names, done) {
                    var bla = '';
                    https.get('https://api.twitch.tv/api/channels/' + names.channel.name + '/access_token', function(resp) {
                        resp.setEncoding('utf8')
                        resp.on('data', function (d) {
                            bla += d;
                        });
                        resp.on('end', function () {
                            bla = JSON.parse(bla);
                            bla = 'http://usher.justin.tv/api/channel/hls/' +names.channel.name + '.m3u8?token=' + bla.token + '&sig=' + bla.sig;
                            names = [names, bla];
                            done(null, names);
                        });
                    });
                }
            ],

            function(err, result) {
                if (err) throw err;
                // var link = {};
                // result.forEach(function(e) {//     var name = JSON.parse(e[1].token);
                //     link[name.channel] = 'http://usher.justin.tv/api/channel/hls/' + name.channel + '.m3u8?token=' + e.token + '&sig=' + e.sig;
                // });
                console.log(result);
                var sendarr = JSON.stringify(result);
                res.json(sendarr);
            });

    } else if (search === 'game'){

        async.waterfall([
                function(callback) {
                    var arr = [];
                    var resarr = '';
                    if (req.query.offset) {
                        var offset = req.query.offset;
                    } else {
                        var offset = 0;
                    }

                    https.get('https://api.twitch.tv/kraken/search/streams?q='+stream+"limit=20", function(resp) {
                        resp.setEncoding('utf8');
                        resp.on('data', function(d) {
                            resarr += d;
                        });
                        resp.on('end', function() {
                            console.log("gamesearch called");
                            resarr = JSON.parse(resarr);
                            console.log(resarr);
                            resarr.games.forEach(function(e) {
                                arr.push(e);
                            });
                            callback(null, arr);
                        });
                    });

                },
                function(names, done) {
                    async.each(names, function(e, callback) {
                        var bla = '';
                        https.get('https://api.twitch.tv/api/channels/' + e.channel.name + '/access_token', function(resp) {
                            resp.setEncoding('utf8')
                            resp.on('data', function(d) {
                                bla += d;
                            });
                            resp.on('end', function() {
                                bla = JSON.parse(bla);
                                bla = 'http://usher.justin.tv/api/channel/hls/' + e.channel.name + '.m3u8?token=' + bla.token + '&sig=' + bla.sig;
                                names[names.indexOf(e)] = [e, bla];
                                callback(null);
                            });
                        });
                    }, function(err) {
                        if (err) throw err;
                        done(null, names);
                    });
                }
            ],

            function(err, result) {
                if (err) throw err;
                // var link = {};
                // result.forEach(function(e) {//     var name = JSON.parse(e[1].token);
                //     link[name.channel] = 'http://usher.justin.tv/api/channel/hls/' + name.channel + '.m3u8?token=' + e.token + '&sig=' + e.sig;
                // });
                var sendarr = JSON.stringify(result);
                res.json(sendarr);
            });



    }

});

app.use(express.static(__dirname + "/public"));
app.use('/bower_components', express.static(__dirname + "/bower_components"));
app.use(router);
app.listen(5050);