var godot = require("godot");

godot.createServer({
  type: "tcp",
  reactors: [
    godot.reactor()
      .on( "reactor:error", console.error.bind(console, "reactor:error" ) )
      .movingAverage({
        duration: 10*1000,
        type: "simple"
      })
      .graphite({
        url: "plaintext://graphite.purposeindustries.co:2003",
        prefix: "test.godot"
      })
  ]
}).listen(1337);
