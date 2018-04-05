Module.register('MMM-Available', {
	defaults: {
        updateInterval: 10000
	},

    getScripts: function() {
        return [
            'printf.js'
        ];
    },

    getStyles: function() {
		return ['mmm-available.css'];
	},

	start: function() {
		this.list = null;
        this.loaded = false;
        this.lastSeen = '';
        this.getAvailability(this.config.availableApiUrl);
        var self = this;

        setInterval(function() {
            self.updateDom(1000);
        }, 60000);
	},

    socketNotificationReceived: function(notification, payload) {
		if(notification === 'AVAILABLE_DATA') {
			if(payload.lastSeen != null) {
                this.processMessage(payload);
            }
            this.updateDom(1000);
		}
	},

    getAvailability: function(url) {
        this.sendSocketNotification('CHECK_AVAILABLE', {
            availabilityUrl: url,
            config: this.config
        });
    },

    getNextPrecipStart: function() {
        return this.list.points.filter((item) => 
            item.precipitation.intensity > 0 && Date.parse(item.time) >= new Date().valueOf())[0];
    },

    getNextPrecipStop: function() {
        return this.list.points.filter((item) => 
            item.precipitation.intensity === 0 && Date.parse(item.time) >= new Date().valueOf())[0];
    },

    getMinutesTill: function(nextItemTime) {
        return Math.abs(Date.parse(nextItemTime) - new Date().valueOf()) / (1000 * 60);
    },

	getDom: function() {
		var wrapper = document.createElement('div');

		if (!this.loaded) {
			wrapper.innerHTML = 'Loading';
			wrapper.className = 'dimmed light small';
			return wrapper;
	    }
        wrapper.innerHTML = 'Edmunds var sist sett for ' + this.lastSeen; 
    	return wrapper;
	},

    processMessage: function(obj) {
        this.lastSeen = obj.lastSeen;
        this.loaded = true;
    }
});