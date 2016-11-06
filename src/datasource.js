var Datasource = (function($){
	var _resultado = function(callback) {
		$.getJSON('resultado-1-turno.json', function(data){
			$.each(data,function(key,val){
				if(val[0] !== 'UF' && val[0] !== '#N/A'){
					var municipio = {
						'codigo': val[1],
						'nome': val[0],
						'uf': val[5]
					};
					callback.onInicioApuracao(municipio);
					$.each(val, function(_key, _val){
						if(_val instanceof Array){
							callback.onApuracao({
								'partido': _val[0],
								'candidato': _val[1],
								'contagem': _val[2],
								'percentual': _val[3]
							});
						}
					});
					callback.onFimApuracao(municipio);
				}	
			});
			callback.onCompleted();
		});
	};

	var _partido = function(callback) {
		$.getJSON('partidos.json',function(data){
				callback(data);
		});
	};

	var _percentualNacional = function(p, callback) {
		var _contagem=0;
		var _percentual=0.0;
		_resultado({
			'onInicioApuracao': function(){},
			'onApuracao': function(partido) {
				_contagem++;
				if(partido.partido === p){
					_percentual+=partido.percentual;
				}
			},
			'onFimApuracao': function(){},
			'onCompleted': function() {
				callback(_percentual/_contagem);
			}
		});
	};

	return {
		'resultado1Turno': _resultado,
		'partido': _partido,
		'percentualNacional': _percentualNacional
	};
})(jQuery);