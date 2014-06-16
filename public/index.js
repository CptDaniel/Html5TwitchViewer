$(document).ready(function () {
    $.get('/api', function (data) {
        $('#loading').remove();

        var newdata = JSON.parse(data);
        $.each(newdata, function (i, e) {
            $('#container').append('<div class="col-md-15"><div class="thumbnail stream"><img width="100%" src="' + e[0].preview.medium + '" alt="..."><div class="overlay"><div class="caption text-center"><a href="' + e[1].replace(/"/g, '&#34') + '">' + e[0].channel.display_name + '</a>' +
                '<p class = "game-name">' + e[0].channel.game + '</p> <span>' + e[0].viewers + ' Viewer </span></div></div></div></div>');
        });

    }).done(function () {

        $('#container').append('<button id="load" type="button" class="btn btn-default center-block button-dark-l">Load More</button>');
        $("div.stream").on('click', function () {
            window.location = $(this).find("a").attr("href");
            return false;
        });

        $("#load").on('click', function () {
            loadMore();
        });
    });


    $('#searchform').submit(function (e) {

        search(e.target[1].value, e.target[0].value);
        e.preventDefault();
    });
});


function loadMore() {
    var offset = $('.stream').length;

    $.get('/api?offset=' + offset, function (data) {
        $('#loading').remove();

        var newdata = JSON.parse(data);
        $.each(newdata, function (i, e) {
            $('#load').before('<div class="col-md-15"><div class="thumbnail stream"><img width="100%" src="' + e[0].preview.medium + '" alt="..."><div class="overlay"><div class="caption text-center"><a href="' + e[1].replace(/"/g, '&#34') + '">' + e[0].channel.display_name + '</a>' +
                '<p class = "game-name">' + e[0].channel.game + '</p> <span>' + e[0].viewers + ' Viewer </span></div></div></div></div>');
        });

    }).done(function () {
        $("div.stream").on('click', function () {
            window.location = $(this).find("a").attr("href");
            return false;
        });

    });


}

function search(param, val) {
    if (param === 'Stream') {
        $.get('/api/search/stream?name=' + val, function (data) {

            $('#loading').remove();
            $('#container').empty();
            var newdata = JSON.parse(data);
            console.log(newdata);
                $('#container').append('<div class="col-md-15"><div class="thumbnail stream"><img width="100%" src="' + newdata[0].preview.medium + '" alt="..."><div class="overlay"><div class="caption text-center"><a href="' + newdata[1].replace(/"/g, '&#34') + '">' + newdata[0].channel.display_name + '</a>' +
                    '<p class = "game-name">' + newdata[0].channel.game + '</p> <span>' + newdata[0].viewers + ' Viewer </span></div></div></div></div>');

        }).done(function () {
            $("div.stream").on('click', function () {
                window.location = $(this).find("a").attr("href");
                return false;
            });

        });

    } else if (param === 'Game') {
        return false;
        console.log("GAMESEARCH");
        $.get('/api/search/game?name=' + val, function (data) {

            $('#loading').remove();
            $('#container').empty();
            var newdata = JSON.parse(data);
            console.log(newdata);
            $('#container').append('<div class="col-md-15"><div class="thumbnail stream"><img width="100%" src="' + newdata[0].preview.medium + '" alt="..."><div class="overlay"><div class="caption text-center"><a href="' + newdata[1].replace(/"/g, '&#34') + '">' + newdata[0].channel.display_name + '</a>' +
                '<p class = "game-name">' + newdata[0].channel.game + '</p> <span>' + newdata[0].viewers + ' Viewer </span></div></div></div></div>');

        }).done(function () {
            $("div.stream").on('click', function () {
                window.location = $(this).find("a").attr("href");
                return false;
            });

        });


    }


}

