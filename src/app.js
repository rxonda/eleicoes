var Application = (function(ui,mapid,ds) {
	var _ui=ui;
	_ui.init(mapid);
	var _ds=ds;
	var _relevancia = function(_partido,ds) {
		var process = function(callback) {
			var municipios={};
			ds.partido(function(partidos){
				ds.percentualNacional(_partido, function(percentualNacional){
					var find;
					var corForte = '0000ff';//partidos[_partido].cor_forte;
					var corMedia = '00ff00';//partidos[_partido].cor_media;
					var corFraca = 'ff0000';//partidos[_partido].cor_fraca;
					ds.resultado1Turno({
						'onInicioApuracao': function() {},
						'onApuracao': function(partido) {
							if(partido.partido === _partido) {
								find = partido;
							}
						},
						'onFimApuracao': function(municipio){
							var cor = corFraca;
							if(find) {
								var diff = (find.percentual-percentualNacional)/percentualNacional;
								if(diff > 0.5) {
									cor = corForte;
								} else {
									if(diff > -0.5) {
										cor = corMedia;
									}
								}
							}
							municipios[municipio.codigo]={
								'color': "#"+cor,
								'fillColor': "#"+cor,
								'weight': 1
							};
						},
						'onCompleted': function() {
							callback(municipios);
						}
					});
				});
			});
		};

		process(function(municipios){
			_ui.load(municipios);
		});

		return false;

	};

	//Script da pagina geral.html
	var _geral = function(ds) {
		var process = function(callback) {
			var municipios={};
			var quemGanhou;
			ds.partido(function(partidos){
				ds.resultado1Turno({
					'onInicioApuracao': function(municipio) {
						quemGanhou = undefined;
					},
					'onApuracao': function(partido) {
						if(!quemGanhou) {
							quemGanhou = partido;
						} else {
							if(quemGanhou.contagem<partido.contagem){
								quemGanhou = partido;
							}
						}
					},
					'onFimApuracao': function(municipio){
						if(quemGanhou) {
							municipios[municipio.codigo]={
								'color': "#"+partidos[quemGanhou.partido].cor_forte,
								'fillColor': "#"+partidos[quemGanhou.partido].cor_forte,
								'weight': 1
							};
						}
					},
					'onCompleted': function() {
						callback(municipios);
					}
				});
			});
		};

		process(function(municipios){
			_ui.load(municipios);
		});
	};

	var combo=$('#cmbPartido').change(function(){
	    _relevancia($('#cmbPartido').val(),_ds);
	});
	
	ds.partido(function(_p){
		for(var m in _p){
			combo.append($('<option>', { 
		        value: m,
		        text : m 
		    }));
		}
	});
	return {
		'relevancia': _relevancia,
		'geral': _geral
	};
});
