var godot = require("godot");
var producer = godot.producer({
  ttl: 1000,
  metric: 1
});
var client = godot.createClient({
    type:"tcp",
    producers: [
      producer
    ]
});
var i = 0;
producer.produce = function(){
  i = i < 9 ? i+1 : 1;
  this.emit('data', {
    host:        this.values.host,
    service:     "foo/bar/barfoo",
    state:       this.values.state,
    time:        Date.now(),
    description: this.values.description,
    tags:        this.values.tags,
    metric:      i,
    ttl:         this.values.ttl
  });
}
client.connect(1337);