$(document).ready(function() {
    var map = L.map('map').setView([44.7723, -0.6432], 8);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    var url = $('#base-url').val();
    var layer = L.tileLayer(url, {
        attribution: '&copy; <a href="http://owm.io">VANE</a>'
    });

    layer.addTo(map);

    var refresh = function() {
        url = $('#base-url').val();
        layer.setUrl(url);
    };

    $('#go-button').click(function(e) {
        refresh();
    });

    $('#base-url').keypress(function(e) {
        if (e.which == 13) {
            refresh();
        }
    })
});