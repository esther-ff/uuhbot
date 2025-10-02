"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandList = void 0;
var CommandList = /** @class */ (function () {
    function CommandList() {
        this.map = new Map;
        this.length = 0;
    }
    // important: both arrays should have the same length
    // first string is the command name
    // second is the require path
    CommandList.prototype.populate = function (namePaths) {
        var _this = this;
        namePaths.forEach(function (tuple) {
            _this.length += 1;
            _this.map.set(tuple[0], tuple[1]);
        });
    };
    CommandList.prototype.get = function (nom) {
        var maybeFunc = this.map.get(nom);
        if (maybeFunc == undefined) {
            throw new Error("this command wasn't found: ".concat(nom));
        }
        else {
            return maybeFunc;
        }
    };
    CommandList.prototype.len = function () {
        return this.length;
    };
    return CommandList;
}());
exports.CommandList = CommandList;
