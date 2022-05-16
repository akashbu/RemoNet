var config = require('./configuration');

const MQTT_DATABASE_URL = 'https://remonet-f20c4.firebaseio.com'
const MQTT_SERVICE_ACC_KEY_PATH = './ServiceAccountKey.json'
const FIREBASE_DB_REFERENCE_ASSET_MOVABLE = 'Asset-Track/Movable'												//Document Name which stores data
const FIREBASE_DB_REFERENCE_ASSET_IMMOVABLE = 'Asset-Track/Immovable/Machines'
const FIREBASE_DB_REFERENCE_ASSET_IMMOVABLE_GATEWAY = 'Asset-Track/Immovable/Gateways'
const FIREBASE_DB_REFERENCE_BMS_TRACK = 'BMS/Nodes'
const FIREBASE_DB_REFERENCE_BMS_GATEWAY = 'BMS/Gateway'
var admin = require('firebase-admin');
var serviceAccount = require(MQTT_SERVICE_ACC_KEY_PATH);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: MQTT_DATABASE_URL
});

var db = admin.database()
var bmsGateway =db.ref(FIREBASE_DB_REFERENCE_BMS_GATEWAY)
var assetTrackMovable = db.ref(FIREBASE_DB_REFERENCE_ASSET_MOVABLE);
var usersRef = db.ref("UserDetails");
var assetTrackImmovableGateway = db.ref(FIREBASE_DB_REFERENCE_ASSET_IMMOVABLE_GATEWAY)
var assetTrackImmovable = db.ref(FIREBASE_DB_REFERENCE_ASSET_IMMOVABLE);
var bmsTrack = db.ref(FIREBASE_DB_REFERENCE_BMS_TRACK);

var references = {
	bmsGateway,
	assetTrackImmovableGateway,
	assetTrackMovable,
	usersRef,
	assetTrackImmovable,
	bmsTrack,
}


module.exports = references;
