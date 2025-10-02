"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIfCommand = handleIfCommand;
function handleIfCommand(msg, prefix, victim) {
    var msgString = msg.toString();
    var isPrefixed = msgString.startsWith(prefix);
    if (isPrefixed) {
        var func = function (victim, msg) {
            // algo to rip apart arguments and stuff etc...
            var split = msgString.split(" ");
            var commandName = split[0].substring(1);
            try {
                var command = victim.getCmd(commandName);
                command(msg, victim);
            }
            catch (err) {
                console.log(err);
            }
        };
        func(victim, msg);
    }
    return isPrefixed;
}
