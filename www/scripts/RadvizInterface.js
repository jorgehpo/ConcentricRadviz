var COLORSCALE = ["#1abc9c","#c0392b","#3498db","#9b59b6","#7f8c8d","#d35400","#2ecc71","#34495e","#f39c12","#bdc3c7","#f1c40f","#2c3e50","#e74c3c","#16a085","#95a5a6","#8e44ad","#27ae60","#e67e22","#2980b9"];

function RadvizInterface(radviz,radViews) {
    this.radviz = radviz;
    this.radvizViews = radViews;
    this.tooltip = new Tooltip();
    this.dimensionsElement = $(".sidebar-dimensions-list");
    this.dimensions = [];
    this.dimensionsGroups = [];
    this.dimensionsGroupsElement = $(".sidebar-groups-list");
    this.uniqueDimensionsCount = 0;
    this.uniqueGroupsCount = 0;
    this.uniqueRemovedGroupsCount = 0;
    this.showTooltip = false;
    this.dynamicColor = false;

    $("#tooltipDimension").append("<option value='-1'>None</option>");
    $("#colorDimension").append("<option value='-1'>None</option>");

    var _this = this;
    this.radviz.getDimensionNames().forEach(function (item,idx) {
        //addDimension( id : number, name_circle: small name, name_attribute: complete name)
        _this.addDimension(idx,idx,item);
    });
    var _this = this;
    this.radvizViews.setUpdateDimensions(function () {
        _this.radviz.updateAnchors(_this.dimensions);
        _this.drawPoints();
    });

    $("#tooltipDimension").val(-1);
    $("#colorDimension").val(-1);

    $("#tooltipDimension").on("change",function () {
        var dimensionId = parseInt($(this).val());
        if (dimensionId >= 0) {
            _this.showTooltip = true;
            _this.radviz.tooltip =_this.radviz.data[_this.dimensions[dimensionId].attribute];
        } else {
            _this.showTooltip = false;
        }
        _this.drawPoints();
    });
    $("#colorDimension").on("change",function () {
        var dimensionId = parseInt($(this).val());
        if (dimensionId >= 0) {
            _this.dynamicColor = true;
            _this.radviz.setColorsColumnId(dimensionId);
        } else {
            _this.dynamicColor = false;
        }
        _this.drawPoints();
    });
}

RadvizInterface.prototype.destroy = function () {
    $("#tooltipDimension").html("");
    $("#colorDimension").html("");
    this.tooltip.destroy();
};

RadvizInterface.prototype.getRadviz = function () {
    return this.radviz;
};

RadvizInterface.prototype.getSvg = function () {
    return this.radvizViews.getSvg();
};

RadvizInterface.prototype.getSmallestCircleRadius = function () {
    return this.radvizViews.getSmallestCircleRadius();
};

RadvizInterface.prototype.addDimension = function (id,name,attribute) {
    var dim = {id: id,name: name,attribute: attribute,available: true,group: false,pos: 0,weight: 1};
    $("#tooltipDimension").append("<option value='" + id + "'>" + id + " - " + attribute + "</option>");
    $("#colorDimension").append("<option value='" + id + "'>" + id + " - " + attribute + "</option>");
    this.dimensions[id] = dim;
    this.uniqueDimensionsCount++;
    this.draw();
};

RadvizInterface.prototype.addGroup = function (name,color) {
    var id = this.uniqueGroupsCount;
    var gr = {name: name,color: color,dimensions: [],element: new RadvizDimensionGroup(id,name,color,[])};
    this.dimensionsGroups[id] = gr;
    this.uniqueGroupsCount++;
    this.radvizViews.addDimensionsGroup(gr.element);
    this.draw();
};

RadvizInterface.prototype.removeGroup = function (groupId) {
    groupId = parseInt(groupId);
    this.dimensionsGroups[groupId] = null;
    this.uniqueRemovedGroupsCount++;
    this.radvizViews.removeDimensionsGroup(groupId);
    var _this = this;
    this.dimensions.forEach(function (d,i) {
        if (d.group == groupId) {
            _this.dimensions[i].available = true;
            _this.dimensions[i].group = false;
        }
    });
    if (this.uniqueRemovedGroupsCount == this.uniqueGroupsCount) {
        this.uniqueGroupsCount = 0;
        this.uniqueRemovedGroupsCount = 0;
        this.dimensionsGroups = [];
    }
    this.radviz.setAnchors(this.dimensions);
    this.drawPoints();
    this.draw();
};

RadvizInterface.prototype.addDimensionToGroup = function (dimensionId,groupId) {
    dimensionId = parseInt(dimensionId);
    groupId = parseInt(groupId);
    this.dimensions[dimensionId].available = false;
    this.dimensions[dimensionId].group = groupId;
    this.dimensionsGroups[groupId].dimensions.push(dimensionId);
    this.radvizViews.addDimensionToGroup(this.dimensions[dimensionId],groupId);
    this.radviz.setAnchors(this.dimensions);
    this.drawPoints();
    this.draw();
};

RadvizInterface.prototype.removeDimensionFromGroup = function (dimensionId) {
    dimensionId = parseInt(dimensionId);
    if (!this.dimensions[dimensionId].available) {
        var oldGroup = this.dimensions[dimensionId].group;
        this.dimensions[dimensionId].available = true;
        this.dimensions[dimensionId].group = false;
        var index = this.dimensionsGroups[oldGroup].dimensions.indexOf(parseInt(dimensionId));
        if (index > -1) {
            this.dimensionsGroups[oldGroup].dimensions.splice(index,1);
            this.radvizViews.removeDimensionFromGroup(dimensionId,oldGroup);
            this.radviz.setAnchors(this.dimensions);
        }
        this.drawPoints();
        this.draw();
    }
};

RadvizInterface.prototype.getDimensionPosition = function (dimensionId) {
    var dim = this.dimensions[dimensionId];
    if (dim.available === true) {
        return false;
    } else {
        var groupId = dim.group;
        var pos = dim.pos;
        return {group: groupId,position: pos,weight: dim.weight};
    }
};

RadvizInterface.prototype.draw = function () {
    this.dimensionsElement.children().remove();
    this.dimensionsGroupsElement.children().remove();
    var _this = this;
    this.dimensionsGroups.forEach(function (d,i) {
        if (d) {
            $(".sidebar-groups-list").append("<div data-group-id='" + i + "' class='sidebar-groups-list-item sidebar-groups-list-item-" + i + "' style='background-color: " + d.color + "'>" +
                                             "<div data-group-id='" + i + "' class='sidebar-groups-list-item-element sidebar-groups-list-item-remove'>x</div>" +
                                             "<div data-group-id='" + i + "' class='sidebar-groups-list-item-element sidebar-groups-list-item-element-group-" + i + " sidebar-groups-list-item-title'>" + d.name + "</div></div>");
            d.dimensions.forEach(function (e) {
                $(".sidebar-groups-list-item-" + i).append("<div data-dimension-id='" + e + "' class='sidebar-groups-list-item-dimension-" + e + " sidebar-groups-list-item-element droppable-element'>" + _this.dimensions[e].name + " - " + _this.dimensions[e].attribute + "</div>");
            });
        }
    });
    $(".sidebar-groups-list-item-element").off("click");
    $(".sidebar-groups-list-item-element").on("click", function () {
        _this.activeDimensionSlider($(this).attr("data-dimension-id"));
    });
    $(".sidebar-groups-list-item-title").off("click");
    $(".sidebar-groups-list-item-title").on("click", function () {
        _this.activeGroupSlider($(this).attr("data-group-id"));
    });
    this.dimensions.forEach(function (d,i) {
        if (d.available) {
            $(".sidebar-dimensions-list").append("<div data-dimension-id='" + i + "' class='sidebar-dimensions-list-item droppable-element'>" + d.name + " - " + d.attribute + "</div>");
        }
    });

    $( ".droppable-element" ).draggable({ revert: "invalid" });
    $( ".sidebar-groups-list-item" ).droppable({
        accept: ".droppable-element",
        activeClass: "ui-state-hover",
        hoverClass: "ui-state-active",
        drop: function( event, ui ) {
            var dimension = ui.draggable.attr("data-dimension-id");
            var group = $(this).attr("data-group-id");
            _this.removeDimensionFromGroup(dimension);
            _this.addDimensionToGroup(dimension,group);
            _this.hideDimensionSlider();
            _this.draw();
        }
    });
    $( ".sidebar-dimensions-list" ).droppable({
        accept: ".droppable-element",
        activeClass: "ui-state-hover",
        hoverClass: "ui-state-active",
        drop: function( event, ui ) {
            var dimension = ui.draggable.attr("data-dimension-id");
            _this.removeDimensionFromGroup(dimension);
            _this.hideDimensionSlider();
            _this.draw();
        }
    });
    $("#btn-add-group").off("click");
    $("#btn-add-group").on("click",function (e) {
        e.preventDefault();
        _this.addGroup("Group " + (_this.uniqueGroupsCount + 1),COLORSCALE[_this.uniqueGroupsCount]);
    });
    $(".sidebar-groups-list-item-remove").off("click");
    $(".sidebar-groups-list-item-remove").on("click",function () {
        _this.removeGroup($(this).attr("data-group-id"));
    });
};

RadvizInterface.prototype.drawPoints = function () {
    var smallestCircle = this.getSmallestCircleRadius();

    var xValue = function (d) {
        return d.x;
    };
    var xScale = d3.scale.linear().range([-smallestCircle, smallestCircle]).domain([-1, 1]);//input domain, output range
    var xMap = function (d) {
        return xScale(xValue(d));
    };
    var yValue = function (d) {
        return d.y;
    };
    var yScale = d3.scale.linear().range([-smallestCircle, smallestCircle]).domain([-1, 1]);//input domain, output range
    var yMap = function (d) {
        return yScale(yValue(d));
    };

    var _this = this;
    var proj = this.radviz.computeProjection();
    if (proj.length > 0){
        radInterface.getSvg().selectAll(".dot").remove();
        radInterface.getSvg().selectAll(".dot")
            .data(proj)
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function (d) {
                if (_this.dynamicColor) {
                    if (d.isContinuous) {

                    }
                } else {
                    return "black";
                }
            })
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .on("mouseover", function (d) {
                if (d.tip !== null && _this.showTooltip) {
                    _this.tooltip.show(d.tip);
                }
            })
            .on("mouseout", function (d) {
                if (d.tip !== null) {
                    _this.tooltip.hide();
                }
            });
    }
};

RadvizInterface.prototype.activeDimensionSlider = function (dimensionId) {
    $("#dimensionSlider").removeClass("hidden");
    $(".sidebar-groups-list-item-element").removeClass("selected");
    $(".sidebar-groups-list-item-dimension-" + dimensionId).addClass("selected");
    $("#dimensionSlider label").html(this.dimensions[dimensionId].attribute + " weight: ");
    var slider = $("#dimensionSliderController").data("ionRangeSlider");
    var _this = this;
    slider.update({from: parseFloat(this.dimensions[dimensionId].weight),onChange: function (data) {
        var newWeight = parseFloat(data.from);
        _this.dimensions[dimensionId].weight = newWeight;
        _this.radvizViews.updateDimensions();
    }});
};


RadvizInterface.prototype.activeGroupSlider = function (groupId) {
    $("#dimensionSlider").removeClass("hidden");
    $(".sidebar-groups-list-item-element").removeClass("selected");
    $(".sidebar-groups-list-item-element-group-" + groupId).addClass("selected");
    $("#dimensionSlider label").html(this.dimensionsGroups[groupId].name + " weight: ");
    var slider = $("#dimensionSliderController").data("ionRangeSlider");
    var _this = this;
    slider.update({from: parseFloat(1.0),onChange: function (data) {
        var newWeight = (isNaN(parseFloat(data.from))) ? 1.0 : parseFloat(data.from);
        _this.dimensionsGroups[groupId].dimensions.forEach(function (dim,idx) {
            _this.dimensions[dim].weight = newWeight;
        });
        _this.radvizViews.updateDimensions();
    }});
};

RadvizInterface.prototype.hideDimensionSlider = function () {
    $("#dimensionSlider").addClass("hidden");
};