'use strict';

var data = [
	[1, 2, 3, '111 Child'],
	[2, 9, 21, '11 Child'],
	[3, null, null, '11 Child Spouse'],
	[4, null, null, '112 Child Spouse'],
	[5, 2, 3, '112 Child'],
	[6, 4, 5, '1121 Child'],
	[7, 4, 5, '1122 Child'],
	[8, 4, 5, '1123 Child'],
	[9, 19, null, '1 Child'],
	[10, 9, 21, '112 Child'],
	[11, 9, 21, '113 Child'],
	[12, 9, 21, '114 Child'],
	[13, 11, null, '1132 Child'],
	[14, 11, null, '1131 Child'],
	[15, 11, null, '1133 Child'],
	[16, 13, null, '11321 Child'],
	[17, 13, null, '11322 Child'],
	[18, 1, 22, '1111 Child'],
	[19, null, null, 'Root'],
	[20, 19, null, 'Root Sibling'],
	[21, null, null, '1 Child Spouse'],
	[22, null, null, '111 Child Spouse'],
	[23, 16, null, '113211 Child']
];


// Instantiate Chart Test Object
var chart = new OrgChart({
	data: data,
	id: 'family',
	margin: 20,
	elHeight: 40,
	elWidth: 100,
	createNodeElement: function(member) {
		var el = document.createElement('div');
		$(el).html(member[3] + '(' + member[0] + ')');
		return el;
	}
});

// Run Tests
(function() {
	describe('OrgChart', function() {
		describe('#create()', function() {
			// Test Executor Function
			var testCreateChartOnAllMembersByOrientation = function(orientation) {
				for (var m, i = 0;
					(m = data[i]); i++) {
					(function(m) {
						it('test for member=[' + m[3] + '] with orientation=[' + orientation + ']', function() {
							chart.create(m[0], orientation);
						});
					})(m);
				}
			};
			// Test with horizontal orientation
			testCreateChartOnAllMembersByOrientation('horizontal');
			// Test with vertical orientation
			testCreateChartOnAllMembersByOrientation('vertical');
		});
	});
})();