var baseurl = $("head base").attr("href");

$.ajaxPrefilter(function( options) {
    options.url = baseurl + options.url;
});