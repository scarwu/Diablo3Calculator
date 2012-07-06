// JavaScript Document
'use strict';

$(function() {
	var character = getCookie('character');
	var order = 1;
	var based = {
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
	};
	var replacement = {
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
	};
	var temp = {
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
	};
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
	}

	// Load Profile
	function loadProfile() {
		if(character == null) {
			character = {
				order: 1,
				1: based,
				2: based,
				3: based,
				4: based,
				5: based
			};
		}
		else
			character = JSON.parse(Base64.decode(character));
	}

	// Svae Profile
	function saveProfile() {
		character['order'] = order;
		character[order] = based;
		
		setCookie('character', Base64.encode(JSON.stringify(character)));
	}

	// Reset
	function reset() {
		// Set selected character
		$('.character .order').val(order);
		
		// Reset field
		$('input').val(0);

		// Set default point
		$.each(default_point, function(key, value) {
			$('#based .attribute .' + key).val(value);
		});
		
		// Set character data
		$.each(based, function(key, value) {
			$.each(value, function(key2, value2) {
				if(key == 'skill')
					$('#based .skill .' + key2).val(value2);
				else
					$('#equip .based .' + key + ' .' + key2).val(value2);
			});
		});
	}
	
	function l(input) {
		console.log(JSON.stringify(input));
	}
	
	$(document).ready(function() {
		// Load Data
		loadProfile();
		
		// Load
		order = character['order'];
		based = character[order];
		
		reset();
		totalAttribute(based, 'based');
		diff();
		totalAttribute(replacement, 'replacement');
		calculate(based, 'based');
		calculate(replacement, 'replacement');

		// If User change character profile
		$('.character .order').change(function() {
			order = $(this).val();
			based = character[order];
			
			// Reset Profile
			reset();
			totalAttribute(based, 'based');
			diff();
			totalAttribute(replacement, 'replacement');
			calculate(based, 'based');
			calculate(replacement, 'replacement');
			
			// Save data
			saveProfile();
		});

		// Based
		$('#based .skill input').change(function() {
			var key = $(this).attr('class');
			
			based['skill'][key] = parseFloat($(this).val());
			$(this).val(based['skill'][key]);
			based['skill'][key] = $(this).val();
	
			if(based['skill'][key] == 'NaN')
				based['skill'][key] = 0;
	
			if(based['skill'][key] < 0)
				based['skill'][key] = 0;
	
			$(this).val(based['skill'][key]);
	
			saveProfile();
			diff();
			calculate(based, 'based');
			calculate(replacement, 'replacement');
		});
	
		$('#equip .based input').change(function() {
			var key1 = $(this).parent().parent().attr('class');
			var key2 = $(this).attr('class');
			
			based[key1][key2] = parseFloat($(this).val());
			$(this).val(based[key1][key2]);
			based[key1][key2] = $(this).val();
	
			if(based[key1][key2] == 'NaN')
				based[key1][key2] = 0;
	
			if(based[key1][key2] < 0)
				based[key1][key2] = 0;
	
			$(this).val(based[key1][key2]);
	
			saveProfile();
			totalAttribute(based, 'based');
			diff();
			totalAttribute(replacement, 'replacement');
			calculate(based, 'based');
			calculate(replacement, 'replacement');
		});

		// Replacement
		$('#replacement .skill input').change(function() {
			var key = $(this).attr('class');
			
			temp['skill'][key] = parseFloat($(this).val());
			$(this).val(temp['skill'][key]);
			temp['skill'][key] = $(this).val();
	
			if(temp['skill'][key] == 'NaN')
				temp['skill'][key] = 0;
	
			if(temp['skill'][key] < 0)
				temp['skill'][key] = 0;
	
			$(this).val(temp['skill'][key]);
			
			diff_equip['skill'] = false;
			$.each($('#replacement .skill input'), function() {
				if(parseFloat($(this).val()) > 0)
					diff_equip['skill'] = true;
			});
			
			diff();
			calculate(replacement, 'replacement');
		});

		$('#equip .replacement input').change(function() {
			var key1 = $(this).parent().parent().attr('class');
			var key2 = $(this).attr('class');
			
			temp[key1][key2] = parseFloat($(this).val());
			$(this).val(temp[key1][key2]);
			temp[key1][key2] = $(this).val();
	
			if(temp[key1][key2] == 'NaN')
				temp[key1][key2] = 0;
	
			if(temp[key1][key2] < 0)
				temp[key1][key2] = 0;
	
			$(this).val(temp[key1][key2]);
			
			diff_equip[key1] = false;
			$.each($('#equip .replacement .' + key1 + ' input'), function() {
				if(parseFloat($(this).val()) > 0)
					diff_equip[key1] = true;
			});
			
			diff();
			totalAttribute(replacement, 'replacement');
			calculate(replacement, 'replacement');
		});
	});
	
	// Find difference
	function diff() {
		replacement = {
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
		};
		$.each(diff_equip, function(key, value) {
			if(value) {
				replacement[key] = temp[key];
			}
			else {
				replacement[key] = based[key];
			}
		});
		
		// l(replacement);
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
		var weapon_attack_per_second_1 = parseFloat(data['weapon_1']['weapon_attack_per_second_1']) | 0;
		var weapon_min_damage_1 = parseFloat(data['weapon_1']['weapon_min_damage_1']) | 0;
		var weapon_max_damage_1 = parseFloat(data['weapon_1']['weapon_max_damage_1']) | 0;
		
		var weapon_attack_per_second_2 = parseFloat(data['weapon_2']['weapon_attack_per_second_2']) | 0;
		var weapon_min_damage_2 = parseFloat(data['weapon_2']['weapon_min_damage_2']) | 0;
		var weapon_max_damage_2 = parseFloat(data['weapon_2']['weapon_max_damage_2']) | 0;

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
		$('#' + target + ' .attribute .normal_damage_range').val(min_normal_damage + ' ~ ' + max_normal_damage);
		$('#' + target + ' .attribute .critical_damage_range').val(min_critical_damage + ' ~ ' + max_critical_damage);
	}
});
