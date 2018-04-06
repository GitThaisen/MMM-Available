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

	getDom: function() {
        var wrapper = document.createElement('div');

		if (!this.loaded) {
			wrapper.innerHTML = 'Laster...';
			wrapper.className = 'dimmed light small';
			return wrapper;
        }
        var image = document.createElement('img');
        image.setAttribute('src', this.file('images/edmunds.jpg'));
        image.className = this.lastSeen.indexOf('sekunder') > -1 ? 'present' : 'not_present';
        wrapper.appendChild(image);
        var statusMessage = document.createElement('p');
        statusMessage.innerHTML = printf('På plass for %s', this.lastSeen);
        wrapper.appendChild(statusMessage);
    	return wrapper;
	},

    processMessage: function(obj) {
        this.lastSeen = obj.lastSeen;
        this.loaded = true;
    }
});