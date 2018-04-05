var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	start: function() {
		console.log('Starting node helper for: ' + this.name);
        this.config = null;
        this.availabilityUrl = '';
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
        if(notification === 'CHECK_AVAILABLE') {
            self.config = payload.config;
            this.checkAvailable();
        }
	},

	checkAvailable: function() {
		var self = this;
        var availableData;
        request({url: self.config.availableApiUrl, method: 'GET'}, function(error, response, message) {
            if (!error && (response.statusCode == 200 || response.statusCode == 304)) {
                availableData = JSON.parse(message);
                self.sendSocketNotification('AVAILABLE_DATA', availableData);
            }
            setTimeout(function() { self.checkAvailable(); }, self.config.updateInterval);
        });
	}
});