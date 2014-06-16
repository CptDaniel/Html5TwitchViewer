$(document).ready(function() {
    $.get('/api', function(data) {
        $('#loading').remove();

        var newdata = JSON.parse(data);
        $.each(newdata, function(i, e) {
            $('#container').append('<div class="col-md-15"><div class="thumbnail stream"><img width="100%" src="' + e[0].preview.medium + '" alt="..."><div class="overlay"><div class="caption text-center"><a href="' + e[1].replace(/"/g, '&#34') + '">' + e[0].channel.display_name + '</a>' +
                '<p class = "game-name">' + e[0].channel.game + '</p> <span>' + e[0].viewers + ' Viewer </span></div></div></div></div>');
        });

    }).done(function() {
        $('#container').append('<button id="load" type="button" class="btn btn-default center-block button-dark-l">Dropup</button>')
        $("div.stream").on('click', function() {
            window.location = $(this).find("a").attr("href");
            return false;
        });

    });


});


function loadMore() {
    var offset = $('.stream').length;
    $('#load').prepend('<div id="loading"><span>Loading</span><span class="l-1"></span><span class="l-2"></span><span class="l-3"></span><span class="l-4"></span><span class="l-5"></span><span class="l-6"></span></div>');


    $.get('/api/', function(data) {
        $('#loading').remove();

        var newdata = JSON.parse(data);
        $.each(newdata, function(i, e) {
            $('#container').append('<div class="col-md-15"><div class="thumbnail stream"><img width="100%" src="' + e[0].preview.medium + '" alt="..."><div class="overlay"><div class="caption text-center"><a href="' + e[1].replace(/"/g, '&#34') + '">' + e[0].channel.display_name + '</a>' +
                '<p class = "game-name">' + e[0].channel.game + '</p> <span>' + e[0].viewers + ' Viewer </span></div></div></div></div>');
        });

    }).done(function() {
        $('#container').append('<button id="load" type="button" class="btn btn-default center-block button-dark-l">Dropup</button>')
        $("div.stream").on('click', function() {
            window.location = $(this).find("a").attr("href");
            return false;
        });

    });


}