$(document).ready(function() {
    $("#hug").on("click", function(e) {
        getLocation();
    });

    $("#matchModal").modal();

    $("#accept").on("click", function(e) {
        $.ajax({
            url: "/hug/accept",
            type: "POST",
            success: function(response) {
                location.reload();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(jqXHR.responseText);
            }
        });
    });

    $("#cancel").on("click", function(e) {
        $.ajax({
            url: "/hug/cancel",
            type: "POST",
            success: function(response) {
                location.reload();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(jqXHR.responseText);
            }
        })
    });

    $("#cancelMatch").on("click", function(e) {
        $.ajax({
            url: "/hug/cancelmatch",
            type: "POST",
            success: function(response) {
                location.reload();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(jqXHR.responseText);
            }
        })
    });

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                $.ajax({
                    url: "/hug",
                    type: "POST",
                    data: {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                    },
                    success: function(response) {
                        location.reload();
                    },
                    error: function(jqXHR, textStatus, err) {
                        console.log(jqXHR.responseText);
                    }
                });
            });
        } else {
            $("#location").html("Geolocation is not supported by this browser.");
        }
    }

    $("#logout").on("click", function(e){ 
        $.ajax({
          url: '/logout',
          type: 'POST',
          success: function(){
              window.location.href = '/';
            }
        });
    });
});