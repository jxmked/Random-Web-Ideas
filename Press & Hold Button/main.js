"use strict";
var HoldButton = (function () {
    function HoldButton(element) {
        if (element instanceof Element)
            throw new TypeError("HoldButton requires DOM element");
        this.__has = {
            "onhold": false,
            "onunhold": false
        };
        this.__callbacks = {
            "main": function () { },
            "hold": function () { },
            "unhold": function () { }
        };
        this.__setTimeout = 0;
        this.__userdata = {
            "main": function () { }
        };
        this.__responseTime = 1000;
        this.__element = element;
        this.__init__();
    }
    HoldButton.prototype.__init__ = function () {
        var _this = this;
        if ('ontouchstart' in this.__element && 'ontouchend' in this.__element) {
            this.__element.addEventListener("touchend", function (e) { return _this.__stop__(e); }, false);
            this.__element.addEventListener("touchstart", function (e) { return _this.__start__(e); }, false);
        }
        else if ('onmousedown' in this.__element && 'onmouseup' in this.__element) {
            this.__element.addEventListener('mouseleave', function (e) { return _this.__stop__(e); }, false);
            this.__element.addEventListener('mouseup', function (e) { return _this.__stop__(e); }, false);
            this.__element.addEventListener('mousedown', function (e) { return _this.__start__(e); }, false);
        }
        else {
            throw new Error("No Available Event Listener");
        }
    };
    HoldButton.prototype.__stop__ = function (e) {
        if (e.cancelable)
            e.preventDefault();
        try {
            if (e.type != "mouseleave") {
                this.__callbacks["main"](this.__userdata);
            }
            this.__callbacks["unhold"](this.__userdata);
        }
        catch (TypeError) { }
        clearTimeout(this.__setTimeout);
    };
    HoldButton.prototype.__start__ = function (e) {
        var _this = this;
        if (e.cancelable)
            e.preventDefault();
        this.__setTimeout = window.setTimeout(function () {
            _this.__callbacks["hold"](_this.__userdata);
        }, this.__responseTime);
    };
    HoldButton.prototype.click = function () {
        this.__callbacks["main"](this.__userdata);
    };
    HoldButton.prototype.onClick = function (callback) {
        this.__callbacks["main"] = callback;
        this.__userdata["main"] = callback;
        return this;
    };
    HoldButton.prototype.onHold = function (callback, response) {
        if (response && typeof response === "number")
            this.__responseTime = response;
        if (this.__has["onhold"])
            throw new TypeError("onHold can be called only once");
        this.__has["onhold"] = true;
        this.__callbacks["hold"] = callback;
        return this;
    };
    HoldButton.prototype.onUnHold = function (callback) {
        if (this.__has["onunhold"])
            throw new TypeError("onUnHold can be called only once");
        this.__has["onunhold"] = true;
        this.__callbacks["unhold"] = callback;
        return this;
    };
    return HoldButton;
}());
function Start(data) {
    data["ival"] = setInterval(function () {
        data["main"]();
    }, 100);
}
function Stop(data) {
    clearInterval(data["ival"]);
}
window.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector("#num");
    var i_btn = new HoldButton(document.querySelector("#i_num"));
    i_btn.onClick(function () {
        input.value = String(Number(input.value) + 1);
    });
    i_btn.onHold(Start, 500);
    i_btn.onUnHold(Stop);
    var d_btn = new HoldButton(document.querySelector("#d_num"));
    d_btn.onClick(function () {
        input.value = String(Number(input.value) - 1);
    });
    d_btn.onHold(Start, 500);
    d_btn.onUnHold(Stop);
    var m_modal = document.querySelector("#hold_modal");
    document.querySelector("#hold_modal_close").addEventListener("click", function () {
        m_modal.classList.add("hidden");
    });
    var m_hb = new HoldButton(document.querySelector("#hold_button"));
    m_hb.onHold(function () {
        m_modal.classList.remove("hidden");
    });
});
