$(document).ready(function() {
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
    // /8/127/92
    var map = L.map('map').setView([44.77, -0.6], 8);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var tileSize = L.point(256, 256);
    var refreshAll = function() {
        $('.tile-preview').each(function() {            
            $(this).closest('a').addClass('spinner');
        });

        var zoom = map.getZoom();
        var center = map.getCenter();
        var pixelPoint = map.project(center, zoom).floor();
        var coords = pixelPoint.unscaleBy(tileSize).floor();

        var baseArr = $('#base-url').val().split('?', 2);
        var op = $('.op-list.active').data('op');

        var host = baseArr[0].replace("/{z}/{x}/{y}", "/" + zoom + "/" + coords.x + "/" + coords.y);
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
        setTimeout(refreshAll, 1);
    });

    $('.op-list').click(function(e) {
        console.log(e);
        $('.op-list').removeClass('active');
        $(this).addClass('active');
        setTimeout(refreshAll, 1);
    });

    $('input[name="daterange"]').daterangepicker({
            locale: {
                format: 'YYYY-MM-DD'
            },
            startDate: '2017-01-01',
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

    $('#clouds').change(function() {
        $('#clouds-value').text($(this).val());
        setTimeout(refreshAll, 1);
    });

    $('.flag').change(function() {
        setTimeout(refreshAll, 1);
    });

    map.on('moveend', function(e) {
        setTimeout(refreshAll, 1);
    });
    setTimeout(refreshAll, 1);
});