"use strict";
/**
 * Project Name: TypeScript - Copy To Clipboard
 * */
var CopyToClipboard = /** @class */ (function () {
  function CopyToClipboard(element) {
    var _this = this;
    this.__clickCallback = function () {};
    this.__thenCallback = function () {};
    this.__catchCallback = function () {};
    // Check Available Method For Copying
    if (window.navigator && window.navigator.clipboard) {
      this.method = "nav";
      // @ts-expect-error
    } else if (document.execCommand) {
      this.method = "exec";
    } else {
      throw new Error("No Available Method To Use CopyToClipboard");
    }
    this.element = element;
    // Private
    this.__interval = 1000;
    this.__selections = {
      nav: this.__copyNavigator,
      exec: this.__copyExec,
    };
    // Prevent Spamming Buttons
    var clickEvent = function () {
      window.setTimeout(function () {
        return _this.element.addEventListener("click", clickEvent);
      }, _this.__interval);
      _this.element.removeEventListener("click", clickEvent);
      _this.click();
    };
    element.addEventListener("click", clickEvent, false);
  }
  CopyToClipboard.prototype.__copyExec = function (str, s) {
    if (document.execCommand("copy")) s();
    else throw new Error("Error While Copying");
  };
  CopyToClipboard.prototype.__copyNavigator = function (str, s) {
    // @ts-expect-error
    window.navigator.clipboard
      .writeText(str)
      .then(s)
      ["catch"](function (e) {
        throw e;
      });
  };
  /**
   * es3 doesn't support private property
   * */
  CopyToClipboard.prototype.__sanitizeString = function (str) {
    return str.trim();
  };
  CopyToClipboard.prototype.click = function () {
    try {
      var str = this.__clickCallback(this.element);
      str = this.__sanitizeString(str);
      this.__selections[this.method](str, this.__thenCallback);
    } catch (e) {
      this.__catchCallback(e);
    }
  };
  CopyToClipboard.prototype.onClick = function (callback) {
    this.__clickCallback = callback;
    return this;
  };
  CopyToClipboard.prototype.then = function (callback) {
    this.__thenCallback = callback;
    return this;
  };
  CopyToClipboard.prototype["catch"] = function (callback) {
    this.__catchCallback = callback;
    return this;
  };
  return CopyToClipboard;
})();
/**
 * Written By Jovan De Guia
 * Project Name: Copy To Clipboard
 * Github: jxmked
 * */
/**
 * For Demo - TypeScript - Copy To Copy To Clipboard
 * */
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
  var isPortable = (function (a) {
    // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      return true;
    return false;
    // @ts-expect-error
  })(navigator.userAgent || navigator.vendor || window.opera);
  ctb.onClick(function () {
    // Highlight Text
    input.select();
    input.setSelectionRange(0, Math.min(String(input.value).length, 99999));
    var str = document.getSelection().toString();
    if (isPortable && str.trim().length > 0) {
      // Hide or Prevent Keyboard from Showing Up
      // If input is not empty
      input.blur();
    }
    if (str.trim().length < 1) {
      throw new Error("empty");
    }
    return str;
  });
  ctb.then(function () {
    // Success
    btn.setAttribute("data-state", "copied");
    reset(btn);
  });
  ctb["catch"](function () {
    // Failed
    btn.setAttribute("data-state", "failed");
    reset(btn);
  });
});
/**
 * Written By Jovan De Guia
 * Project Name: Copy To Clipboard
 * Github: jxmked
 * */
