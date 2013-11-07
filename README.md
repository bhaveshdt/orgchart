JavaScript-based Organizational Chart
========================
[![Build Status](https://travis-ci.org/bhaveshdt/orgchart.png?branch=master)](https://travis-ci.org/bhaveshdt/orgchart)

<link rel="stylesheet" href="//raw.github.com/bhaveshdt/orgchart/master/src/styles/orgchart.css">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="//raw.github.com/bhaveshdt/orgchart/master/src/scripts/orgchart.js"></script>

<input id="showTreeInput" type="text" value="1" />
<input type="radio" name="orientation" value="vertical" checked="checked" />
<span>Vertical</span>
<input type="radio" name="orientation" value="horizontal" />
<span>Horizontal</span>
<div id="family" ></div>

<script type="text/javascript" >
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

var createChart = function () {
	chart.create($('#showTreeInput').val(), $('input[name="orientation"]:checked').val());
	$('#showTreeInput').select();
};
$('#showTreeInput').change(createChart);
$('input[name="orientation"]').click(createChart);
$('#showTreeInput').change();
</script>
