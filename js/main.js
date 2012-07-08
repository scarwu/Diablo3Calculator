// JavaScript Document
'use strict';

var template = JSON.stringify({
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
});
var based = JSON.parse(template);
var replacement = JSON.parse(template);
var temp = JSON.parse(template);

var default_point = {
	main_attribute : 187,
	skill_damage : 0,
	attack_per_speed: 1,
	critical_chance : 5,
	critical_damage : 50
};
var diff_equip = {
	skill: false,
	belt: false,
	boots: false,
	braces: false,
	chest: false,
	glovers: false,
	helm: false,
	pants: false,
	shoulders: false,
	amulet: false,
	ring_1: false,
	ring_2: false,
	weapon_1: false,
	weapon_2: false
};

$(function() {
	// Init Profile
	function initProfile() {
		if(getCookie('order') == null) {
			setCookie('order', 1);
		}
		
		for(var order = 1;order <= 5;order++) {
			if(getCookie('equip' + order) == null) {
				setCookie('equip' + order, Base64.encode(template));
			}
		}
	}

	// Reset
	function reset(data, target) {
		// Set selected character
		if(target == 'based')
			$('#equip .based .order').val(getCookie('order'));
		
		$('#' + target + ' .skill input').val(0);
		$('#equip .' + target + ' input').val(0);
		$('#equip .' + target + ' .minor_dps').text(0);

		// Set default point
		$.each(default_point, function(key, value) {
			$('#' + target + ' .attribute .' + key).val(value);
		});
		
		// Set character data
		$.each(data, function(key, value) {
			$.each(value, function(key2, value2) {
				if(key == 'skill')
					$('#' + target + ' .skill .' + key2).val(value2);
				else
					$('#equip .' + target + ' .' + key + ' .' + key2).val(value2);
			});
		});
	}
	
	$('#nav .equip').click(function() {
		$('#equip').show();
		$('#setting').hide();
	});

	$('#nav .setting').click(function() {
		$('#setting').show();
		$('#equip').hide();
	});
	
	$(document).ready(function() {
		// Init Data
		initProfile();
		
		// Load
		based = JSON.parse(Base64.decode(getCookie('equip' + getCookie('order'))));
		
		// Reset
		$('input').val(0);
		$('.minor_dps').text(0);
		
		// Based
		reset(based, 'based');
		totalAttribute(based, 'based');
		calculate(based, 'based');
		calculateMinorDPS('based');
		
		// Replacement
		createDiffReplacement();
		reset(temp, 'replacement');
		totalAttribute(replacement, 'replacement');
		calculate(replacement, 'replacement');
		calculateMinorDPS('replacement');
		
		// Setting
		for(var index = 1;index <= 5;index++)
			$('#setting .' + index).val(getCookie('equip' + index));
		
		$('#setting textarea').change(function() {
			var key = $(this).attr('class');
			var data = Base64.decode($(this).val());

			if(typeof(JSON.parse(data)) == 'object') {
				setCookie('equip' + key, $(this).val());

				if(getCookie('order') == key) {
					based = JSON.parse(Base64.decode(getCookie('equip' + key)));
					
					// Based
					reset(based, 'based');
					totalAttribute(based, 'based');
					calculate(based, 'based');
					calculateMinorDPS('based');
					
					// Replacement
					createDiffReplacement();
					reset(temp, 'replacement');
					totalAttribute(replacement, 'replacement');
					calculate(replacement, 'replacement');
					calculateMinorDPS('replacement');
				}
			}
		});

		// If User change character profile
		$('#equip .based .order').change(function() {
			setCookie('order', $(this).val());
			
			based = JSON.parse(Base64.decode(getCookie('equip' + getCookie('order'))));

			// Based
			reset(based, 'based');
			totalAttribute(based, 'based');
			calculate(based, 'based');
			calculateMinorDPS('based');
			
			// Replacement
			createDiffReplacement();
			reset(temp, 'replacement');
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
			calculateMinorDPS('replacement');
		});
		
		$('#equip .replacement .order').change(function() {
			if($(this).val() == 0) {
				temp = JSON.parse(template);
				diff_equip = {
					skill: false,
					belt: false,
					boots: false,
					braces: false,
					chest: false,
					glovers: false,
					helm: false,
					pants: false,
					shoulders: false,
					amulet: false,
					ring_1: false,
					ring_2: false,
					weapon_1: false,
					weapon_2: false
				};
			}
			else {
				temp = JSON.parse(Base64.decode(getCookie('equip' + $(this).val())));
			}
			
			createDiffReplacement();
			reset(temp, 'replacement');
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
			calculateMinorDPS('replacement');
		});

		// Based
		$('#based .skill input').change(function() {
			var key = $(this).attr('class');
			
			based['skill'][key] = parseFloat($(this).val());
			$(this).val(based['skill'][key]);
			based['skill'][key] = $(this).val();
	
			if(based['skill'][key] == 'NaN' || based['skill'][key] < 0)
				based['skill'][key] = 0;
	
			$(this).val(based['skill'][key]);

			setCookie('equip' + getCookie('order'), Base64.encode(JSON.stringify(based)));

			// Based
			reset(based, 'based');
			totalAttribute(based, 'based');
			calculate(based, 'based');
			calculateMinorDPS('based');
			
			// Replacement
			createDiffReplacement();
			reset(temp, 'replacement');
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
			calculateMinorDPS('replacement');
		});
	
		$('#equip .based input').change(function() {
			var key1 = $(this).parent().parent().attr('class');
			var key2 = $(this).attr('class');
			
			based[key1][key2] = parseFloat($(this).val());
			$(this).val(based[key1][key2]);
			based[key1][key2] = $(this).val();
	
			if(based[key1][key2] == 'NaN' || based[key1][key2] < 0)
				based[key1][key2] = 0;
	
			$(this).val(based[key1][key2]);
		
			setCookie('equip' + getCookie('order'), Base64.encode(JSON.stringify(based)));
	
			// Based
			reset(based, 'based');
			totalAttribute(based, 'based');
			calculate(based, 'based');
			calculateMinorDPS('based');
			
			// Replacement
			createDiffReplacement();
			reset(temp, 'replacement');
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
			calculateMinorDPS('replacement');
		});

		// Replacement
		$('#replacement .skill input').change(function() {
			var key = $(this).attr('class');
			
			temp['skill'][key] = parseFloat($(this).val());
			$(this).val(temp['skill'][key]);
			temp['skill'][key] = $(this).val();
	
			if(temp['skill'][key] == 'NaN' || temp['skill'][key] < 0)
				temp['skill'][key] = 0;
	
			$(this).val(temp['skill'][key]);
			
			diff_equip['skill'] = false;
			$.each($('#replacement .skill input'), function() {
				if(parseFloat($(this).val()) > 0)
					diff_equip['skill'] = true;
			});
			
			// Replacement
			createDiffReplacement();
			reset(temp, 'replacement');
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
			calculateMinorDPS('replacement');
		});

		$('#equip .replacement input').change(function() {
			var key1 = $(this).parent().parent().attr('class');
			var key2 = $(this).attr('class');
			
			temp[key1][key2] = parseFloat($(this).val());
			$(this).val(temp[key1][key2]);
			temp[key1][key2] = $(this).val();
	
			if(temp[key1][key2] == 'NaN' || temp[key1][key2] < 0)
				temp[key1][key2] = 0;
	
			$(this).val(temp[key1][key2]);
			
			diff_equip[key1] = false;
			$.each($('#equip .replacement .' + key1 + ' input'), function() {
				if(parseFloat($(this).val()) > 0)
					diff_equip[key1] = true;
			});
			
			// Replacement
			createDiffReplacement();
			reset(temp, 'replacement');
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
			calculateMinorDPS('replacement');
		});
	});
	
	// Find difference
	function createDiffReplacement() {
		if($('#equip .replacement .order').val() == 0) {
			replacement = JSON.parse(template);
			$.each(diff_equip, function(key, value) {
				if(value) {
					replacement[key] = temp[key];
				}
				else {
					replacement[key] = based[key];
				}
			});
		}
		else {
			replacement = temp;
		}
	}

	function totalAttribute(data, target) {
		var total = {
			main_attribute: 0,
			attack_speed: 0,
			critical_chance: 0,
			critical_damage: 0,
			min_damage: 0,
			max_damage: 0
		};
		
		$.each(data, function(key, value) {
			if(key != 'skill')
				$.each(value, function(key2, value2) {
					total[key2] += parseFloat(value2);
				});
		});
		
		$('#' + target + ' .total .main_attribute').val(total['main_attribute']);
		$('#' + target + ' .total .attack_speed').val(total['attack_speed']);
		$('#' + target + ' .total .critical_chance').val(total['critical_chance']);
		$('#' + target + ' .total .critical_damage').val(total['critical_damage']);
		$('#' + target + ' .total .min_damage').val(total['min_damage']);
		$('#' + target + ' .total .max_damage').val(total['max_damage']);
	}

	function calculateMinorDPS(target) {
		$('#equip .' + target + ' .minor_dps').text(0);
		
		$.each($('#equip .' + target + ' > div'), function() {
			var key = $(this).attr('class');
			
			var break_loop = false;
			if($('#equip .replacement .order').val() == 0 && !diff_equip[key] && target == 'replacement')
				break_loop = true;
				
			if(key != 'weapon_1' && key != 'weapon_2' && !break_loop) {
				var total = {
					main_attribute: parseFloat($('#' + target + ' .attribute .main_attribute').val()),
					critical_chance: parseFloat($('#' + target + ' .attribute .critical_chance').val()),
					critical_damage: parseFloat($('#' + target + ' .attribute .critical_damage').val()),
					attack_speed: parseFloat($('#' + target + ' .total .attack_speed').val()),
					min_damage: parseFloat($('#' + target + ' .total .min_damage').val()),
					max_damage: parseFloat($('#' + target + ' .total .max_damage').val())
				};
				
				$.each($('#equip .' + target + ' .' + key + ' input'), function() {
					total[$(this).attr('class')] -= parseFloat($(this).val());
				});
				
				if($('#equip .replacement .order').val() == 0 && !diff_equip['weapon_1'] && target == 'replacement') {
					var weapon_attack_per_second_1 = parseFloat($('#equip .based .weapon_attack_per_second_1').val());
					var weapon_min_damage_1 = parseFloat($('#equip .based .weapon_min_damage_1').val());
					var weapon_max_damage_1 = parseFloat($('#equip .based .weapon_max_damage_1').val());
				}
				else {
					var weapon_attack_per_second_1 = parseFloat($('#equip .' + target + ' .weapon_attack_per_second_1').val());
					var weapon_min_damage_1 = parseFloat($('#equip .' + target + ' .weapon_min_damage_1').val());
					var weapon_max_damage_1 = parseFloat($('#equip .' + target + ' .weapon_max_damage_1').val());
				}
				
				if($('#equip .replacement .order').val() == 0 && !diff_equip['weapon_2'] && target == 'replacement') {
					var weapon_attack_per_second_2 = parseFloat($('#equip .based .weapon_attack_per_second_2').val());
					var weapon_min_damage_2 = parseFloat($('#equip .based .weapon_min_damage_2').val());
					var weapon_max_damage_2 = parseFloat($('#equip .based .weapon_max_damage_2').val());
				}
				else {
					var weapon_attack_per_second_2 = parseFloat($('#equip .' + target + ' .weapon_attack_per_second_2').val());
					var weapon_min_damage_2 = parseFloat($('#equip .' + target + ' .weapon_min_damage_2').val());
					var weapon_max_damage_2 = parseFloat($('#equip .' + target + ' .weapon_max_damage_2').val());
				}
				
				var main_attribute = total['main_attribute'];
				var critical_chance = total['critical_chance'];
				var critical_damage = total['critical_damage'];
				var attack_speed = total['attack_speed'];
				var min_damage = total['min_damage'];
				var max_damage = total['max_damage'];
				
				var attack_per_second_1 = weapon_attack_per_second_1 * (attack_speed / 100 + 1);
				var attack_per_second_2 = weapon_attack_per_second_2 * (attack_speed / 100 + 1);
		
				if(attack_per_second_2 != 0)
					var average_aps = (attack_per_second_1 + attack_per_second_2) / 2;
				else
					var average_aps = attack_per_second_1;
				
				if(average_aps == 0)
					average_aps = 1;
				
				// Skill bonus damage
				if($('#equip .replacement .order').val() == 0 && !diff_equip['skill'] && target == 'replacement')
					var skill_damage = parseFloat($('#based .skill .damage').val());
				else
					var skill_damage = parseFloat($('#' + target + ' .skill .damage').val());
					
				var dps = parseFloat($('#' + target + ' .attribute .damage_per_second').val());
				
				// Damage per second
				var minor_dps = (weapon_min_damage_1 + weapon_max_damage_1 + weapon_min_damage_2 + weapon_max_damage_2) / 2;
				minor_dps += (min_damage + max_damage) / 2;
				minor_dps *= average_aps;
				minor_dps *= main_attribute / 100 + 1;
				minor_dps *= (critical_chance * critical_damage / 10000) + 1;
				minor_dps *= skill_damage / 100 + 1;
				minor_dps = dps - minor_dps;
				minor_dps = parseInt(minor_dps, 10);
				
				$('#equip .' + target + ' .' + key + ' .minor_dps').text(minor_dps + ' DPS');
			}
		});
	}

	function calculate(data, target) {
		var main_attribute = parseFloat($('#' + target + ' .total .main_attribute').val());
		main_attribute += parseFloat(default_point['main_attribute']);
		
		var critical_chance = parseFloat($('#' + target + ' .total .critical_chance').val());
		critical_chance += parseFloat(data['skill']['critical_chance']);
		critical_chance += default_point['critical_chance'];
		
		var critical_damage = parseFloat($('#' + target + ' .total .critical_damage').val());
		critical_damage += parseFloat(data['skill']['critical_damage']);
		critical_damage += default_point['critical_damage'];
		
		var attack_speed = parseFloat($('#' + target + ' .total .attack_speed').val());
		var min_damage = parseFloat($('#' + target + ' .total .min_damage').val());
		var max_damage = parseFloat($('#' + target + ' .total .max_damage').val());
		
		// Display attribute
		$('#' + target + ' .attribute .main_attribute').val(main_attribute);
		$('#' + target + ' .attribute .critical_chance').val(critical_chance);
		$('#' + target + ' .attribute .critical_damage').val(critical_damage);
		
		// Weapon data
		var weapon_attack_per_second_1 = 0;
		var weapon_min_damage_1 = 0;
		var weapon_max_damage_1 = 0;
		
		if(data['weapon_1']['weapon_attack_per_second_1'] != undefined)
			weapon_attack_per_second_1 = parseFloat(data['weapon_1']['weapon_attack_per_second_1']);
		if(data['weapon_1']['weapon_min_damage_1'] != undefined)
			weapon_min_damage_1 = parseFloat(data['weapon_1']['weapon_min_damage_1']);
		if(data['weapon_1']['weapon_max_damage_1'] != undefined)
			weapon_max_damage_1 = parseFloat(data['weapon_1']['weapon_max_damage_1']);
		
		var weapon_attack_per_second_2 = 0;
		var weapon_min_damage_2 = 0;
		var weapon_max_damage_2 = 0;
		
		if(data['weapon_2']['weapon_attack_per_second_2'] != undefined)
			weapon_attack_per_second_2 = parseFloat(data['weapon_2']['weapon_attack_per_second_2']);
		if(data['weapon_2']['weapon_min_damage_2'] != undefined)
			weapon_min_damage_2 = parseFloat(data['weapon_2']['weapon_min_damage_2']);
		if(data['weapon_2']['weapon_max_damage_2'] != undefined)
			weapon_max_damage_2 = parseFloat(data['weapon_2']['weapon_max_damage_2']);

		var attack_per_second_1 = weapon_attack_per_second_1 * (attack_speed / 100 + 1);
		var attack_per_second_2 = weapon_attack_per_second_2 * (attack_speed / 100 + 1);

		if(attack_per_second_2 != 0)
			var average_aps = (attack_per_second_1 + attack_per_second_2) / 2;
		else
			var average_aps = attack_per_second_1;
		
		if(average_aps == 0)
			average_aps = 1;
		
		// Display Aps
		$('#' + target + ' .attribute .attack_per_second').val(parseInt(average_aps * 100) / 100);
		
		// Skill bonus damage
		var skill_damage = parseFloat(data['skill']['damage']);
		
		// Damage per second
		var dps = (weapon_min_damage_1 + weapon_max_damage_1 + weapon_min_damage_2 + weapon_max_damage_2) / 2;
		dps += (min_damage + max_damage) / 2;
		dps *= average_aps;
		dps *= main_attribute / 100 + 1;
		dps *= (critical_chance * critical_damage / 10000) + 1;
		dps *= skill_damage / 100 + 1;
		dps = parseInt(dps * 100) / 100;
	
		// Normal damage range
		var min_normal_damage = (weapon_min_damage_1 + weapon_min_damage_2) / 2;
		min_normal_damage += min_damage / 2;
		min_normal_damage *= main_attribute / 100 + 1;
		min_normal_damage *= skill_damage / 100 + 1;
		min_normal_damage = parseInt(min_normal_damage * 100) / 100;
		
		var max_normal_damage = (weapon_max_damage_1 + weapon_max_damage_2) / 2;
		max_normal_damage += max_damage / 2;
		max_normal_damage *= main_attribute / 100 + 1;
		max_normal_damage *= skill_damage / 100 + 1;
		max_normal_damage = parseInt(max_normal_damage * 100) / 100;
		
		// Critical damage range
		var min_critical_damage = (weapon_min_damage_1 + weapon_min_damage_2) / 2;
		min_critical_damage += min_damage / 2;
		min_critical_damage *= main_attribute / 100 + 1;
		min_critical_damage *= critical_damage / 100 + 1;
		min_critical_damage *= skill_damage / 100 + 1;
		min_critical_damage = parseInt(min_critical_damage * 100) / 100;
		
		var max_critical_damage = (weapon_max_damage_1 + weapon_max_damage_2) / 2;
		max_critical_damage += max_damage / 2;
		max_critical_damage *= main_attribute / 100 + 1;
		max_critical_damage *= critical_damage / 100 + 1;
		max_critical_damage *= skill_damage / 100 + 1;
		max_critical_damage = parseInt(max_critical_damage * 100) / 100;

		// Display attribute
		$('#' + target + ' .attribute .damage_per_second').val(dps);
		$('#' + target + ' .attribute .normal_damage_range').val(min_normal_damage + ' - ' + max_normal_damage);
		$('#' + target + ' .attribute .critical_damage_range').val(min_critical_damage + ' - ' + max_critical_damage);
	}
});
