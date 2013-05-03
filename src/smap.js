cubism_contextPrototype.smap = function(host) {
  if (!arguments.length) host = "";
  var source = {}, context = this;
  var summary = 'mean'

  source.metric  = function(uuid, name) {
    if (name == undefined) {
      name = uuid;
    }
    var metric = context.metric(function(start, stop, step, callback) {
        console.log("metric " + start + " " + stop  + " " + step);
                                 
        d3.json(host + "/api/query")
          .post("apply swindow(" + summary + ", " + step / 1000 + ", skip_empty=0)" +
                " to data in (" + (+start) + ", " + (+stop) + ") limit -1 where uuid = '" + uuid + "'",
                function(error, d) {
                  d = d[0];
                  rv = [];
                  for (i = 0; i < d['Readings'].length; i++) {
                    rv.push(d['Readings'][i][1]);
                  }
                  callback(null, rv);
                });
      }, name += '');
    return metric;
  };

  source.find = function(expression, callback) {
    console.log(expression)
    d3.json(host + '/api/query')
      .post("select * where " + expression, 
            function(error, d) {
               callback(error, d);
            });

  source.metrics = function(expression, callback, label) {
    

  }

  source.toString = function() {
    return host;
  };
  
  return source;
};
