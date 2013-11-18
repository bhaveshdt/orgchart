JavaScript-based Organizational Chart
========================
[![Build Status](https://travis-ci.org/bhaveshdt/orgchart.png?branch=master)](https://travis-ci.org/bhaveshdt/orgchart)

#### Summary
A data-driven Organizational Chart written in Javascript with a slight dependency on JQuery supported by the Canvas HTML5 element.

#### Live Demo
http://plnkr.co/8aDCyKdWP2DbiXakKinr

#### JavaScript and CSS
```javascript
<link rel="stylesheet" href="//raw.github.com/bhaveshdt/orgchart/master/src/styles/orgchart.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" />
<script src="//raw.github.com/bhaveshdt/orgchart/master/src/scripts/orgchart.js" />
```

#### Dom Container 
```
<div id="family" ></div>
```

#### Instantiate OrgChart 
```
var myChart = new OrgChart({
	data: data, // pass data here
	id: 'family', // id of the container element
	margin: 20, // space between node elements
	elHeight: 40, // height of a single node element
	elWidth: 100, // width of a single node element
	createNodeElement: function(member) { // function to create a single node element
		var el = document.createElement('div');
		$(el).html(member[3] + '(' + member[0] + ')');
		return el;
	}
});
```

#### Create Chart for a single member with horizontal orientation
```myChart.create(<member-id-value>, "horizontal");```

#### Create Chart for a single member with vertical orientation 
```myChart.create(<member-id-value>", "vertical");```

#### Sample Data
```
var data = [
	[1, 2, 3, '111 Child'], // [<member-id>, <parent-1-id>, <parent-2-id>, ..<any-other-data>..]
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
```

#### TO-DO
Remove dependency on JQuery
Dynamically derive node height and width based on the "node create" function (currently relies on both css/js to be in sync)
Allow more than 2 parents
Register with Bower
