$(document).ready(function() {
    $.get('/api', function(data) {

        $.each(data, function(key, value) {
            console.log(value);

            $('body').append('<div><a href="' + value.replace(/"/g, '&#34') + '">' + key + '</a></div>');
        });

    });

});