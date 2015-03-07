function RadvizViews(el, options) {
    this.element = el;
    this.options = options;
    this.options.radius = this.options.diameter / 2;
    this.options.maxCircleRadius = this.options.radius - this.options.circleOffset;
    this.svg = null;
    this.drag = {dragging: false, element: ""};
    this.groups = [];
    this.numberOfGroups = 0;

    this.init();
}

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
        .style("stroke-width", "6");
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
                    .attr("transform", "translate(" + newRadius + ",0) rotate(" + (180 - d3.select(this).attr("data-pos")) + ") scale(-1,1)");
            });
            countValidCircles++;
        }
    }
};

RadvizViews.prototype.addDimensionToGroup = function (dimension,groupId) {
    this.groups[groupId].dimensions.push(dimension);
    this.drawDimensions();
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
    this.drawDimensions();
};

RadvizViews.prototype.drawDimensions = function () {
    var _this = this;
    for (var i = 0; i < this.groups.length; ++i) {
        if (this.groups[i]) {
            var elements = this.groups[i].dimensions.length;
            var distance = 360;
            if (elements > 0) {
                distance = 360 / elements;
            }
            d3.selectAll(".element-dimension-group-" + i).remove();
            this.groups[i].dimensions.forEach(function (d,di) {
                _this.groups[i].dimensions[di].pos = distance * di;
                var dimG = _this.svg.append("g")
                    .attr("class", "dimension dimension-" + d.id + " element-dimension-group-" + i)
                    .attr('data-element', di)
                    .attr('data-dimension', d.id)
                    .attr('data-group', i)
                    .attr("transform", "rotate(" + _this.groups[i].dimensions[di].pos + ")")
                    .attr("width", 16)
                    .attr("height", 16)
                    .style("cursor", "move")
                    .on("mousedown", function () {
                        _this.drag.dragging = true;
                        _this.drag.element = "dimension-" + d.id;
                        d3.selectAll(".dimension-" + d.id).classed("selected", true);
                    });
                dimG.append("circle")
                    .attr("cx", _this.groups[i].radius)
                    .attr("cy", 0)
                    .attr("r", 9)
                    .style("fill", "#2c3e50")
                    .style("stroke", "none");
                dimG.append("text")
                    .attr("data-pos", d.pos)
                    .attr("dx", -5)
                    .attr("dy", 4.5)
                    .text(d.name)
                    .style("fill", "lightGray")
                    .attr("transform", "translate(" + _this.groups[i].radius + ",0) rotate(" + (180 - _this.groups[i].dimensions[di].pos) + ") scale(-1,1)");

                _this.groups[i].dimensionsObjects[di] = dimG;
            });
        }
    }

    var _this = this;
    this.svg.on('mouseup', function () {
        _this.drag.dragging = false;
        _this.drag.element = "";
        d3.selectAll(".dimension").classed("selected", false);
    });

    this.svg.on('mousemove', function () {
        if (_this.drag.dragging) {
            var x = d3.mouse(this)[0];
            var y = d3.mouse(this)[1];
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
            d3.select("." + _this.drag.element + " text").attr("data-pos", (180 - (arc / (Math.PI / 180))));
            d3.select("." + _this.drag.element + " text").attr("transform", "translate(" + _this.groups[group].radius + ",0) rotate(" + (180 - (arc / (Math.PI / 180))) + ") scale(-1,1)");
        }
    });
};

RadvizViews.prototype.getSmallestCircleRadius = function () {
    if (this.numberOfGroups == 0) return this.options.maxCircleRadius;
    return this.groups[this.numberOfGroups - 1].radius;
};

RadvizViews.prototype.init = function () {
    this.svg = d3.select(this.element).select("svg");
    this.svg.remove();
    this.svg = d3.select(this.element).append("svg")
        .attr("width", this.options.diameter)
        .attr("height", this.options.diameter)
        .append("g")
        .attr("transform", "translate(" + this.options.radius + "," + this.options.radius + ") scale (1,-1)");
    this.background = this.svg.append("rect")
        .attr("x", -this.options.radius)
        .attr("y", -this.options.radius)
        .attr("width", this.options.diameter)
        .attr("height", this.options.diameter)
        .style("fill", "white");
};
