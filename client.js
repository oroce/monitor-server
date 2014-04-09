var godot = require("godot");
var producer = godot.producer({
  ttl: 10000/3,
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
  /*i = i < 9 ? i+1 : 1;
  this.emit('data', {
    host:        this.values.host,
    service:     "foo/bar/barfoo",
    state:       this.values.state,
    time:        Date.now(),
    description: this.values.description,
    tags:        this.values.tags,
    metric:      i,
    ttl:         this.values.ttl
  });*/
  this.emit('data', {
    host:        this.values.host,
    service:     "foo/bar/barfoo",
    state:       this.values.state,
    time:        Date.now(),
    description: this.values.description,
    tags:        this.values.tags,
    metric:      this.values.metric,
    ttl:         this.values.ttl,
    meta:        {"@version":"1", "@timestamp":"2014-04-08T22:30:03.724Z","host":"bp01.purposeindustries.co","plugin":"load","collectd_type":"load","shortterm":7.58,"midterm":7.51,"longterm":7.6,"type":"collectd","is_it_cloned_st":"true","tags":["load-splitted"],"service":"production/collectd/load/%{type_instance}"}
  });
}
client.connect(1337);