"use strict";
var CopyToClipboard = (function () {
    function CopyToClipboard(element) {
        var _this = this;
        this.clickCallback = function () { };
        this.thenCallback = function () { };
        this.catchCallback = function () { };
        if (window.navigator && window.navigator.clipboard) {
            this.method = "nav";
        }
        else if (document.execCommand) {
            this.method = "exec";
        }
        else {
            throw new Error("No Available Method To Use CopyToClipboard");
        }
        var selections = {
            "nav": this.copyNavigator,
            "exec": this.copyExec
        };
        element.addEventListener("click", function (e) {
            try {
                var str = _this.clickCallback(element);
                str = _this.__sanitizeString(str);
                selections[_this.method](str, _this.thenCallback, _this.catchCallback);
            }
            catch (e) {
                _this.catchCallback(e);
            }
        });
    }
    CopyToClipboard.prototype.copyExec = function (str, s, c) {
        if (document.execCommand("copy"))
            s();
        else
            c();
    };
    CopyToClipboard.prototype.copyNavigator = function (str, s, c) {
        window.navigator.clipboard.writeText(str).then(s).catch(c);
    };
    CopyToClipboard.prototype.__sanitizeString = function (str) {
        return str.trim();
    };
    CopyToClipboard.prototype.onClick = function (callback) {
        this.clickCallback = callback;
        return this;
    };
    CopyToClipboard.prototype.then = function (callback) {
        this.thenCallback = callback;
        return this;
    };
    CopyToClipboard.prototype.catch = function (callback) {
        this.catchCallback = callback;
        return this;
    };
    return CopyToClipboard;
}());
window.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("main_btn");
    var target = btn.getAttribute("data-target");
    var input = document.getElementById(target);
    var ctb = new CopyToClipboard(btn);
    function reset(btn) {
        var i = window.setTimeout(function () {
            btn.setAttribute("data-state", "copy");
            clearTimeout(i);
        }, 750);
    }
    ctb.onClick(function (element) {
        if (String(input.value).trim().length < 1) {
            throw new Error("empty");
        }
        input.select();
        input.setSelectionRange(0, 99999);
        return document.getSelection().toString();
    });
    ctb.then(function () {
        btn.setAttribute("data-state", "copied");
        reset(btn);
    });
    ctb.catch(function () {
        btn.setAttribute("data-state", "failed");
        reset(btn);
    });
});
//# sourceMappingURL=main.js.map