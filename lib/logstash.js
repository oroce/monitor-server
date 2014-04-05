var util = require("util"),
    dgram = require( "dgram" ),
    ReadWriteStream = require( "godot" ).common.ReadWriteStream;

var Logstash = module.exports = function Logstash(options) {
  ReadWriteStream.call(this);

  this.host = options.host||"localhost";
  this.port = options.port||"28777"
};

//
// Inherit from ReadWriteStream.
//
util.inherits(Logstash, ReadWriteStream);

//
// ### function write (data)
// #### @data {Object} JSON to send metric with
// Sends a metric with the specified `data`.
//
Logstash.prototype.write = function write(data) {
  var msg = {
    "@timestamp": new Date( data.time ).toISOString(),
    "@message": data.description,
    "@tags": data.tags,
    "@source": data.service,
    "@level": data.meta && data.meta.level,
    "@host": data.host
  };

  this.send(JSON.stringify(msg));
  this.emit( "data", data );
};

Logstash.prototype.send = function send(message){
  console.log( "sending", message );
  var buf = new Buffer(message);
  var self = this;
  if( !this.client ){
    this.client = dgram.createSocket("udp4");
    this.client.on( "error", function( err ){
      self.emit( "error", err );
    });
  }

  this.client.send(buf, 0, buf.length, this.port, this.host);
};