
var util = require("util"),
    ReadWriteStream = require( "godot" ).common.ReadWriteStream;


//
// ### function Graphite (options)
// #### @options {Object} Options for sending data to Graphite.
// ####   @options.url      {string} Graphite url.
// ####   @options.prefix   {string} Graphite prefix added to all metrics.
// Constructor function for the Graphite stream responsible for sending
// metrics on data events.
//

var Flatten = module.exports = function Flatten() {
  ReadWriteStream.call(this);
};

//
// Inherit from ReadWriteStream.
//
util.inherits(Flatten, ReadWriteStream);

//
// ### function write (data)
// #### @data {Object} JSON to send metric with
// Sends a metric with the specified `data`.
//
Flatten.prototype.write = function (data) {
  if( !Array.isArray( data ) ){
    return this.emit( "data", data );
  }
  data.forEach(function( d ){
    this.emit( "data", d );
  }, this );
};