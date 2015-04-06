function RadvizViews(el, options) {
    this.element = el;
    this.options = options;
    this.options.radius = this.options.diameter / 2;
    this.options.maxCircleRadius = this.options.radius - this.options.circleOffset;
    this.svg = null;
    this.drag = {dragging: false, element: "",group: false,originalPosition: [],originalElementsPosition: []};
    this.groups = [];
    this.numberOfGroups = 0;
    this.updateDimensions = null;

    this.init();
}

RadvizViews.prototype.setUpdateDimensions = function (updateDimensions) {
    this.updateDimensions = updateDimensions;
};

RadvizViews.prototype.getSvg = function () {
    return this.svg;
};

RadvizViews.prototype.addDimensionsGroup = function (dimensionGroup) {
    dimensionGroup.radius = this.options.maxCircleRadius - this.numberOfGroups * this.options.circleOffset;
    this.groups[dimensionGroup.id] = dimensionGroup;
    var _this = this;
    var circleEl = _this.svg.append("circle")
        .attr("class", "dimension-group dimension-group-" + dimensionGroup.id)
        .attr("data-dimension-group-id",dimensionGroup.id)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", dimensionGroup.radius)
        .style("fill", "none")
        .style("stroke", dimensionGroup.color)
        .style("stroke-width", "6")
        .style("cursor", "move")
        .on("mousedown", function () {
            _this.drag.dragging = true;
            _this.drag.group = true;
            _this.drag.originalPosition = d3.mouse(this);
            _this.drag.originalElementsPosition = [];
            d3.selectAll(".element-dimension-group-" + dimensionGroup.id).each(function (dim,idx) {
                _this.drag.originalElementsPosition[idx] = parseFloat(d3.select(this).attr("data-pos"));
            });
            _this.drag.element = "dimension-group-" + dimensionGroup.id;
            d3.selectAll(".dimension-group-" + dimensionGroup.id).classed("selected", true);
        });//mousewheel;
    this.numberOfGroups++;
};

RadvizViews.prototype.removeDimensionsGroup = function (idx) {
    idx = parseInt(idx);
    this.groups[idx] = null;
    this.numberOfGroups--;
    d3.selectAll(".dimension-group-" + idx + ",.element-dimension-group-" + idx).remove();
    var countValidCircles = 0;
    for (var i = 0; i < this.groups.length; ++i) {
        if (this.groups[i]) {
            var newRadius = this.options.maxCircleRadius - (this.options.circleOffset * countValidCircles);
            this.groups[i].radius = newRadius;
            d3.select(".dimension-group-" + i).transition().duration(600).attr("r", newRadius);
            d3.selectAll(".element-dimension-group-" + i + " circle").transition()
                .duration(600)
                .attr("cx", newRadius);
            d3.selectAll(".element-dimension-group-" + i + " text").each(function (d, i) {
                d3.select(this).transition()
                    .duration(600)
                    .attr("transform", function (d) {  return "translate(" + newRadius + ",0) rotate(" + (180 - d3.select(this).attr("data-pos")) + ") scale(-1,1)"});
            });
            countValidCircles++;
        }
    }
};

//RadvizViews.prototype.reorderGroup = function (groupId,newOrder) {
//    console.log(this.groups[groupId].dimensions);
//    var newDimArray = [];
//    var _this = this;
//    newOrder.forEach(function (item) {
//        var element = 0;
//        while (_this.groups[groupId].dimensions[element]) {
//            if (_this.groups[groupId].dimensions[element].id == item) {
//                newDimArray.push(_this.groups[groupId].dimensions[element]);
//                element = 1000;
//            }
//            element++;
//        }
//    });
//    this.groups[groupId].dimensions = newDimArray;
//
//};

RadvizViews.prototype.addDimensionToGroup = function (dimension,groupId) {
    this.groups[groupId].dimensions.push(dimension);
    this.drawDimensions(groupId);
};

RadvizViews.prototype.getDimensionPosition = function (dimensionId,groupId) {
    this.groups[groupId].dimensions.forEach(function (dim) {
        if (parseInt(dim.id) == parseInt(dimensionId)) {
            return parseInt(dim.pos);
        }
    });
    return false;
};

RadvizViews.prototype.removeDimensionFromGroup = function (dimensionId,groupId) {
    var remove = -1;
    this.groups[groupId].dimensions.forEach(function (dim, idx) {
        if (parseInt(dim.id) == parseInt(dimensionId)) {
            remove = idx;
        }
    });
    if (remove > -1) {
        this.groups[groupId].dimensions.splice(remove,1);
    }
    this.drawDimensions(groupId);
};

RadvizViews.prototype.drawDimensions = function (groupId) {
    var _this = this;
    var i = groupId; // porco pra tirar o for e desenhar só a dimensão groupId
    //for (var i = 0; i < this.groups.length; ++i) {
        if (this.groups[i]) {
            //var elements = this.groups[i].dimensions.length;
            //var distance = 360;
            //if (elements > 0) {
            //    distance = 360 / elements;
            //}
            d3.selectAll(".element-dimension-group-" + i).remove();
            this.groups[i].dimensions.forEach(function (d,di) {
                //_this.groups[i].dimensions[di].pos = distance * di;
                var dimG = _this.svg.append("g")
                    .attr("class", "dimension dimension-" + d.id + " element-dimension-group-" + i)
                    .attr('data-element', di)
                    .attr('data-dimension', d.id)
                    .attr('data-group', i)
                    .attr("transform", "rotate(" + _this.groups[i].dimensions[di].pos + ")")
                    .attr("data-pos", _this.groups[i].dimensions[di].pos)
                    .attr("width", 16)
                    .attr("height", 16)
                    .style("cursor", "move")
                    .on("mousedown", function () {
                        _this.drag.dragging = true;
                        _this.drag.group = false;
                        _this.drag.element = "dimension-" + d.id;
                        d3.selectAll(".dimension-" + d.id).classed("selected", true);
                    });//mousewheel
                dimG.append("circle")
                    .attr("cx", _this.groups[i].radius)
                    .attr("cy", 0)
                    .attr("r", 9)
                    .style("fill", "lightGray")
                    .style("stroke", "none");
                dimG.append("text")
                    .attr("data-pos", d.pos)
                    .attr("dx", 0)
                    .attr("dy", 4.5)
                    .attr("text-anchor", "middle")
                    .attr("font-weight", "bold")
                    .text(d.attribute)
                    .style("fill", "#2c3e50")
                    .attr("transform", "translate(" + _this.groups[i].radius + ",0) rotate(" + (180 - _this.groups[i].dimensions[di].pos) + ") scale(-1,1)");

                _this.groups[i].dimensionsObjects[di] = dimG;
            });
        }
    //}

    var _this = this;
    this.svg.on('mouseup', function () {
        _this.drag.dragging = false;
        _this.drag.element = "";
        d3.selectAll(".dimension").classed("selected", false);
        if (_this.updateDimensions) {
            _this.updateDimensions();
        }
    });

    this.svg.on('mousemove', function () {
        if (_this.drag.dragging) {

            var x = d3.mouse(this)[0];
            var y = d3.mouse(this)[1];
            if (!_this.drag.group) {
                var element = d3.select("." + _this.drag.element).attr("data-element");
                var group = d3.select("." + _this.drag.element).attr("data-group");

                var hlin = Math.sqrt(x * x + y * y);
                var ylin = _this.options.maxCircleRadius / hlin * y;

                var sen = ylin / _this.options.maxCircleRadius;
                var arc = Math.asin(sen);
                if (x < 0) {
                    arc = Math.PI - arc;
                }
                _this.groups[group].dimensions[element].pos = (arc / (Math.PI / 180));
                d3.select("." + _this.drag.element).attr("transform", "rotate(" + (arc / (Math.PI / 180)) + ")");
                d3.select("." + _this.drag.element).attr("data-pos", (arc / (Math.PI / 180)));
                d3.select("." + _this.drag.element + " text").attr("data-pos", (arc / (Math.PI / 180)));
                d3.select("." + _this.drag.element + " text").attr("transform", "translate(" + _this.groups[group].radius + ",0) rotate(" + (180 - (arc / (Math.PI / 180))) + ") scale(-1,1)");

                //Update point positions on mouse move
                d3.selectAll(".dimension").classed("selected", false);
                if (_this.updateDimensions) {
                    _this.updateDimensions();
                }
            } else {

                var hlin = Math.sqrt(x * x + y * y);
                var ylin = _this.options.maxCircleRadius / hlin * y;
                var sen = ylin / _this.options.maxCircleRadius;
                var arc = Math.asin(sen);
                if (x < 0) {
                    arc = Math.PI - arc;
                }

                var x1 = _this.drag.originalPosition[0];
                var y1 = _this.drag.originalPosition[1];
                var h1lin = Math.sqrt(x1 * x1 + y1 * y1);
                var y1lin = _this.options.maxCircleRadius / h1lin * y1;
                var sen1 = y1lin / _this.options.maxCircleRadius;
                var arc1 = Math.asin(sen1);
                if (x1 < 0) {
                    arc1 = Math.PI - arc1;
                }
                var delta = arc - arc1;

                var group = d3.select("." + _this.drag.element).attr("data-dimension-group-id");
                d3.selectAll(".element-dimension-group-" + group).each(function (dim,idx) {
                    var element = d3.select(this).attr("data-element");
                    var pos1 = _this.drag.originalElementsPosition[idx];
                    pos1 = pos1/180 * Math.PI;
                    var pos = parseFloat(pos1) + parseFloat(delta);
                    _this.groups[group].dimensions[element].pos = (pos / (Math.PI / 180));
                    d3.select(this).attr("data-pos",(pos / (Math.PI / 180)));
                    d3.select(this).attr("transform", "rotate(" + (pos / (Math.PI / 180)) + ")");
                    d3.select(this).select("text").attr("data-pos", (pos / (Math.PI / 180)));
                    d3.select(this).select("text").attr("transform", "translate(" + _this.groups[group].radius + ",0) rotate(" + (180 - (pos / (Math.PI / 180))) + ") scale(-1,1)");
                });
                if (_this.updateDimensions) {
                    _this.updateDimensions();
                }
            }
        }
    });
};

RadvizViews.prototype.updateDimensionPosition = function (dimensionId,groupId,pos) {
    var _this = this;
    d3.select(".dimension-" + dimensionId).attr("transform", "rotate(" + pos + ")");
    d3.select(".dimension-" + dimensionId).attr("data-pos", pos);
    d3.select(".dimension-" + dimensionId + " text").attr("data-pos", pos);
    d3.select(".dimension-" + dimensionId + " text").attr("transform", "translate(" + _this.groups[groupId].radius + ",0) rotate(" + (180 - pos) + ") scale(-1,1)");
};

RadvizViews.prototype.getSmallestCircleRadius = function () {
    for (var i = (this.groups.length-1); i >=0 ; --i) {
        if (this.groups[i]) {
            return this.groups[i].radius - this.options.circleOffset;
        }
    }
    return this.options.maxCircleRadius - this.options.circleOffset + 10;
};

RadvizViews.prototype.init = function () {
    this.svg = d3.select(this.element).select("svg");
    this.svg.remove();
    this.svg = d3.select(this.element).append("svg")
        .attr("width", this.options.diameter+20)
        .attr("height", this.options.diameter+20)
        .append("g")
        .attr("transform", "translate(" + this.options.radius + "," + this.options.radius + ") scale (1,-1)");
    this.background = this.svg.append("rect")
        .attr("x", -this.options.radius)
        .attr("y", -this.options.radius)
        .attr("width", this.options.diameter)
        .attr("height", this.options.diameter)
        .style("fill", "white");
};
