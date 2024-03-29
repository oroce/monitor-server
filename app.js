var godot = require("godot");
var format = require('util').format;
var Flatten = require( "./lib/flatten" );
var unflatten = require('flat').unflatten;
var influxdb = require('godot-influxdb');
godot.reactor.register( "flatten", Flatten );
godot.reactor.register('influxdb', influxdb);
var reactor = godot.reactor()
      .hasMeta('all', 'action', 'status')
      .flatten()
      .influxdb({
        username: 'root',
        password: 'root',
        database: 'metrics',
        port: 8086,
        host: 'localhost',
        format: function(data) {
          var meta = data.meta;
          return {
            name: format('%s.%s.%s',
              meta.app,
              meta.action,
              meta.status),
            metric: {
              time: data.time,
              metric: 1
            }
          };
        }
      })
      .console();
var performanceReactor = godot.reactor()
    .hasMeta('performance.entryType')
    .influxdb({
      username: 'root',
      password: 'root',
      database: 'metrics',
      port: 8086,
      host: 'localhost',
      format: function(data) {
        var perf = unflatten(data.meta).performance;
        perf.time = data.time;
        return {
          name: ['performance', perf.entryType, perf.initiatorType].join('.'),
          metric: perf
        }
      }
    });
var server = godot.createServer({
  type: "tcp",
  reactors: [
    /*godot.reactor()
      .on( "reactor:error", console.error.bind(console, "reactor:error" ) )
      .map(function( data ){
        if( data.meta  && data.meta.plugin === "load" ){
          return [ "shortterm", "midterm", "longterm" ].map(function( type ){
            var clone = godot.common.clone( data );
            clone.metric = data.meta[ type ];
            clone.service = [ clone.service, type ].join( "/" );
            return clone;
          });
        }
        return data;
      })
      .flatten()
      .movingAverage({
        duration: 10*1000,
        type: "simple"
      })*/
    reactor,
    performanceReactor
  ]
});
server.on('reactor:error', console.error.bind(console));
server.listen(1337);
