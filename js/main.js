// JavaScript Document
'use strict';

$(function() {
	var source = getCookie('source');
	var based = {
		main_attribute : 187,
		skill_damage : 0,
		attack_per_speed: 1,
		critical_chance : 5,
		critical_damage : 50
	}

	$(document).ready(function() {
		if(source == null) {
			source = {
				skill: {
					damage: 0,
					critical_chance: 0,
					critical_damage: 0
				},
				belt: {},
				boots: {},
				braces: {},
				chest: {},
				glovers: {},
				helm: {},
				pants: {},
				shoulders: {},
				amulet: {},
				ring_1: {},
				ring_2: {},
				weapon_1: {},
				weapon_2: {}
			}
		} else
			source = JSON.parse(Base64.decode(source));

		$('input').val(0);
		
		$.each(based, function(key, value) {
			$('#source .attribute .' + key).val(value);
		});
		
		$.each(source, function(key, value) {
			$.each(value, function(key2, value2) {
				if(key == 'skill')
					$('#source .skill .' + key2).val(value2);
				else
					$('#equip .source .' + key + ' .' + key2).val(value2);
			});
		});

		calculate(source);
		diff();
		
		$('#equip .result input').change(function() {
			var key = $(this).attr('class');
		
			var value = parseFloat($(this).val());
			$(this).val(value);
			value = $(this).val();
	
			if(value == 'NaN')
				value = 0;
	
			if(value < 0)
				value = 0;
	
			$(this).val(value);
			
			diff();
		});
	});

	$('#source .skill input').change(function() {
		var key = $(this).attr('class');
		
		source['skill'][key] = parseFloat($(this).val());
		$(this).val(source['skill'][key]);
		source['skill'][key] = $(this).val();

		if(source['skill'][key] == 'NaN')
			source['skill'][key] = 0;

		if(source['skill'][key] < 0)
			source['skill'][key] = 0;

		$(this).val(source['skill'][key]);

		setCookie('source', Base64.encode(JSON.stringify(source)));
		calculate(source);
		diff();
	});

	$('#equip .source input').change(function() {
		var key1 = $(this).parent().parent().attr('class');
		var key2 = $(this).attr('class');
		
		source[key1][key2] = parseFloat($(this).val());
		$(this).val(source[key1][key2]);
		source[key1][key2] = $(this).val();

		if(source[key1][key2] == 'NaN')
			source[key1][key2] = 0;

		if(source[key1][key2] < 0)
			source[key1][key2] = 0;

		$(this).val(source[key1][key2]);

		setCookie('source', Base64.encode(JSON.stringify(source)));
		calculate(source);
		diff();
	});

	function calculate(data) {
		var total_main_attribute = 0;
		var total_attack_speed = 0;
		var total_critical_chance = 0;
		var total_critical_damage = 0;
		var total_min_damage = 0;
		var total_max_damage = 0;
		
		var weapon_attack_per_second_1 = parseFloat($('#equip .source .attack_per_second_1').val());
		var weapon_min_damage_1 = parseFloat($('#equip .source .min_damage_1').val());
		var weapon_max_damage_1 = parseFloat($('#equip .source .max_damage_1').val());
		
		var weapon_attack_per_second_2 = parseFloat($('#equip .source .attack_per_second_2').val());
		var weapon_min_damage_2 = parseFloat($('#equip .source .min_damage_2').val());
		var weapon_max_damage_2 = parseFloat($('#equip .source .max_damage_2').val());
		
		// 
		$.each($('#equip .source .main_attribute'), function() {
			total_main_attribute = total_main_attribute + parseFloat($(this).val());
		});
		$.each($('#equip .source .attack_speed'), function() {
			total_attack_speed = total_attack_speed + parseFloat($(this).val());
		});
		$.each($('#equip .source .critical_chance'), function() {
			total_critical_chance = total_critical_chance + parseFloat($(this).val());
		});
		$.each($('#equip .source .critical_damage'), function() {
			total_critical_damage = total_critical_damage + parseFloat($(this).val());
		});
		$.each($('#equip .source .min_damage'), function() {
			total_min_damage = total_min_damage + parseFloat($(this).val());
		});
		$.each($('#equip .source .max_damage'), function() {
			total_max_damage = total_max_damage + parseFloat($(this).val());
		});
		
		//
		$('#source .total_main_attribute').val(total_main_attribute);
		$('#source .total_attack_speed').val(total_attack_speed);
		$('#source .total_critical_chance').val(total_critical_chance);
		$('#source .total_critical_damage').val(total_critical_damage);
		$('#source .total_min_damage').val(total_min_damage);
		$('#source .total_max_damage').val(total_max_damage);
		
		//
		total_main_attribute = total_main_attribute + based['main_attribute'];
		total_critical_chance = total_critical_chance + based['critical_chance'] + parseFloat($('#source .skill .critical_chance').val());
		total_critical_damage = total_critical_damage + based['critical_damage'] + parseFloat($('#source .skill .critical_damage').val());
		
		$('#source .attribute .main_attribute').val(total_main_attribute);
		$('#source .attribute .critical_chance').val(total_critical_chance);
		$('#source .attribute .critical_damage').val(total_critical_damage);
		
		//
		var attack_per_second_1 = weapon_attack_per_second_1 * (total_attack_speed / 100 + 1);
		var attack_per_second_2 = weapon_attack_per_second_2 * (total_attack_speed / 100 + 1);

		if(attack_per_second_2 != 0)
			var average_aps = (attack_per_second_1 + attack_per_second_2) / 2;
		else
			var average_aps = attack_per_second_1;
		
		if(average_aps == 0)
			average_aps = 1;
		
		$('#source .attribute .attack_per_second').val(parseInt(average_aps * 100) / 100);
		
		//
		var skill_damage = parseFloat($('#source .skill .damage').val());
		
		var dps = (weapon_min_damage_1 + weapon_max_damage_1 + weapon_min_damage_2 + weapon_max_damage_2) / 2;
		dps += (total_min_damage + total_max_damage) / 2;
		dps *= average_aps;
		dps *= (total_main_attribute / 100 + 1);
		dps *= (total_critical_chance * total_critical_damage / 10000) + 1;
		dps *= skill_damage / 100 + 1;
		
		var min = weapon_min_damage_1 + weapon_min_damage_2 + total_min_damage;
		min *= total_main_attribute / 100 + 1;
		min *= skill_damage / 100 + 1;
		
		var max = weapon_max_damage_1 + weapon_max_damage_2 + total_max_damage;
		max *= total_main_attribute / 100 + 1;
		max *= (total_critical_damage + 100) / 100 + 1;
		max *= skill_damage / 100 + 1;
		
		$('#source .attribute .damage_per_second').val(parseInt(dps * 100) / 100);
		$('#source .attribute .min_damage').val(parseInt(min * 100) / 100);
		$('#source .attribute .max_damage').val(parseInt(max * 100) / 100);
	}
	
	function diff() {
		var diff = {};
		$.each($('#equip .result .helm input'), function() {
			if($(this).val() > 0 && typeof(diff['helm']) != 'number') {
				diff['helm'] = 1;
			}
		});
		$.each($('#equip .result .chest input'), function() {
			if($(this).val() > 0 && typeof(diff['chest']) != 'number') {
				diff['chest'] = 1;
			}
		});
		$.each($('#equip .result .belt input'), function() {
			if($(this).val() > 0 && typeof(diff['belt']) != 'number') {
				diff['belt'] = 1;
			}
		});
		$.each($('#equip .result .boots input'), function() {
			if($(this).val() > 0 && typeof(diff['boots']) != 'number') {
				diff['boots'] = 1;
			}
		});
		$.each($('#equip .result .pants input'), function() {
			if($(this).val() > 0 && typeof(diff['pants']) != 'number') {
				diff['pants'] = 1;
			}
		});
		$.each($('#equip .result .shoulders input'), function() {
			if($(this).val() > 0 && typeof(diff['shoulders']) != 'number') {
				diff['shoulders'] = 1;
			}
		});
		$.each($('#equip .result .braces input'), function() {
			if($(this).val() > 0 && typeof(diff['braces']) != 'number') {
				diff['braces'] = 1;
			}
		});
		$.each($('#equip .result .glovers input'), function() {
			if($(this).val() > 0 && typeof(diff['glovers']) != 'number') {
				diff['glovers'] = 1;
			}
		});
		$.each($('#equip .result .amulet input'), function() {
			if($(this).val() > 0 && typeof(diff['amulet']) != 'number') {
				diff['amulet'] = 1;
			}
		});
		$.each($('#equip .result .ring_1 input'), function() {
			if($(this).val() > 0 && typeof(diff['ring_1']) != 'number') {
				diff['ring_1'] = 1;
			}
		});
		$.each($('#equip .result .ring_2 input'), function() {
			if($(this).val() > 0 && typeof(diff['ring_2']) != 'number') {
				diff['ring_2'] = 1;
			}
		});
		$.each($('#equip .result .weapon_1 input'), function() {
			if($(this).val() > 0 && typeof(diff['weapon_1']) != 'number') {
				diff['weapon_1'] = 1;
			}
		});
		$.each($('#equip .result .weapon_2 input'), function() {
			if($(this).val() > 0 && typeof(diff['weapon_2']) != 'number') {
				diff['weapon_2'] = 1;
			}
		});
		
		var total_main_attribute = parseFloat($('#source .attribute .main_attribute').val());
		var total_critical_chance = parseFloat($('#source .attribute .critical_chance').val());
		var total_critical_damage = parseFloat($('#source .attribute .critical_damage').val());
		
		var total_min_damage = parseFloat($('#source .total_min_damage').val());
		var total_max_damage = parseFloat($('#source .total_max_damage').val());
		
		var total_attack_speed = parseFloat($('#source .total_attack_speed').val());
		var skill_damage = parseFloat($('#source .skill .damage').val());
		
		var weapon_attack_per_second_1 = parseFloat($('#equip .source .attack_per_second_1').val());
		var weapon_min_damage_1 = parseFloat($('#equip .source .min_damage_1').val());
		var weapon_max_damage_1 = parseFloat($('#equip .source .max_damage_1').val());
		
		var weapon_attack_per_second_2 = parseFloat($('#equip .source .attack_per_second_2').val());
		var weapon_min_damage_2 = parseFloat($('#equip .source .min_damage_2').val());
		var weapon_max_damage_2 = parseFloat($('#equip .source .max_damage_2').val());
		
		var total = {
			main_attribute: 0,
			critical_chance: 0,
			critical_damage: 0,
			attack_speed: 0
		};
		
		$.each(diff, function(key, value) {
			if(key == 'weapon_1') {
				weapon_attack_per_second_1 = parseFloat($('#equip .result .attack_per_second_1').val());
				weapon_min_damage_1 = parseFloat($('#equip .result .min_damage_1').val());
				weapon_max_damage_1 = parseFloat($('#equip .result .max_damage_1').val());
			}
			
			if(key == 'weapon_2') {
				weapon_attack_per_second_2 = parseFloat($('#equip .result .attack_per_second_2').val());
				weapon_min_damage_2 = parseFloat($('#equip .result .min_damage_2').val());
				weapon_max_damage_2 = parseFloat($('#equip .result .max_damage_2').val());
			}
			
			$.each($('#equip .source .' + key).children().find('input'), function() {
				var index = $(this).attr('class');
				
				if(typeof(total[index]) != 'number')
					total[index] = 0;
				
				total[index] = total[index] - parseFloat($(this).val());
				total[index] = total[index] + parseFloat($('#equip .result .' + key + ' .' + index).val());
			});
		});
		
		total_main_attribute = total_main_attribute + total['main_attribute'];
		total_critical_chance = total_critical_chance + total['critical_chance'];
		total_critical_damage = total_critical_damage + total['critical_damage'];
		total_attack_speed = total_attack_speed + total['attack_speed'];
		// FIXME
		total_min_damage = total_min_damage + total['min_damage'] || 0;
		total_max_damage = total_max_damage + total['max_damage'] || 0;
		
		//
		var attack_per_second_1 = weapon_attack_per_second_1 * (total_attack_speed / 100 + 1);
		var attack_per_second_2 = weapon_attack_per_second_2 * (total_attack_speed / 100 + 1);

		if(attack_per_second_2 != 0)
			var average_aps = (attack_per_second_1 + attack_per_second_2) / 2;
		else
			var average_aps = attack_per_second_1;
		
		if(average_aps == 0)
			average_aps = 1;
				
		$('#result .attribute .attack_per_second').val(parseInt(average_aps * 100) / 100);
		
		var dps = (weapon_min_damage_1 + weapon_max_damage_1 + weapon_min_damage_2 + weapon_max_damage_2) / 2;
		dps += (total_min_damage + total_max_damage) / 2;
		dps *= average_aps;
		dps *= total_main_attribute / 100 + 1;
		dps *= (total_critical_chance * total_critical_damage / 10000) + 1;
		dps *= skill_damage / 100 + 1;
		
		var min = weapon_min_damage_1 + weapon_min_damage_2 + total_min_damage;
		min *= total_main_attribute / 100 + 1;
		min *= skill_damage / 100 + 1;
		
		var max = weapon_max_damage_1 + weapon_max_damage_2 + total_max_damage;
		max *= total_main_attribute / 100 + 1;
		max *= (total_critical_damage + 100) / 100 + 1;
		max *= skill_damage / 100 + 1;
		
		$('#result .attribute .damage_per_second').val(parseInt(dps * 100) / 100);
		$('#result .attribute .min_damage').val(parseInt(min * 100) / 100);
		$('#result .attribute .max_damage').val(parseInt(max * 100) / 100);
		
		$('#result .attribute .main_attribute').val(total_main_attribute);
		$('#result .attribute .critical_chance').val(total_critical_chance);
		$('#result .attribute .critical_damage').val(total_critical_damage);
		
		$('#result .total_main_attribute').val(total_main_attribute - based['main_attribute']);
		$('#result .total_attack_speed').val(total_attack_speed);
		$('#result .total_critical_chance').val(total_critical_chance - based['critical_chance'] - source['skill']['critical_chance']);
		$('#result .total_critical_damage').val(total_critical_damage - based['critical_damage'] - source['skill']['critical_damage']);
		$('#result .total_min_damage').val(total_min_damage);
		$('#result .total_max_damage').val(total_max_damage);
	}
});
