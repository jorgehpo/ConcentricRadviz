function RadvizInterface(radViews) {
    this.radvizViews = radViews;
    this.dimensionsElement = $(".sidebar-dimensions-list");
    this.dimensions = [];
    this.dimensionsGroups = [];
    this.dimensionsGroupsElement = $(".sidebar-groups-list");
    this.uniqueDimensionsCount = 0;
    this.uniqueGroupsCount = 0;
}

RadvizInterface.prototype.addDimension = function (name,attribute) {
    var dim = {name: name,attribute: attribute,available: true,group: false};
    this.dimensions[this.uniqueDimensionsCount] = dim;
    this.uniqueDimensionsCount++;
    this.draw();
};

RadvizInterface.prototype.addGroup = function (name,color) {
    var gr = {name: name,color: color,dimensions: []};
    this.dimensionsGroups[this.uniqueGroupsCount] = gr;
    this.uniqueGroupsCount++;
    this.draw();
};

RadvizInterface.prototype.addDimensionToGroup = function (dimensionId,groupId) {
    dimensionId = parseInt(dimensionId);
    groupId = parseInt(groupId);
    this.dimensions[dimensionId].available = false;
    this.dimensions[dimensionId].group = groupId;
    this.dimensionsGroups[groupId].dimensions.push(dimensionId);
    this.draw();
    //console.log(this.dimensionsGroups);
};

RadvizInterface.prototype.removeDimensionFromGroup = function (dimensionId) {
    dimensionId = parseInt(dimensionId);
    if (!this.dimensions[dimensionId].available) {
        var oldGroup = this.dimensions[dimensionId].group;
        this.dimensions[dimensionId].available = true;
        this.dimensions[dimensionId].group = false;
        //console.log("Dimension Id: " + dimensionId);
        //console.log("Old group: " + oldGroup);
        //console.log(this.dimensionsGroups[oldGroup]);
        var index = this.dimensionsGroups[oldGroup].dimensions.indexOf(parseInt(dimensionId));
        //console.log("Index: " + index);
        if (index > -1) {
            this.dimensionsGroups[oldGroup].dimensions.splice(index,1);
        }
        this.draw();
    }
};

RadvizInterface.prototype.draw = function () {
    this.dimensionsElement.children().remove();
    this.dimensionsGroupsElement.children().remove();
    var _this = this;
    this.dimensionsGroups.forEach(function (d,i) {
        $(".sidebar-groups-list").append("<div data-group-id='" + i + "' class='sidebar-groups-list-item sidebar-groups-list-item-" + i + "' style='background-color: " + d.color + "'><div class='sidebar-groups-list-item-element sidebar-groups-list-item-title'>" + d.name + "</div></div>");
        d.dimensions.forEach(function (e) {
            $(".sidebar-groups-list-item-" + i).append("<div data-dimension-id='" + e + "' class='sidebar-groups-list-item-element droppable-element'>" + _this.dimensions[e].name + "</div>");
        });
    });
    this.dimensions.forEach(function (d,i) {
        if (d.available) {
            $(".sidebar-dimensions-list").append("<div data-dimension-id='" + i + "' class='sidebar-dimensions-list-item droppable-element'>" + d.name + "</div>");
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
            _this.draw();
        }
    });
};