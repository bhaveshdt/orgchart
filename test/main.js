'use strict';
$(document).ready(
	function () {
	var familyTree = new OrgChart({
			data : [[1, 2, 3, 'Bhavesh'], [18, 1, 22, 'B-baby'], [3, null, null, 'Mrudula'], [4, null, null, 'Ketan'], [5, 2, 3, 'Jinisha'], [6, 4, 5, 'Rina'],
				[7, 4, 5, 'Neha'], [8, 4, 5, 'Ritika'], [9, 19, null, 'Naranji'], [2, 9, 21, 'Dilip'], [10, 9, 21, 'Jaman'], [11, 9, 21, 'Hemalatha'],
				[12, 9, 21, 'Kala'], [14, 11, null, 'Dharmesh'], [13, 11, null, 'Raju'], [15, 11, null, 'Dinesh'], [16, 13, null, 'Bhavini'],
				[17, 13, null, 'Tina'], [19, null, null, 'N_Father'], [20, 19, null, 'N_Brother'], [21, null, null, 'Zaver'], [22, null, null, 'Neha Mami'],
				[24, 16, null, 'Bhavini Baby']],
			id : 'family',
			margin : 20,
			elHeight : 40,
			elWidth : 100,
			createNodeElement : function (member) {
				var el = document.createElement('div');
				$(el).html(member[3] + '(' + member[0] + ')');
				return el;
			}
		});
	var createTree = function () {
		familyTree.create($('#showTreeInput').val(), $('input[name="orientation"]:checked').val());
		$('#showTreeInput').select();
	};
	$('#showTreeInput').change(createTree);
	$('input[name="orientation"]').click(createTree);
	$('#showTreeInput').change();
});
