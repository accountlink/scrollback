var config = require("../config.js");
var get = require("./get.js");
var put = require("./put.js");

module.exports = function(core) {

	core.on('getSessions', function(action, callback) {
		// will need to complete this.
		return callback();
		get("session",action.ref, function(err, sessionObj) {
			var session = {
				id: action.session,
				user: action.user.id,
				origin: action.origin
			};
		});
	});
	

	core.on('user', function(action, callback) {
		if(/^guest-/.test(action.from)) {
            get("session",action.session, function(err, sessionObj) {
				var session = {
					id: action.session,
					user: action.user.id,
					origin: action.origin
				};
				if(!err) {
					session.origin = sessionObj.origin || {};
						
				}
				put("session",action.session,session);
				return callback();
			});
        }else{
        	callback();
        }
	});
	core.on("init", function(action, callback) {
		if(action.auth && !action.user.id) {
	        return callback();
	    }
		get("session",action.session, function(err, sessionObj) {
			var session = {
				id: action.session,
				user: action.user.id,
				origin: action.origin
			};
			if(err){

			}else{
				if(sessionObj && sessionObj.origin && sessionObj.origin.locations) {
					Object.keys(sessionObj.origin.locations).forEach(function(resource) {
						if(session.origin && session.origin.locations){
							session.origin.locations[resource] = sessionObj.origin.locations[resource]	
						}
					});
				}
					
			}
			put("session",action.session,session);
			callback();
		});
	},"storage");
};


/* delete when the time is right. ;)
	sample objects
	{
		id: "web:192.168.0.1:scrollback_SID:aocjsncaosmca;lsdmfnasjdvknasd;lfkm",
		user: "guest-harish",
		origin:{
			gateway: "web",
			client: "192.168.0.1",
			locations: {
				"resourceID1" : "https://mozillaindia.org/home.html",
				"resourceID2" : "https://jfdi.org"
			}
		}
	}

	{
		id: "irc://irc.freenode.net/xzntric",
		user: "guest-xzntric",
		origin:{
			gateway: "irc",
			server: "irc.freenode.net",
			client: "192.168.0.1"
		}
	}

*/