cordova.define("validemail.ValidEmail", function(require, exports, module) {var exec = require("cordova/exec");

var ValidEmail = function () {
    this.name = "ValidEmail";
};


ValidEmail.prototype.send = function (message, success, failure) {
    exec(success, failure, "ValidEmail", "send", [message]);
};

module.exports = new ValidEmail();
});
