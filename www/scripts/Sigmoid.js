function Sigmoid(element,callback) {
    this.el = element;
    this.scale = 10.0;
    this.translate = 1;
    this.callback = callback;
    this.initEvents();
    this.draw();
}

Sigmoid.prototype.initEvents = function () {
    console.log("init events");
    var translateSlider = $("#sigmoidTranslateSliderController").data("ionRangeSlider");
    var scaleSlider = $("#sigmoidScaleSliderController").data("ionRangeSlider");
    var _this = this;
    translateSlider.update({from: parseFloat(_this.translate),onChange: function (data) {
        var newValue = (isNaN(parseFloat(data.from))) ? -1.0 : parseFloat(data.from);
        _this.translate = newValue;
        _this.update();
    }});

    scaleSlider.update({from: parseFloat(_this.scale),onChange: function (data) {
        var newValue = (isNaN(parseFloat(data.from))) ? 0.1 : parseFloat(data.from);
        _this.scale = newValue;
        _this.update();
    }});
};

Sigmoid.prototype.update = function () {
    this.callback(this.translate,this.scale);
    this.draw();
};

Sigmoid.prototype.draw = function () {
    $(this.el + " svg").remove();
    var _this = this;
    var margin = {top: 10, right: 20, bottom: 25, left: 20};
    var width = $(this.el).innerWidth() - margin.left - margin.right;
    var height = $(this.el).innerHeight() - margin.top - margin.bottom;
    var svg = d3.select(this.el).append("svg").attr("height",height + margin.top + margin.bottom).attr("width",width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var x = d3.scale.linear()
        .range([12, width-12])
        .domain([0,1]);

    var y = d3.scale.linear()
        .range([height-2, 2])
        .domain([0,1]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(0)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height-2) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + ((width) /2) + ",0)")
        .call(yAxis);

    svg.append("path")
        .datum(_this.sampleSigmoid())
        .attr("class", "line")
        .attr("d", line)
        .style("fill","none")
        .style("stroke","#c0392b")
        .style("stroke-width","1.5px");
};

Sigmoid.prototype.sampleSigmoid = function () {
    var i=-1.0;
    var sample = [];
    while (i <= 1) {
        sample.push([i,this.sigmoid(i)]);
        i+=0.02;
    }
    return sample;
};

Sigmoid.prototype.sigmoid = function(x){
    return (1/(1+Math.exp(-(this.scale*(x + this.translate)))));
};