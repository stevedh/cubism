cubism_contextPrototype.smap = function(host) {
  if (!arguments.length) host = "";
  var source = {}, context = this;
  var summary = 'mean'

  source.metric = function(uuid, name) {
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
    d3.json(host + '/api/query')
      .post("select * where " + expression, 
            function(error, d) {
               callback(error, d);
            });
  };

  function label(stream, label_) {
    var pieces = label_.split('/');
    var _stream = stream;

    for (var i = 0; i < pieces.length; i++) {
      _stream = _stream[pieces[i]];
    } 
    return _stream;
  }

  source.metrics = function () {
    var _instance = this;
    if (arguments.length == 2) {
      var q = arguments[0], l = 'uuid', callback = arguments[1];
    } else {
      var q = arguments[0], l = arguments[1], callback = arguments[2];
    }
    this.find(q, function (error, streams) {
      var metrics = [];
      for (i = 0; i < streams.length; i++) {
        metrics.push(_instance.metric(streams[i]['uuid'],
                                      label(streams[i], l)));
      }
      callback(error, metrics);
    });
  };

  source.toString = function() {
    return host;
  };
  
  return source;
};
