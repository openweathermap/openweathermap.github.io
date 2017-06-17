$(document).ready(function() {
    $('img').error(function(e, b, c) {
        $(this).attr("src", "public/img/error.png");
    });

    $("#date-flag").change(function() {
		    if(this.checked) {
		        $("#daterange-flag").prop('checked', false);
		    }
		});

    $("#daterange-flag").change(function() {
		    if(this.checked) {
		        $("#date-flag").prop('checked', false);
		    }
		});

    var refreshAll = function() {
        var baseArr = $('#base-url').val().split('?', 2);
        var host = $('#base-url').val();

        var op = $('.op-list.active').data('op');

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

        var baseURL = baseArr[0] + '?op=' + op;
        if (baseArr[1]) {
            baseURL += '&' + baseArr[1];
        }

        if (whereArr.length) {
            baseURL += '&where=' + whereArr.join(',');
        }

        $('img').each(function() {
            var $img = $(this);
            var imgFrom = $img.data('from');

            var url = baseURL + '&from=' + imgFrom;
            $img.closest("a").attr('href', url);
            $img.attr('src', url);
        });
    };

    $('#go-button').click(function(e) {
        setTimeout(refreshAll,1);
    });

    $('.op-list').click(function(e) {
        console.log(e);
        $('.op-list').removeClass('active');
        $(this).addClass('active');
        setTimeout(refreshAll,1);
    });

    $('input[name="daterange"]').daterangepicker({
            locale: {
                format: 'YYYY-MM-DD'
            },
            startDate: '2017-01-01',
            endDate: '2017-06-06'
        },
        function(start, end, label) {
            setTimeout(refreshAll,1);
        });


    $('input[name="date"]').daterangepicker({
            locale: {
                format: 'YYYY-MM-DD'
            },
            singleDatePicker: true,
            showDropdowns: true,
            startDate: '2017-01-01',
            endDate: '2017-01-01'
        },
        function(start, end, label) {
            setTimeout(refreshAll,1);
        });

    $('#clouds').change(function(){
    	setTimeout(refreshAll,1);
    });
    setTimeout(refreshAll,1);
});