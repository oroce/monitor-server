var godot = require("godot");
var Flatten = require( "./lib/flatten" );
godot.reactor.register( "flatten", Flatten );
godot.createServer({
  type: "tcp",
  reactors: [
    godot.reactor()
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
      })
      .graphite({
        url: "plaintext://graphite.purposeindustries.co:2003",
        prefix: "test.godot"
      })
      .console()
  ]
}).listen(1337);
