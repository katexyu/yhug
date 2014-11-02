var run = function(status) {

    var checkUpdates = function() {
        setTimeout(function() {
            $.ajax({
                url: "/hug/match",
                type: "GET",
                success: function(response) {
                    if (status !== response.status) {
                        location.reload();
                    }
                },
                error: function(jqXHR, textStatus, err) {
                    console.log(jqXHR.responseText);
                }
            });
            checkUpdates();
        }, 2000);
    };

    checkUpdates();

    $("#hug").on("click", function(e) {
        getLocation();
    });

    $(".modal").modal({
        keyboard: false,
        backdrop: "static"
    });

    $("#accept").on("click", function(e) {
        if(!(/\S/.test($("#location").val()))){
            $('.error').text('Please enter a valid location!');
                return;
        }
        if(!(/\S/.test($("#phoneNumber").val()))){
            $('.error').text('Please enter a valid phone number!');
                return;
        } else{
            $.ajax({
                url: "/hug/accept",
                type: "POST",
                data: {
                    phoneNumber: $("#phoneNumber").val(),
                    location: $("#location").val(),
                },
                success: function(response) {
                    location.reload();
                },
                error: function(jqXHR, textStatus, err) {
                    console.log(jqXHR.responseText);
                }
            });
        }
    });


    $("#cancel").on("click", function(e) {
        $.ajax({
            url: "/hug/cancel",
            type: "POST",
            data: {
                type: "request"
            },
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
            url: "/hug/cancel",
            type: "POST",
            data: {
                type: "match"
            },
            success: function(response) {
                location.reload();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(jqXHR.responseText);
            }
        })
    });

    $("#closeRejected").on("click", function(e) {
        $.ajax({
            url: "/hug/status",
            type: "PUT",
            data: {
                status: "WANTS_HUG"
            },
            success: function(response) {
                location.reload();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(jqXHR.responseText);
            }
        });
    });

    $("#closeMeetup").on("click", function(e) {
        $.ajax({
            url: "/hug/status",
            type: "PUT",
            data: {
                status: "DEFAULT"
            },
            success: function(response) {
                location.reload();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(jqXHR.responseText);
            }
        });
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
}