var exec = require("cordova/exec");

var ValidEmail = function () {
    this.name = "ValidEmail";
};


ValidEmail.prototype.send = function (message) {
    exec(null, null, "ValidEmail", "send", [message]);
};

module.exports = new ValidEmail();
