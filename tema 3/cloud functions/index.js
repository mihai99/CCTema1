const uuid = require('uuid');
const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({
	projectId: 'tema3final',
	keyFilename: './datastore-credential.json'
});
const kindName = 'map-point';

exports.mapPoints = async (req, res) => {
	res.set('Access-Control-Allow-Origin', "*")
	res.set('Access-Control-Allow-Methods', 'GET, POST')
	switch (req.method) {
		case 'GET':
			const query = datastore.createQuery(kindName)
			const [points] = await datastore.runQuery(query);
			  res.status(200).json(JSON.stringify(points));
		  break;
		case 'POST':
			const lng =JSON.parse(req.body).lng
			const lat = JSON.parse(req.body).lat;
			const message = JSON.parse(req.body).message;
			console.warn("body >>>", req.body, "lat", JSON.parse(req.body).lat, "var>>", lat, "lng", lng, "mess", message);
			console.warn(lng, lat, message);
			if(!lat || !lng || !message) {
				res.status(400).send({error: 'Bad reques'});
				return;
			} 
			datastore.save({
					key: datastore.key(kindName),
					data: { uid: uuid.v4(), lng, lat, message, created_at: datastore.int(Math.floor(new Date().getTime()/1000)) }
				})
				.catch(err => {
					console.error('ERROR:', err);
					res.status(500).send(err);
					return;
				});
		
			res.status(200).send(`created point: ${message}`);
		  break;
		default:
			res.status(400).send({error: 'Bad reques'});
		  break;
	  }
	
};