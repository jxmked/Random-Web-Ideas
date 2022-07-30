"use strict";
function HoldButton(element) {
    var has = {
        "onhold": false,
        "onunhold": false
    };
    var callbacks = {
        "hold": function () { },
        "unhold": function () { },
        "main": function () { }
    };
    var ival;
    var rpTime;
    var userdata = {};
    var start = function (e) {
        if (e.cancelable) {
            e.preventDefault();
        }
        ival = window.setTimeout(function () {
            callbacks["hold"](userdata);
        }, rpTime);
    };
    var end = function (e) {
        if (e.cancelable) {
            e.preventDefault();
        }
        try {
            if (e.type != "mouseleave") {
                userdata["click"](userdata);
            }
            callbacks["unhold"](userdata);
        }
        catch (TypeError) { }
        clearTimeout(ival);
    };
    return {
        "onClick": function (callback) {
            userdata["click"] = callback;
            userdata["func"] = callback;
            userdata["function"] = callback;
        },
        "onHold": function (callback, responseTime) {
            if (responseTime === void 0) { responseTime = 500; }
            rpTime = responseTime;
            if (has["onhold"]) {
                throw new Error("HoldButton.onHold can be call only once.");
            }
            has["onhold"] = true;
            callbacks["hold"] = callback;
            if ('ontouchstart' in element && 'ontouchend' in element) {
                element.addEventListener("touchend", end, false);
                element.addEventListener("touchstart", start, false);
            }
            else if ('onmousedown' in element && 'onmouseup' in element) {
                element.addEventListener('mouseleave', end, false);
                element.addEventListener('mouseup', end, false);
                element.addEventListener('mousedown', start, false);
            }
            else {
                throw new Error("No Available Event Listener");
            }
        },
        "onUnHold": function (callback) {
            if (has["onunhold"]) {
                throw new Error("HoldButton.onUnHold can be call only once.");
            }
            has["onunhold"] = true;
            callbacks["unhold"] = callback;
        }
    };
}
function Start(data) {
    data["ival"] = setInterval(function () {
        data["func"]();
    }, 100);
}
function Stop(data) {
    clearInterval(data["ival"]);
}
window.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector("#num");
    var i_btn = HoldButton(document.querySelector("#i_num"));
    i_btn.onClick(function () {
        input.value = String(Number(input.value) + 1);
    });
    i_btn.onHold(Start, 500);
    i_btn.onUnHold(Stop);
    var d_btn = HoldButton(document.querySelector("#d_num"));
    d_btn.onClick(function () {
        input.value = String(Number(input.value) - 1);
    });
    d_btn.onHold(Start, 500);
    d_btn.onUnHold(Stop);
    var m_modal = document.querySelector("#hold_modal");
    document.querySelector("#hold_modal_close").addEventListener("click", function () {
        m_modal.classList.add("hidden");
    });
    var m_hb = HoldButton(document.querySelector("#hold_button"));
    m_hb.onHold(function () {
        m_modal.classList.remove("hidden");
    });
});
