$(document).ready(function() {
    var map = L.map('map').setView([44.7723, -0.6432], 8);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    $('input[name="daterange"]').daterangepicker({
            locale: {
                format: 'YYYY-MM-DD'
            },
            startDate: '2017-04-06',
            endDate: moment().format('YYYY-MM-DD')
        },
        function(start, end, label) {
            setTimeout(refreshAll, 1);
        });


    $('input[name="date"]').daterangepicker({
            locale: {
                format: 'YYYY-MM-DD'
            },
            singleDatePicker: true,
            showDropdowns: true,
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD')
        },
        function(start, end, label) {
            setTimeout(refreshAll, 1);
        });

    var tileSize = L.point(256, 256);

    var round = function(val) {
        var n = 10000;
        return Math.round(val * n) / n
    }

    var getCoords = function() {
        var zoom = map.getZoom();
        var center = map.getCenter().wrap();
        $('#map-center').val(round(center.lng) + ', ' + round(center.lat));
        var pixelPoint = map.project(center, zoom).floor();
        var coords = pixelPoint.unscaleBy(tileSize).floor();

        return "/" + zoom + "/" + coords.x + "/" + coords.y;
    };

    var baseArr = $('#base-url').val().split('?', 2);
    var coordinates = getCoords();
    var op = $('.op-list.active').data('op');

    var markTile = function() {
        $('.leaflet-tile').each(function() {
            var src = $(this).attr('src');
            if (src.indexOf(coordinates) + 1) $(this).addClass('targeted');
            else $(this).removeClass('targeted');
        });
    }

    $('.tile-preview').error(function(e, b, c) {
        $(this).closest('a').removeClass('spinner');
        $(this).attr("src", "public/img/error.png");
    });

    $('.tile-preview').load(function() {
        $(this).closest('a').removeClass('spinner');
    });

    $("#date-flag").change(function() {
        if (this.checked) {
            $("#daterange-flag").prop('checked', false);
        }
    });

    $("#daterange-flag").change(function() {
        if (this.checked) {
            $("#date-flag").prop('checked', false);
        }
    });

    var refreshAll = function() {
        $('.tile-preview').each(function() {
            $(this).closest('a').addClass('spinner');
        });

        var host = baseArr[0].replace("/{z}/{x}/{y}", coordinates);
        var query = baseArr[1];
        var baseURL = host + '?op=' + op + (query ? '&' + query : '');

        var whereArr = [];

        if ($('#clouds-flag')[0].checked) {
            var clouds = $('#clouds').val();
            whereArr.push('clouds<' + clouds);
        }

        if ($('#date-flag')[0].checked) {
            var date = moment($('#date').val());
            whereArr.push('day:' + date.format('YYYY-MM-DD'));
        } else if ($('#daterange-flag')[0].checked) {
            var daterange = $('#daterange').val().split(' - ');
            var start = moment(daterange[0]);
            whereArr.push('day>' + start.format('YYYY-MM-DD'));
            var end = moment(daterange[1]);
            whereArr.push('day<' + end.format('YYYY-MM-DD'));
        }

        if (whereArr.length) {
            baseURL += '&where=' + whereArr.join(',');
        }

        $('.tile-preview').each(function() {
            var $img = $(this);
            var imgFrom = $img.data('from');
            var url = baseURL + '&from=' + imgFrom;
            $img.closest("a").attr('href', url);
            $img.attr('src', url);
        });
    };

    $('#go-button').click(function(e) {
        baseArr = $('#base-url').val().split('?', 2);
        setTimeout(refreshAll, 1);
    });

    $('#map-center-button').click(function(e) {
        var coords = $('#map-center').val().split(',', 2);
        map.setView(L.latLng(coords[1],coords[0]), map.getZoom());
        // setTimeout(refreshAll, 1);
    });

    $('.op-list').click(function(e) {
        $('.op-list').removeClass('active');
        op = $(this).data('op');
        $(this).addClass('active');
        setTimeout(refreshAll, 1);
    });

    $('#clouds').change(function() {
        $('#clouds-value').text($(this).val());
        setTimeout(refreshAll, 1);
    });

    $('.flag').change(function() {
        setTimeout(refreshAll, 1);
    });

    map.on('moveend', function(e) {
        var newCoordinates = getCoords();

        if (newCoordinates !== coordinates) {
            coordinates = newCoordinates;

            markTile();
            setTimeout(refreshAll, 1);
        }
    });

    markTile();
    setTimeout(refreshAll, 1);
});