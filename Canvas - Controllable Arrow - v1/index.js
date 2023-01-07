"use strict";
const canvas = document.getElementById("canvas");
const btn = {
    left: document.getElementById("left"),
    right: document.getElementById("right"),
    up: document.getElementById("up"),
    down: document.getElementById("down"),
    upLeft: document.getElementById("up-left"),
    upRight: document.getElementById("up-right"),
    downLeft: document.getElementById("down-left"),
    downRight: document.getElementById("down-right")
};
const ctx = canvas.getContext('2d');
const currentPos = {
    w: 0,
    h: 0
};
const speed = 5;
const size = 30;
const rapidTrigger = 1;
const isOutline = false;
class HoldButton {
    __has;
    __callbacks;
    __setTimeout;
    __responseTime;
    __userdata;
    __element;
    constructor(element) {
        this.__has = {
            "onhold": false,
            "onunhold": false
        };
        this.__callbacks = {
            "main": () => { },
            "hold": () => { },
            "unhold": () => { }
        };
        this.__setTimeout = 0;
        this.__userdata = {
            "main": () => { }
        };
        this.__responseTime = 1000;
        this.__element = element;
        this.__init__();
    }
    __init__() {
        if ('ontouchstart' in this.__element && 'ontouchend' in this.__element) {
            this.__element.addEventListener("touchend", (e) => this.__stop__(e), false);
            this.__element.addEventListener("touchstart", (e) => this.__start__(e), false);
        }
        else if ('onmousedown' in this.__element && 'onmouseup' in this.__element) {
            this.__element.addEventListener('mouseleave', (e) => this.__stop__(e), false);
            this.__element.addEventListener('mouseup', (e) => this.__stop__(e), false);
            this.__element.addEventListener('mousedown', (e) => this.__start__(e), false);
        }
        else {
            throw new Error("No Available Event Listener");
        }
    }
    __stop__(e) {
        if (e.cancelable)
            e.preventDefault();
        try {
            if (e.type != "mouseleave")
                this.click();
            this.__callbacks["unhold"](this.__userdata);
        }
        catch (TypeError) { }
        clearTimeout(this.__setTimeout);
    }
    __start__(e) {
        if (e.cancelable)
            e.preventDefault();
        this.__setTimeout = window.setTimeout(() => {
            this.__callbacks["hold"](this.__userdata);
        }, this.__responseTime);
    }
    click() {
        this.__callbacks["main"](this.__userdata);
    }
    onClick(callback) {
        this.__callbacks["main"] = callback;
        this.__userdata["main"] = callback;
        return this;
    }
    onHold(callback, response) {
        if (response && typeof response === "number")
            this.__responseTime = response;
        if (this.__has["onhold"])
            throw new TypeError("onHold can be called only once");
        this.__has["onhold"] = true;
        this.__callbacks["hold"] = callback;
        return this;
    }
    onUnHold(callback) {
        if (this.__has["onunhold"])
            throw new TypeError("onUnHold can be called only once");
        this.__has["onunhold"] = true;
        this.__callbacks["unhold"] = callback;
        return this;
    }
}
function Start(data) {
    data["ival"] = setInterval(() => {
        data["main"]();
    }, rapidTrigger);
}
function Stop(data) {
    clearInterval(data["ival"]);
}
function triangle(x, y) {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    let w = currentPos.w + x;
    let h = currentPos.h + y;
    if (w <= 0 + size)
        w = 0 + size;
    else if (w >= width - size)
        w = width - size;
    if (h <= 0)
        h = 0;
    else if (h >= height - (size * 2))
        h = height - (size * 2);
    ctx.beginPath();
    ctx.moveTo(w, h);
    ctx.lineTo(w + size, h + (size * 2));
    ctx.lineTo(w - size, h + (size * 2));
    ctx.closePath();
    if (isOutline) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = "blue";
        ctx.fill();
    }
    currentPos.w = w;
    currentPos.h = h;
}
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    currentPos.w = Math.abs(canvas.width / 2);
    currentPos.h = Math.abs(canvas.height / 2);
    triangle(0, 0);
});
window.dispatchEvent(new Event('resize'));
const factory = (e, x, y) => {
    e.onClick(() => triangle(x, y));
    e.onHold(Start, 400);
    e.onUnHold(Stop);
};
factory(new HoldButton(btn.up), 0, -speed);
factory(new HoldButton(btn.down), 0, speed);
factory(new HoldButton(btn.left), -speed, 0);
factory(new HoldButton(btn.right), speed, 0);
factory(new HoldButton(btn.upLeft), -speed, -speed);
factory(new HoldButton(btn.upRight), speed, -speed);
factory(new HoldButton(btn.downLeft), -speed, speed);
factory(new HoldButton(btn.downRight), speed, speed);
//# sourceMappingURL=index.js.map