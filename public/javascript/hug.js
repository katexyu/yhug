$(document).ready(function() {
    $("#hug").on("click", function(e) {
        getLocation();
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
                        $("#response").html(response);
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
});