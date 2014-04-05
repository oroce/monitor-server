
var util = require("util"),
    es = require("elasticsearch"),
    ReadWriteStream = require( "godot" ).common.ReadWriteStream;


//
// ### function Graphite (options)
// #### @options {Object} Options for sending data to Graphite.
// ####   @options.url      {string} Graphite url.
// ####   @options.prefix   {string} Graphite prefix added to all metrics.
// Constructor function for the Graphite stream responsible for sending
// metrics on data events.
//
function leadingZero(num){
  console.log( "leading zeroing", num , ( "0" + num ).slice( -2 ) );
  return ( "0" + num ).slice( -2 );
}
var ElasticSearch = module.exports = function ElasticSearch(options) {
  if (!options || !options.host ){
    throw new Error('options.host is required');
  }

  ReadWriteStream.call(this);

  this.client  = (new es.Client({
    host: options.host,
    log: 'trace'
  }));
  this.index = options.index || function(){
    var now = new Date();
    return util.format( "%s-%s-%s", now.getFullYear(), leadingZero( now.getMonth() + 1 ), leadingZero( now.getDate() ) );
  }
};

//
// Inherit from ReadWriteStream.
//
util.inherits(ElasticSearch, ReadWriteStream);

//
// ### function write (data)
// #### @data {Object} JSON to send metric with
// Sends a metric with the specified `data`.
//
ElasticSearch.prototype.write = function (data) {
  var self    = this;

  this.client.create({
    index: this.index( data ),
    body: data,
    type: "object"
  }, function( err ){
    console.log.apply( console, ["response"].concat([].slice.call(arguments)));
    if( err ){
      return self.emit("reactor:error", err );
    }
  });
  this.emit("data", data );
};