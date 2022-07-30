"use strict";
/**
 * Project name: Project Name: Press and Hold For Web Buttons
 * */
function HoldButton(element) {
    /**
     * Click and Hold or Tap and hold a button to initiate extra feature.
     * */
    var has = {
        "onhold": false,
        "onunhold": false
    };
    var callbacks = {
        "hold": function () { },
        "unhold": function () { },
        "main": function () { }
    };
    var ival; // Store setTimeout event data
    var rpTime; // Initiate extra feature after a given time in millisecond
    // Save some data that are related to this function.
    // Accessible to all Callback Functions.
    var userdata = {};
    var start = function (e) {
        has["onhold"] = true;
        if (e.cancelable) {
            e.preventDefault();
        }
        ival = setTimeout(function () {
            callbacks["hold"](userdata);
        }, rpTime);
    };
    var end = function (e) {
        if (e.cancelable) {
            e.preventDefault();
        }
        try {
            if (e.type != "mouseleave") {
                // Main Function
                userdata["click"](userdata);
            }
            // Unhold Function
            callbacks["unhold"](userdata);
        }
        catch (TypeError) { }
        /** Stop or Prevent Timeout to initiate **/
        clearTimeout(ival);
        has["onhold"] = false;
    };
    return {
        "onClick": function (callback) {
            if (!(callback && {}.toString.call(callback) === '[object Function]')) {
                throw new Error("HoldButton.onClick requires a function");
            }
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
            callbacks["hold"] = callback;
            if ('ontouchstart' in element && 'ontouchend' in element) {
                // For Mobile Devices
                element.addEventListener("touchend", end, false);
                element.addEventListener("touchstart", start, false);
            }
            else if ('onmousedown' in element && 'onmouseup' in element) {
                // For Desktop type devices
                /**
                 * My best way of solving...mouseup did not fire if
                 * the cursor is out of element.
                 * */
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
/**
 * Written By Jovan De Guia
 * Project Name: Press and Hold For Web Buttons
 * Github: jxmked
 * */
/**
 * For Demo - Javascript press and hold Button
 * */
function Start(data) {
    // Click Every 100ms
    data["ival"] = setInterval(function () {
        data["func"]();
    }, 100);
}
function Stop(data) {
    clearInterval(data["ival"]);
}
window.addEventListener("DOMContentLoaded", function () {
    // Main Input
    var input = document.querySelector("#num");
    // Init - Increase
    var i_btn = HoldButton(document.querySelector("#i_num"));
    // Main function
    i_btn.onClick(function () {
        input.value = String(Number(input.value) + 1);
    });
    // Set what will happen if we hold the button
    i_btn.onHold(Start, 500);
    // Set what will happen if we unhold the button
    i_btn.onUnHold(Stop);
    // Init - Decrease
    var d_btn = HoldButton(document.querySelector("#d_num"));
    // our main function to call
    d_btn.onClick(function () {
        input.value = String(Number(input.value) - 1);
    });
    // Set what will happen if we hold the button
    d_btn.onHold(Start, 500);
    // Set what will happen if we unhold the button
    d_btn.onUnHold(Stop);
    /** With Modal // Pop-up action **/
    // Modal Container
    var m_modal = document.querySelector("#hold_modal");
    // Close on click
    document.querySelector("#hold_modal_close").addEventListener("click", function () {
        m_modal.classList.add("hidden");
    });
    // Show Modal after press and hold of main button
    var m_hb = HoldButton(document.querySelector("#hold_button"));
    m_hb.onHold(function () {
        m_modal.classList.remove("hidden");
    });
});
/**
 * Written By Jovan De Guia
 * Project Name: Press and Hold For Web Buttons
 * Github: jxmked
 * */
