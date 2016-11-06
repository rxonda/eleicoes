var MyMap = (function(){
	var _map;
	var _layer;
	var _load = function(municipios) {
		var MyFeature = function(){
			var _styleHandler = function(feature) {
				return municipios[feature.properties.CD_GEOCODM];
			};

			return {
				style: _styleHandler
			};
		};
		if(_layer){
			_map.removeLayer(_layer);
		}
		var geosonlayer = L.geoJson(null, MyFeature());
		_layer=omnivore.topojson('brasil.json', null, geosonlayer).addTo(_map);
	};

	var _init = function(mapid){
		_map = L.map(mapid).setView([-10.00, -55.00], 5);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			id: 'rxonda.c9692cc1',
			accessToken: 'pk.eyJ1IjoicnhvbmRhIiwiYSI6IjM5N2I2MjZjYmVhZWU1MzJmNTI1M2I4YzU1ODFmNjhjIn0.hz3dSmooHrcS-BEwy_OW3g#5'
		}).addTo(_map);
	};

	return {
		'init': _init,
		'load': _load
	};
})();