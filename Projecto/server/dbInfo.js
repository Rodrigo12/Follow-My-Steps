var webAppLink      = 'http://localhost:3000/static/';
var connect         = "postgres://followmystepsadmin:123456@localhost/followmystepsdb";
var initialConnect  = "postgres://postgres:123456@localhost/postgres";

var lifeTableColumns      = ['id serial primary key not null', 'source text', 'filename text', 'timestamp text', 'street text', 'city text', 'country text', 'utc int', 'initialhour int', 'finalhour int', 'hour int', 'minutes int', 'activity text', 'type text', 'parent int', 'tags text', 'descriptions text', 'lat float', 'lng float'];
var generalTableColumns   = ['id serial primary key not null', 'source text', 'filename text', 'timestamp text', 'key text',  'value text'];
var photosTableColumns    = ['id serial primary key not null', 'source text', 'filename text', 'timestamp text', 'street text', 'city text', 'country text', 'time text', 'latitude text', 'longitude text', 'description text'];
var gpxTableColumns       = ['id serial primary key not null', 'source text', 'filename text', 'timestamp text', 'time text', 'trackname text', 'latitude text', 'longitude text'];

var variablesTableType    = ['id serial primary key not null', 'source text', 'filename text', 'dbTable text', 'key text', 'type text', 'isTimestamp boolean'];

var filesTable            = ['id serial primary key not null', 'source text unique', 'filename text', 'lastUpdated text'];

var definitionsTable      = ['id serial primary key not null', 'filename text', 'timestamp text', 'type text', 'visualizationID text unique', 'data text', 'properties text'];


//Export database variables
exports.connect        = connect;
exports.initialConnect = initialConnect;

exports.lifeTableColumns    = lifeTableColumns;
exports.generalTableColumns = generalTableColumns;
exports.photosTableColumns  = photosTableColumns;
exports.gpxTableColumns     = gpxTableColumns;

exports.variablesTableType  = variablesTableType;

exports.filesTable          = filesTable;

exports.definitionsTable    = definitionsTable;
