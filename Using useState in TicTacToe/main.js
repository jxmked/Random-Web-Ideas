"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
window.addEventListener("DOMContentLoaded", function () {
    var SOME_QOUTES = [
        "Game start.",
        "Greate game.",
        "It's open source!",
        "Nice play",
        "Written in Typescript!",
        "Have a good day!"
    ];
    var BLOCKS_DOM = document.getElementsByClassName('blocks');
    var MESSAGE_DOM = document.getElementById('message-text');
    var RESET_BTN_DOM = document.getElementById('reset-btn');
    var PLAYER = "player";
    var COMPUTER = "opponent";
    var STRIKED_LINE = "striked";
    var STRAIGHTS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 4, 8], [2, 4, 6],
        [0, 3, 6], [1, 4, 7], [2, 5, 8]
    ];
    var FRESH_ARRAY = Array.apply(null, Array(BLOCKS_DOM.length)).map(function () { return void 0; });
    var _a = useState(""), PLAYER_STATUS = _a[0], SET_PLAYER_STATUS = _a[1];
    var AI_DOES_MOVE = true;
    var changeText = useState(function (e) {
        if (PLAYER_STATUS() == "") {
            MESSAGE_DOM.classList.remove('win');
            MESSAGE_DOM.classList.remove('lose');
            MESSAGE_DOM.classList.remove('draw');
            MESSAGE_DOM.innerText = SOME_QOUTES[Math.floor(Math.random() * SOME_QOUTES.length)];
        }
        else {
            switch (PLAYER_STATUS()) {
                case 'WIN':
                    MESSAGE_DOM.innerText = 'You won!';
                    MESSAGE_DOM.classList.add('win');
                    break;
                case 'LOSE':
                    MESSAGE_DOM.innerText = 'You lose!';
                    MESSAGE_DOM.classList.add('lose');
                    break;
                case 'DRAW':
                    MESSAGE_DOM.innerText = 'Draw!';
                    MESSAGE_DOM.classList.add('draw');
                    break;
            }
        }
    }, MESSAGE_DOM)[1];
    var RESET_FUNCTION = function () {
        SET_PLAYER_STATUS("");
        make_turn(0, BLOCKS_DOM[0], "reset");
        changeText();
        AI_DOES_MOVE = true;
    };
    var RESET_BLOCK = function (index) {
        BLOCKS_DOM[index].classList.remove(STRIKED_LINE);
        BLOCKS_DOM[index].classList.remove(PLAYER);
        BLOCKS_DOM[index].classList.remove(COMPUTER);
    };
    var HIGHLIGHT_STRAIGHTS = function (line) {
        line.forEach(function (num) {
            RESET_BLOCK(num);
            BLOCKS_DOM[num].classList.add(STRIKED_LINE);
        });
    };
    var CHECK_STRAIGHT = function (table, challenger) {
        return STRAIGHTS.filter(function (straight) {
            return straight.filter(function (i) { return table[i] == challenger; }).length == straight.length;
        });
    };
    var IS_BLOCK_TAKEN = function (index) { return BLOCKS_ARRAY()[index] !== void 0; };
    var _b = useState(function (current_value, index, element, challenger) {
        if (challenger == "reset")
            return __spreadArray([], FRESH_ARRAY, true);
        var cloned = __spreadArray([], current_value, true);
        cloned[index] = challenger;
        return cloned;
    }, __spreadArray([], FRESH_ARRAY, true)), BLOCKS_ARRAY = _b[0], make_turn = _b[1], block_change = _b[2];
    block_change(function (new_table) {
        for (var index = 0; index < BLOCKS_DOM.length; index++) {
            if (new_table[index] !== void 0) {
                BLOCKS_DOM[index].classList.add(new_table[index]);
            }
            else {
                RESET_BLOCK(index);
            }
        }
        var res = CHECK_STRAIGHT(new_table, PLAYER);
        if (res.length > 0) {
            res.forEach(function (x) { return HIGHLIGHT_STRAIGHTS(x); });
            console.log("Player wins");
            console.log("Straights: ", res);
            SET_PLAYER_STATUS("WIN");
            changeText();
            return;
        }
        res = CHECK_STRAIGHT(new_table, COMPUTER);
        if (res.length > 0) {
            res.forEach(function (x) { return HIGHLIGHT_STRAIGHTS(x); });
            console.log("AI wins");
            console.log("Straights: ", res);
            SET_PLAYER_STATUS("LOSE");
            changeText();
            return;
        }
        if (new_table.filter(function (x) { return x == void 0; }).length == 0) {
            console.log("No Available Moves");
            SET_PLAYER_STATUS("DRAW");
            changeText();
            return;
        }
    });
    var ENEMY = function () {
        var available_moves = BLOCKS_ARRAY().map(function (v, index) {
            return (v == void 0) ? index : void 0;
        }).filter(function (k) { return k != void 0; });
        var check_moves = function (name) {
            return available_moves.filter(function (index) {
                var test = __spreadArray([], BLOCKS_ARRAY(), true);
                test[index] = name;
                return CHECK_STRAIGHT(test, name).length > 0;
            });
        };
        var random = function (arr) {
            if (arr.length < 2)
                return arr.length - 1;
            return Math.floor(Math.random() * arr.length);
        };
        var a;
        a = check_moves(COMPUTER);
        if (a.length > 0) {
            return a[random(a)];
        }
        a = check_moves(PLAYER);
        if (a.length > 0) {
            return a[random(a)];
        }
        a = available_moves;
        return a[random(a)];
    };
    var _loop_1 = function (index) {
        BLOCKS_DOM[index].addEventListener('click', function (evt) {
            if (PLAYER_STATUS() !== "" || !AI_DOES_MOVE || IS_BLOCK_TAKEN(index))
                return;
            AI_DOES_MOVE = false;
            make_turn(index, BLOCKS_DOM[index], PLAYER);
            if (PLAYER_STATUS() !== "")
                return;
            window.setTimeout(function () {
                var ai_turn = ENEMY();
                make_turn(ai_turn, BLOCKS_DOM[ai_turn], COMPUTER);
                AI_DOES_MOVE = true;
            }, 200);
        });
    };
    for (var index = 0; index < BLOCKS_DOM.length; index++) {
        _loop_1(index);
    }
    RESET_BTN_DOM.addEventListener('click', RESET_FUNCTION, true);
});
function useState(param, def) {
    var value = null;
    if ({}.toString.call(param) === '[object Function]' && def !== void 0) {
        value = def;
    }
    else {
        value = param;
    }
    var setValue;
    var onChange = function () { };
    var mainSetValue = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var res = null;
        if ({}.toString.call(setValue) === '[object Function]') {
            res = setValue.apply(void 0, args);
            onChange(value);
            return res;
        }
        else {
            return setValue;
        }
    };
    if (typeof param == 'string' || param instanceof String) {
        setValue = function (arg) {
            value = arg;
        };
    }
    else if (Number(param) === param) {
        setValue = function (arg) {
            try {
                var num = Number(arg);
                if (num == NaN) {
                    throw new Error('');
                }
                value = num;
            }
            catch (e) {
                throw new Error("useState() has been set to use number");
            }
        };
    }
    else if (param.constructor === Object) {
        setValue = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var key = args[0], val = args[1];
            if (!(typeof key == 'string' || key instanceof String) && (Number(key) !== key)) {
                throw new Error("useState() has been set to Object. Only String and Numbers are valid as keys");
            }
            value[key] = val;
        };
    }
    else if (param === true || param === false) {
        setValue = function (arg) {
            if (!(arg === true || arg === false)) {
                throw new Error("useState() has been set to use boolean");
            }
            value = arg;
        };
    }
    else if (param.constructor === Array) {
        setValue = {
            push: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var res = value.push.apply(value, args);
                onChange();
                return res;
            },
            splice: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var res = value.splice.apply(value, args);
                onChange();
                return res;
            },
            pop: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var res = value.pop.apply(value, args);
                onChange();
                return res;
            },
            shift: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var res = value.shift.apply(value, args);
                onChange();
                return res;
            },
            unshift: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var res = value.unshift.apply(value, args);
                onChange();
                return res;
            }
        };
        Object.freeze(setValue);
        mainSetValue = setValue;
    }
    else if ({}.toString.call(param) === '[object Function]') {
        setValue = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            value = param.apply(void 0, __spreadArray([value], args, false));
        };
    }
    else {
        setValue = function (arg) {
            value = arg;
        };
    }
    return [
        function () { return value; },
        mainSetValue,
        function (callback) { return onChange = callback; }
    ];
}
//# sourceMappingURL=main.js.map