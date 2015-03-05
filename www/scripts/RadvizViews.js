function RadvizViews (el,options) {
    this.element = el;
    this.options = options;
    this.options.radius = this.options.diameter/2;
    this.options.maxCircleRadius = this.options.radius - this.options.circleOffset;
    this.svg = null;
    this.drag = {dragging: false,element: ""};
    this.groups = [];
    this.numberOfGroups = 0;

    this.init();
}

RadvizViews.prototype.getSvg = function () {
    return this.svg;
};

RadvizViews.prototype.addCircle = function (circle) {
    circle.radius = this.options.maxCircleRadius - this.numberOfGroups * this.options.circleOffset;
    this.groups[this.numberOfGroups] = circle;
    var _this = this;
    var circleEl = _this.svg.append("circle")
        .attr("cx", 0).attr("class","dimension-group dimension-group-" + this.numberOfGroups)
        .attr("cy", 0)
        .attr("r", circle.radius)
        .style("fill","none")
        .style("stroke", circle.color)
        .style("stroke-width","6");

    circle.dimensions.forEach(function (d,i) {
        var dimG = _this.svg.append("g")
            .attr("class","dimension dimension-" + d.name + " element-dimension-group-" + _this.numberOfGroups)
            .attr('data-element',i)
            .attr('data-group',_this.numberOfGroups)
            .attr("transform", "rotate(" + d.pos + ")")
            .attr("width",16)
            .attr("height",16)
            .style("cursor","move")
            .on("mousedown", function () {
                _this.drag.dragging = true;
                _this.drag.element = "dimension-" + d.name;
                d3.selectAll(".dimension-" + d.name).classed("selected",true);
            });
        dimG.append("circle")
            .attr("cx", circle.radius)
            .attr("cy", 0)
            .attr("r", 9)
            .style("fill","#2c3e50")
            .style("stroke","none");
        dimG.append("text")
            .attr("data-pos", d.pos)
            .attr("dx", -5)
            .attr("dy", 4.5)
            .text(d.name)
            .style("fill","lightGray")
            .attr("transform", "translate(" + circle.radius + ",0) rotate(" + (180 - d.pos) + ") scale(-1,1)");

        circle.dimensionsObjects[i] = dimG;
    });

    console.log(this.groups);
    this.numberOfGroups++;
};

RadvizViews.prototype.removeCircle = function (idx) {
    d3.selectAll(".dimension-group-" + idx + ",.element-dimension-group-" + idx).remove();
    //this.groups[idx] = -1;
    for (var i = idx + 1; i < this.numberOfGroups; ++i) {
        console.log("Change: " + i);

        d3.select(".dimension-group-" + i).transition().duration(600).attr("r", this.groups[i - 1].radius);

        d3.selectAll(".element-dimension-group-" + i + " circle").transition()
            .duration(600)
            .attr("cx", this.groups[i-1].radius);
        var newRadius = this.groups[i-1].radius;
        d3.selectAll(".element-dimension-group-" + i + " text").each(function(d, i) {
            d3.select(this).transition()
            .duration(600)
            .attr("transform", "translate(" + newRadius + ",0) rotate(" + (180 - d3.select(this).attr("data-pos")) + ") scale(-1,1)");
        });
        d3.selectAll(".dimension-group-" + i).attr("data-group",(i-1));
        d3.selectAll(".element-dimension-group-" + i).attr("data-group",(i-1));
        d3.selectAll(".dimension-group-" + i).classed("dimension-group-" + (i-1),true);
        d3.selectAll(".dimension-group-" + i).classed("dimension-group-" + i,false);
        d3.selectAll(".element-dimension-group-" + i).classed("element-dimension-group-" + (i-1),true);
        d3.selectAll(".element-dimension-group-" + i).classed("element-dimension-group-" + i,false);
        this.groups[i-1] = this.groups[i];
        this.groups[i-1].radius = newRadius;
    }
    this.groups.pop();
    this.numberOfGroups--;
    console.log(this.groups);
};

RadvizViews.prototype.getSmallestCircleRadius = function () {
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
        .style("fill","white");

    var _this = this;

    this.svg.on('mouseup', function () {
        _this.drag.dragging = false;
        _this.drag.element = "";
        d3.selectAll(".dimension").classed("selected",false);
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

            _this.groups[group].dimensions[element].pos = (arc/(Math.PI/180));
            d3.select("." + _this.drag.element).attr("transform", "rotate(" + (arc/(Math.PI/180)) + ")");
            d3.select("." + _this.drag.element + " text").attr("data-pos",(180 - (arc/(Math.PI/180))));
            d3.select("." + _this.drag.element + " text").attr("transform", "translate(" + _this.groups[group].radius + ",0) rotate(" + (180 - (arc/(Math.PI/180))) + ") scale(-1,1)");
        }
    });
};
