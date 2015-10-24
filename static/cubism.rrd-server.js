cubism.rrdserver = function(context) {
  var source = {};

  var getMetric = function(rrd, cf) {
    cf = cf || 'AVERAGE';

    var metric = context.metric(function(start, stop, step, callback) {
      // make sure we're working with ints (and seconds)
      start = +start/1000, stop = +stop/1000, step = +step/1000;

      d3.json('/metric'
              + '?metric=' + rrd
	      + '&cf=' + cf
	      + '&start=' + start
	      + '&stop=' + stop
	      + '&step=' + step,
		function(data) {
                  // warning: assumes step in returned data is the same as the requested step
                  var first = (start-data['start'])/step;
                  var values = data['values'].slice(first);
                  callback(null, values);
		});
    }, rrd);
    return metric;
  }
  
  source.metric = function(rrd, cf) {
    return getMetric(rrd, cf);
  }

  source.toString = function() {
    return "cubism.rrd-server";
  };

  return source;
}
