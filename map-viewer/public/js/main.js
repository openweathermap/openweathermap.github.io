$(document).ready(function() {
    var map = L.map('map', {
        center: [44.7723, -0.6432],
        zoom: 8,
        maxZoom: 33
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var url = prepareUrl();

    var layer = L.tileLayer(url, {
        attribution: '&copy; <a href="http://owm.io">VANE</a>',
        maxZoom: 33
    });

    layer.addTo(map);

    var refresh = function() {
        var url = prepareUrl();
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

    map.on('click', function(e) {
        var latlng = e.latlng.wrap();
        var zxy = getCoords(this, latlng);
        $('#info p').text('lat: ' + latlng.lat + ' || lon: ' + latlng.lng + ' || zxy: ' + zxy);
    });
});

function prepareUrl() {
    var baseArr = $('#base-url').val().split('?', 2);
    var url = baseArr[0] + '?';

    if (baseArr[0].indexOf('sat.owm.io') + 1) {
        url += 'appid=9de243494c0b295cca9337e1e96b00e2&';
    }

    url += baseArr[1];

    return url;
};

function getCoords(map, ll) {
    var tileSize = L.point(256, 256);

    var zoom = map.getZoom();
    var pixelPoint = map.project(ll, zoom).floor();
    var coords = pixelPoint.unscaleBy(tileSize).floor();

    return "/" + zoom + "/" + coords.x + "/" + coords.y;
};