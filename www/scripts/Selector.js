function Selector(interface) {
	this.interface = interface;
	this.brush = null;
	this.selectedElements = [];
	this.initEvents();
	this.initPolybrush(this.interface.getSvg());
}

Selector.prototype.initEvents = function () {
	var _this = this;
	$("#btn-reset-selection").on("click", function () {
		_this.interface.resetSelection();
		_this.interface.currentSelectionMode = "reset";
        $(".dimension").off("click");
        $("#anchorSelectorSliderController").data("ionRangeSlider").update({onChange: function () { return false; }});
	});
	$("#btn-add-selection").on("click", function () {
		_this.interface.currentSelectionMode = "add";
        $(".dimension").off("click");
        $("#anchorSelectorSliderController").data("ionRangeSlider").update({onChange: function () { return false; }});
	});
	$("#btn-sub-selection").on("click", function () {
		_this.interface.currentSelectionMode = "sub";
        $(".dimension").off("click");
        $("#anchorSelectorSliderController").data("ionRangeSlider").update({onChange: function () { return false; }});
	});
    $("#btn-anchor-selection").on("click", function () {
        _this.interface.resetSelection();
        _this.interface.currentSelectionMode = "anchor";
        $(".dimension").on("click", function () {
            //var distanceSlider = $("#anchorSelectorSliderController").data("ionRangeSlider");
            var selectedDimension = $(this).attr("data-dimension");
            $("label[for='anchorSelectorSlider']").html("Distance Threshold from " + _this.interface.dimensions[selectedDimension].attribute);
            _this.interface.selectElementsFromDistanceToAnchor($("#anchorSelectorSliderController").val(),_this.interface.dimensions[$(this).attr("data-dimension")]);
            $("#anchorSelectorSliderController").data("ionRangeSlider").update({onChange: function (data) {
                var newValue = (isNaN(parseFloat(data.from))) ? 0.0 : parseFloat(data.from);
                _this.interface.selectElementsFromDistanceToAnchor(newValue,_this.interface.dimensions[selectedDimension]);
            }});
        });
        _this.interface.currentAnchor = null;
    });


	$("#btn-hide-selected").on("click", function () {
		_this.interface.doSelectionAction('hide-selected');
	});
	$("#btn-hide-unselected").on("click", function () {
		_this.interface.doSelectionAction('hide-unselected');
	});
	$("#btn-show-all").on("click", function () {
		_this.interface.doSelectionAction('show-all');
	});
};

Selector.prototype.initPolybrush = function (svg) {
	var _this = this;
	this.brush = d3.svg
		.polybrush()
		.x(d3.scale.linear().range([ -1 * _this.interface.radvizViews.options.diameter/2, _this.interface.radvizViews.options.diameter/2 ]))
		.y(d3.scale.linear().range([ -1 * _this.interface.radvizViews.options.diameter/2, _this.interface.radvizViews.options.diameter/2 ]))
		.on("brushstart", function() {
			svg.selectAll(".selected").classed("selected", false);
		})
		.on("brushend", function() {
			_this.interface.selectMultipleItems(_this.selectedElements);
			_this.brush.clear();
		})
		.on("brush",function() {
			_this.selectedElements = [];
			svg.selectAll(".dot")
				.classed("selected", function(d) {
					var id = d3.select(this).attr("id");
					if (parseInt(d3.select(this).attr("data-is-hidden")) == 0) {
						if (_this.brush.isWithinExtent(parseFloat(d3.select(this).attr("cx")), parseFloat(d3.select(this).attr("cy")))) {
							_this.selectedElements.push(parseInt(d3.select(this).attr("id")));
							return true;
						} else {
							return false;
						}
					}
				});
			});
	
	svg.append("svg:g")
    .attr("class", "brush")
    .call(_this.brush);
};

Selector.prototype.destroyPolybrush = function () {
	this.brush = null;
	$('.brush').remove();
};