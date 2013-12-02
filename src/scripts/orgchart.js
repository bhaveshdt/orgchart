/*
TODO
- test cases
- modularize
  - inject dependencies
  - de-couple
  - jQuery (done)
  - de-couple logging
- optimize
  - cache array length
  - equality operator
  - remove jquery as a dependency
- clean-up
  - comments
  - hard-coded constants
 */
'use strict';
/**
 * Accessor for member data passed into the OrgChart
 */

function TreeDataManager(rawData) {
	var self = this;
	var data = (function(rawData) {
		var members = {};
		var parents = {};

		function makeParents(child, parentId1, parentId2) {
			function make(parentId, child) {
				var p = parents[parentId];
				if (!p) {
					p = parents[parentId] = [];
				}
				p.push(child);
			}
			make(parentId1, child);
			make(parentId2, child);
		}
		for (var i = 0, d;
			(d = rawData[i]); i++) {
			makeParents(d, d[1], d[2]);
			members[d[0]] = d;
		}
		return {
			parents: parents,
			members: members
		};
	})(rawData);
	this.findTreeDimensions = function(id) {
		var dimensions = {
			ancestor: {
				width: findTreeWidth(id, true),
				height: findTreeHeight(id, true)
			},
			descendant: {
				width: findTreeWidth(id, false),
				height: findTreeHeight(id, false)
			},
		};
		dimensions.total = {
			width: Math.max(dimensions.ancestor.width, dimensions.descendant.width),
			height: dimensions.ancestor.height + dimensions.descendant.height - 1 // -1 because the root is present twice for each tree
		};
		//console.log('Dimensions: ' + JSON.stringify(dimensions));
		return dimensions;
	};
	var findTreeHeight = function(rootId, isAncestorMode) {
		var getNodes = isAncestorMode ? function(m) {
				return self.getParents(m);
			} : function(m) {
				return self.getChildren(m);
			};
		var doFindTreeHeight = function(member) {
			var max = 0;
			var children = getNodes(member);
			for (var i = 0; children && i < children.length; i++) {
				max = Math.max(max, doFindTreeHeight(children[i]));
			}
			return max + 1;
		};
		return doFindTreeHeight(self.getMember(rootId));
	};
	var findTreeWidth = function(rootMemberId, isAncestorMode) {
		var getNodes = isAncestorMode ? function(m) {
				return self.getParents(m);
			} : function(m) {
				return self.getChildren(m);
			};
		var maxSpan = 0;
		var elevator = isAncestorMode ? -1 : 1;
		var doTraverseTree = function(member, plevel, slevel) {
			var children = getNodes(member);
			var isleaf = (!children || children.length === 0);
			var span = 0;
			if (!isleaf) {
				for (var idx = 0, c;
					(c = children[idx]); idx++) {
					span += doTraverseTree(c, (plevel + elevator), span + slevel);
				}
			}
			span = isleaf ? 1 : span;
			maxSpan = Math.max(maxSpan, span);
			return span;
		};
		doTraverseTree(self.getMember(rootMemberId), 0, 0);
		return maxSpan;
	};
	this.getMember = function(id) {
		return data.members[id];
	};
	this.getChildren = function(m) {
		return data.parents[m[0]];
	};
	this.getParents = function(m) {
		return [data.members[m[1]], data.members[m[2]]].filter(Boolean);
	};
}
var DomAccessor = (function($$, wnd, doc) {
	return {
		addClass: function(el, className) {
			$$(el).addClass(className);
		},
		setAttr: function(el, attr, val) {
			$$(el).attr(attr, val);
		},
		createEl: function(elName, id, style) {
			var el = doc.createElement(elName);
			$$(el).attr('id', id);
			$$(el).attr('style', style);
			return el;
		},
		append: function(container, el) {
			$$(container).append(el);
		},
		width: function(container, width) {
			return (width ? $$(container).width(width) : $$(container).width());
		},
		height: function(container, height) {
			return (height ? $$(container).height(height) : $$(container).height());
		},
		byId: function(id) {
			return doc.getElementById(id);
		},
		removeClass: function(el) {
			$$(el).removeClass();
		},
		css: function(el, attr, val) {
			$$(el).css(attr, val);
		}
	};
})(jQuery, window, document);

/**
 * Draws the lines connecting the nodes of the tree
 */

function TreeCanvasDrawer(container, containerHeight, containerWidth, treeContext) {
	var self = this;
	var canvasContext;
	var topMid = function(point) {
		return {
			x: point.left + (treeContext.elWidth / 2),
			y: point.top
		};
	};
	var bottomMid = function(point) { // TODO "top+2"
		return {
			x: point.left + (treeContext.elWidth / 2),
			y: point.top + treeContext.elHeight + 2
		};
	};
	var leftMid = function(point) {
		return {
			x: point.left,
			y: point.top + (treeContext.elHeight / 2)
		};
	};
	var rightMid = function(point) { // TODO "left+2"
		return {
			x: point.left + (treeContext.elWidth) + 2,
			y: point.top + (treeContext.elHeight / 2)
		};
	};
	this.drawForVertical = function(parentPoint, childPoints, isAncestorTree) {
		self.drawLines(parentPoint, childPoints, isAncestorTree ? topMid : bottomMid, isAncestorTree ? bottomMid : topMid);
	};
	this.drawForHorizontal = function(parentPoint, childPoints, isAncestorTree) {
		self.drawLines(parentPoint, childPoints, isAncestorTree ? leftMid : rightMid, isAncestorTree ? rightMid : leftMid);
	};
	this.drawLines = function(parentPoint, childPoints, parentMidFunc, childMidFunc) {
		var from = parentMidFunc(parentPoint);
		for (var i = 0; childPoints && i < childPoints.length; i++) {
			var to = childMidFunc(childPoints[i]);
			canvasContext.moveTo(from.x, from.y); //parent
			canvasContext.lineTo(to.x, to.y); //child
			//console.log('\tdrawing: ', JSON.stringify([from, to]));
		}
		canvasContext.stroke();
	};
	this.draw = (treeContext.isVerticalOrientation) ? self.drawForVertical : self.drawForHorizontal;
	var initCanvas = function() {
		var canvasElement = DomAccessor.createEl('canvas');
		DomAccessor.append(container, canvasElement);
		canvasContext = canvasElement.getContext('2d');
		canvasElement.width = containerWidth;
		canvasElement.height = containerHeight;
		DomAccessor.width(container, containerWidth);
		DomAccessor.height(container, containerHeight);
	};
	initCanvas();
}
/**
 * Calculates the position of the nodes in an absolutely positioned container
 */

function PositionCalculator(treeContext) {
	this.getContainerDimensions = function(treeDimensions) {
		//console.log(treeContext.isVerticalOrientation, treeDimensions.width, treeDimensions.height, treeContext.margin, treeContext.elWidth);
		var containerDimensions = {
			'width': (treeContext.isVerticalOrientation ? treeDimensions.width : treeDimensions.height - 1) * (treeContext.margin + treeContext.elWidth),
			'height': (treeContext.isVerticalOrientation ? treeDimensions.height - 1 : treeDimensions.width) * (treeContext.margin + treeContext.elHeight)
		};
		//console.log('Container containerDimensions (' + (treeContext.isVerticalOrientation ? 'vertical' : 'horizontal') + '): ' + JSON.stringify(containerDimensions));
		return containerDimensions;
	};

	function evaluateForHorizontalTree(el, plevel, slevel, isleaf, firstChild, lastChild, elevator, treeDimensions) {
		var fromtop = slevel * (treeContext.elHeight + treeContext.margin);
		var center = (lastChild.position.top - firstChild.position.top) / 2;
		var topVal = (center + firstChild.position.top) + (isleaf ? fromtop : 0);
		var leftVal = (plevel * (treeContext.elWidth + treeContext.margin));
		return {
			top: topVal,
			left: leftVal + (elevator === 1 ? 0 : ((treeDimensions.height * (treeContext.elWidth + treeContext.margin))) - (treeContext.elWidth + treeContext.margin))
		};
	}

	function evaluateForVerticalTree(el, plevel, slevel, isleaf, firstChild, lastChild, elevator, treeDimensions) {
		var indent = slevel * (treeContext.elWidth + treeContext.margin);
		var center = (lastChild.position.left - firstChild.position.left) / 2;
		var topVal = (plevel * (treeContext.elHeight + treeContext.margin));
		var leftVal = (center + firstChild.position.left) + (isleaf ? indent : 0);
		return {
			top: topVal + (elevator === 1 ? 0 : ((treeDimensions.height * (treeContext.elHeight + treeContext.margin))) - (treeContext.elHeight + treeContext.margin)),
			left: leftVal
		};
	}
	this.evaluatePosition = function() {
		return treeContext.isVerticalOrientation ? evaluateForVerticalTree : evaluateForHorizontalTree;
	};
}
/**
 * Initialize the data manager, create, position and connect nodes via Canvas and adjust height/width of the container
 */
/*jshint unused:false*/

function OrgChart(context, undefined) {
	var dataManager = new TreeDataManager(context.data);
	this.create = function(memberId, orientation) {
		function reset(rootEl) {
			DomAccessor.removeClass(rootEl);
			rootEl.innerHTML = '';
			DomAccessor.setAttr(rootEl, 'style', '');
			DomAccessor.addClass(rootEl, 'tree');
		}

		function prepareContext(isAncestor, rootOnly) {
			return {
				id: context.id + (rootOnly ? '-root' : (isAncestor ? '-ancestors' : '-descendants')),
				rootMember: dataManager.getMember(memberId),
				elevator: isAncestor ? -1 : 1,
				getChildNodes: rootOnly ? dataManager.getMember : (isAncestor ? dataManager.getParents : dataManager.getChildren),
				dimensions: rootOnly ? {
					top: 1,
					left: 1
				} : isAncestor ? treeDimensions.ancestor : treeDimensions.descendant
			};
		}

		function adjustHeight(treeContainer, ancestorRoot, descendantRoot, root, isVerticalOrientation) {
			function get(condition, one, other) {
				return {
					target: condition ? one : other,
					other: condition ? other : one
				};
			}
			DomAccessor.append(root.container, descendantRoot.el);
			var property = get(isVerticalOrientation, 'left', 'top');
			var attribute = get(isVerticalOrientation, 'height', 'width');
			var descendantContainerAdjustment = get(isVerticalOrientation, DomAccessor.height(descendantRoot.container)+context.elHeight, DomAccessor.width(descendantRoot.container)+context.elWidth);
			var ancestorValue = ancestorRoot.position[property.target];
			var descendantValue = descendantRoot.position[property.target];
			var value = get(ancestorValue < descendantValue, ancestorValue, descendantValue);
			var element = get(ancestorValue < descendantValue, ancestorRoot.container, descendantRoot.container);
			//console.log(JSON.stringify([property.target, ancestorValue, descendantValue]));
			DomAccessor.css(element.target, property.target, Math.abs(ancestorValue - descendantValue));
			DomAccessor.css(descendantRoot.container, attribute.target, descendantContainerAdjustment.target);
			DomAccessor.css(root.el, property.target, value.target);
			DomAccessor.css(root.container, property.target, Math.abs(ancestorValue - descendantValue));
		}

		reset(DomAccessor.byId(context.id));
		context.isVerticalOrientation = (orientation === 'vertical');
		var treeDimensions = dataManager.findTreeDimensions(memberId);
		//console.log('CREATE TREE -------------------------------------------------------------');
		var ancestorRoot = new TreeCreator(DomAccessor.byId(context.id), context.createNodeElement, prepareContext(true), 0, 0);
		var root = new TreeCreator(DomAccessor.byId(context.id), context.createNodeElement, prepareContext(false, true), 0, 0, ancestorRoot.el);
		var descendantRoot = new TreeCreator(DomAccessor.byId(context.id), context.createNodeElement, prepareContext(false), 0, 0, root.el);
		adjustHeight(DomAccessor.byId(context.id), ancestorRoot, descendantRoot, root, context.isVerticalOrientation);

	};
	/**
	 * Iterate through the ancestors and descendants and create and position the nodes
	 */

	function TreeCreator(rootEl, nodeCreator, creatorContext, plevel, slevel, el) {
		function create(plevel, slevel, el) {
			//console.log(JSON.stringify(creatorContext.rootMember));
			DomAccessor.append(rootEl, containerEl = DomAccessor.createEl('div', creatorContext.id, 'float:left;position:relative;' + (context.isVerticalOrientation ? 'clear:both;' : '')));
			treeCanvasDrawer = new TreeCanvasDrawer(containerEl, containerDimensions.height, containerDimensions.width, context);
			return doCreateNodeTree(creatorContext.rootMember, plevel, slevel, el ? appendNodeWithEl(creatorContext.rootMember, el) : appendNode(creatorContext.rootMember));
		}

		function doCreateNodeTree(m, plevel, slevel, el) {
			var children = creatorContext.getChildNodes(m);
			var isleaf = (!children || children.length === 0);
			var initializeDimension = function() {
				return {
					position: {
						left: 0,
						top: 0
					}
				};
			};
			var span = (isleaf ? 1 : 0),
				firstChild = initializeDimension(),
				lastChild = initializeDimension();
			var childrenPositions = [];
			if (!isleaf) {
				for (var idx = 0, c;
					(c = children[idx]); idx++) {
					span += (lastChild = doCreateNodeTree(c, (plevel + creatorContext.elevator), span + slevel, appendNode(c))).span;
					childrenPositions.push(lastChild.position);
					if (idx === 0) {
						firstChild = lastChild;
					}
				}
			}
			var position = positionCalculator.evaluatePosition()(el, plevel, slevel, isleaf, firstChild, lastChild, creatorContext.elevator, creatorContext.dimensions); // update coordiantes
			el.style.top = position.top + 'px';
			el.style.left = position.left + 'px';
			//console.log('Draw Position: ' + JSON.stringify([m, position, childrenPositions]));
			treeCanvasDrawer.draw(position, childrenPositions, (creatorContext.elevator === -1));

			return {
				el: el,
				span: span,
				position: position
			};
		}

		function appendNode(m) {
			return appendNodeWithEl(m, nodeCreator(m));
		}

		function appendNodeWithEl(m, el) {
			DomAccessor.append(containerEl, el);
			DomAccessor.setAttr(el, 'id', context.id + m[0]);
			DomAccessor.addClass(el, 'member');
			return el;
		}

		var containerEl;
		var treeCanvasDrawer;
		var positionCalculator = new PositionCalculator(context);
		var containerDimensions = positionCalculator.getContainerDimensions(creatorContext.dimensions);
		var result = create(plevel, slevel, el);
		result.container = containerEl;
		return result;
	}
}

(function() {
	return OrgChart;
})();