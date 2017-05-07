'use strict';
// create an API server
const Restify = require('restify');
const server = Restify.createServer({
	name: 'MovieMate'
});
const PORT = process.env.PORT || 3001;

server.use(Restify.jsonp());
server.use(Restify.bodyParser());
server.use((req, res, next) => f.verifySingature(req, res, next));


// Tokens
const config = require('./config');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.FB);

// Wit.ai
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken: config.WIT.ACCESS_TOKEN
})

//OMDB
const omdb = require('./omdb');

// Your Bot here

// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});

// Receive all incoming messages
server.post('/', (req, res, next) => {
	f.incoming(req, res, msg => {

		const {
			message,
			sender
		} = msg;

		// Process messages
		if(message.text) {
			// If a text message is received
			// f.txt(sender, `${message.text}`);

			wit.message(message.text, {})
				.then(omdb)
				.then(response => {
					f.txt(sender, response.text);
					if (response.image) {
						f.img(sender, response.image);
					}
				})
				.catch(error => {
					console.log(error);
					f.txt(sender, "Hmm... it seems my servers are acting up.  Maybe hit me up in a little bit?");
				});
		}
	});
	return next();
});

// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`MovieMate running on port ${PORT}`));
