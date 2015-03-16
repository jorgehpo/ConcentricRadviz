function Tooltip() {
    this.randomId = Math.floor((Math.random() * 99999) + 1);
    this.init();
}

Tooltip.prototype.init = function () {
    d3.select("body").append("div").attr("class", "tooltip top fade").attr("id", "tooltip-global-" + this.randomId);
    //d3.select(".tooltip").append("div").attr("class","tooltip-arrow");
    d3.select(".tooltip").append("div").attr("class", "tooltip-inner").attr("id", "tooltip-" + this.randomId);

};

Tooltip.prototype.show = function (text) {
    this.updatePosition();
    d3.select("#tooltip-" + this.randomId).html(text);
    d3.select("#tooltip-global-" + this.randomId).classed("fade", true);
    d3.select("#tooltip-global-" + this.randomId).classed("in", true);
};

Tooltip.prototype.hide = function () {
    d3.select("#tooltip-global-" + this.randomId).classed("fade", false);
    d3.select("#tooltip-global-" + this.randomId).classed("in", false);
};

Tooltip.prototype.updatePosition = function () {
    event = event || window.event;
    d3.select("#tooltip-global-" + this.randomId).style("top", (event.pageY - 37) + "px").style("left", (event.pageX - 100) + "px");
};

Tooltip.prototype.destroy = function () {
    d3.select(".tooltip").remove();
};