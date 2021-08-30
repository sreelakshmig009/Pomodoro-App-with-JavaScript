
var ding = new Audio("audio/ding.mp3"),
    pomodoro = {
        isBreak: false,
        isPaused: false,
        timeRemaining: 0,
        startTime: 0,
        stopTime: 0,
        action1: "start",
        sessionLength: {
            value: 25,
            increase: function() {
                this.value++;
                $("#session-length").text(this.value);
                $("#counter").text(this.value.toString() + ":00");
            },
            decrease: function() {
                if (this.value > 1) {
                    this.value--;
                    $("#session-length").text(this.value);
                    $("#counter").text(this.value.toString() + ":00");
                }
            }
        },
        breakLength: {
            value: 5,
            increase: function() {
                this.value++;
                $("#break-length").text(this.value);
            },
            decrease: function() {
                if (this.value > 1) {
                    this.value--;
                    $("#break-length").text(this.value);
                }
            }
        },
        reset: function(softReset) {
    
            if (!softReset) {
               
                this.sessionLength.value = 25;
                this.breakLength.value = 5;
                $("#session-length").text(25);
                $("#break-length").text(5);
            }
            this.isBreak = false;
            this.isPaused = false;
            this.timeRemaining = 0;
            this.action1 = "start"
            $("#action1").text("start");
            $("#action2").css({
                "visibility": "hidden"
            });
            toggleVisible("show");
            this.startTime = 0;
            this.endTime = 0;
            $("#counter").text(this.sessionLength.value.toString() + ":00");
        },
        start: function() {
          

            this.startTime = new Date().getTime();
            this.endTime = this.startTime + (this.sessionLength.value * 60 * 1000) + 1000; 
        },
        stop: function() {
            this.reset(true); 
        },
        pause: function() {
            this.isPaused = true;
        },
        resume: function() {
            this.isPaused = false;
            this.startTime = new Date().getTime();
            this.endTime = this.startTime + this.timeRemaining;
        }
    },
    modal = {
        show: function() {
            $("#overlay").css({
                "display": "flex",
                "visibility": "hidden"
            });
            $("#overlay").hide();
            $("#overlay").css({
                "visibility": "visible"
            })
            $("#overlay").fadeIn(300, function() {
                $("#modal").fadeIn(300);
            });
        },
        hide: function() {
            $("#modal").fadeOut(300, function() {
                $("#overlay").fadeOut(300);
            });
        }
    }

function playDing() {
    // Checks if sound is enabled and plays a ding.
    if ($("#switch-sound").is(':checked')) {
        ding.play();
    }
}

function toggleVisible(showHide) {
    var top = $(".mdl-card__title");
    var bottom = $(".mdl-card__supporting-text");
    if (showHide === "show") {
        $("#message").fadeOut(300, function() {
            top.animate({
                height: 125
            }, 300);
            bottom.slideDown(300);
        });
    } else {
        top.animate({
            height: top.height() + bottom.height() + 64
        }, 300, function() {
            $("#message").text("You go girllllllllllll");
            $("#message").fadeIn(300);
        });
        bottom.slideUp(300);
    }
}

function msToMinutes(ms) {

    var minutes = Math.floor(ms / 60000).toString();
    var seconds = Math.floor((ms % 60000) / 1000).toString();
    if (seconds.length === 1) {
        seconds = "0" + seconds
    }
    return pomodoro.timeRemaining > 0 ? minutes + ":" + seconds : "0:00";
}

window.setInterval(function() {
    if (pomodoro.startTime > 0 &&
        pomodoro.isPaused === false) {
        var now = new Date().getTime();

        pomodoro.timeRemaining = pomodoro.endTime - now;
        $("#counter").text(msToMinutes(pomodoro.timeRemaining));
        if (pomodoro.timeRemaining < 0 &&
            pomodoro.isBreak === false) {
            pomodoro.isBreak = true;
            $("#message").fadeOut(300, function() {
                $("#message").text("Take a break!");
                $("#message").fadeIn(300, function() {
                    playDing();
                });
            })
            pomodoro.endTime = now + (pomodoro.breakLength.value * 60 * 1000) + 1000;
        } else if (pomodoro.timeRemaining < 0 &&
            pomodoro.isBreak === true) {
            pomodoro.isBreak = false;
            $("#message").fadeOut(300, function() {
                $("#message").text("Do the thing!");
                $("#message").fadeIn(300, function() {
                    playDing();
                });
            });

            pomodoro.start();
        }
    } else {
    }
}, 100);

$(document).ready(function() {
    $("#reset").click(function() {
        pomodoro.reset();
    });
    $("#action1").click(function() {
        if (pomodoro.action1 === "start" ||
            pomodoro.action1 === "resume") {
            if (pomodoro.action1 === "start") {
                toggleVisible("hide");
                pomodoro.start();
            } else {
                pomodoro.resume();
            }
            pomodoro.action1 = "pause";
            $(this).text(pomodoro.action1);
            $("#action2").css({
                "visibility": "visible"
            });
        } else if (pomodoro.action1 === "pause") {
            pomodoro.pause();
            pomodoro.action1 = "resume";
            $(this).text(pomodoro.action1);
        }
    })
    $("#action2").click(function() {
        toggleVisible("show");
        pomodoro.stop();
        pomodoro.action1 = "start"
        $("#action1").text(pomodoro.action1);
        $("#action2").css({
            "visibility": "hidden"
        });
    })

    $("#session-plus").click(function() {
        pomodoro.sessionLength.increase();
    });
    $("#session-minus").click(function() {
        pomodoro.sessionLength.decrease();
    });
    $("#break-plus").click(function() {
        pomodoro.breakLength.increase();
    });
    $("#break-minus").click(function() {
        pomodoro.breakLength.decrease();
    });

    $("#switch-sound").change(function() {
        playDing();
    });

    $("#fcc").click(function() {
        modal.show();
    })
    $("#close").click(function() {
        modal.hide();
    })
    $("#overlay").click(function() {
        modal.hide();
    });
})