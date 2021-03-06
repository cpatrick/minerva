function main() {
  var mapOptions =
    {
      node: '#map',
      zoom : 4,
      center : {x: -12, y: 8}
    }, myMap = null, layer = null;

  /// Resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function updateAndDraw(width, height) {
    if (!myMap) {
      myMap = geo.map(mapOptions);
      layer = myMap.createLayer('osm');
    }
    myMap.resize(0, 0, width, height);
    myMap.draw();
  }

  function resizeCanvas() {
    updateAndDraw($('#map').width(), $('#map').height());
  }

  resizeCanvas();

  var countries;

  // start getting the country border data
  d3.json('/countries.topo.json', function (error, data) {
    if (error) {
      console.log(error);
      countries = null;
      return;
    }

    countries = topojson.feature(data, data.objects.countries);
  });

  // save the current map state
  var mapState = null,
      featureLayer = myMap.createLayer('feature', {'renderer': 'd3Renderer'}),
      svg = featureLayer.canvas(), // this is a d3 object wrapping an svg group element
      renderer = featureLayer.renderer();

  // Remove all features
  function resetMap() {
    svg.selectAll('*').remove();
  }

  function createChoroplethForTarget(target) {
    if (countries === undefined) {
      window.setTimeout(createChoropleth, 100);
      return;
    } else if (countries === null) {
      console.log('Could not load country data');
      return;
    }

    // find the country data for `target`
    var feature;
    countries.features.forEach(function (f) {
      if (f.properties.name === target) {
        feature = f;
      }
    });

    // draw the border
    var line = d3.geo.path().projection(function (c) {
      var d = renderer.worldToDisplay({
        x: c[0],
        y: c[1]
      });
      return [d.x, d.y];
    });

    svg.append('path')
      .datum(feature)
        .attr('d', line)
        .attr('class', 'border')
        .style('fill', 'yellow')
        .style('fill-opacity', 0.25);

    featureLayer.geoOn(geo.event.d3Rescale, function (arg) {
      // TODO need to unbind on exit
      svg.selectAll('.border')
        .style('stroke-width', 1/arg.scale);
    });
  }

  function createChoropleth() {
      resetMap();
      var targets = ['Guinea', 'Liberia', 'Sierra Leone', 'Nigeria', 'Senegal'];
      targets.forEach(createChoroplethForTarget);
  }

  //$('#choropleth').click(createChoropleth);
  createChoropleth();
}
