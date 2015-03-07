//scriptRadviz.js

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function (scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function (el, info) {

        window.radInterface = new RadvizInterface(new RadvizViews(el, {diameter: 800, circleOffset: 20}));
        var tooltip = new Tooltip();

        //%%%%%%%%%%%%%%%%% RADVIZ AND PLOTTING %%%%%%%%%%%%%%%%%%%%%%%
        var columnsGenre = ["genre_tzanetakis.blu", "genre_tzanetakis.cla", "genre_tzanetakis.cou", "genre_tzanetakis.dis", "genre_tzanetakis.hip", "genre_tzanetakis.jaz", "genre_tzanetakis.met", "genre_tzanetakis.pop", "genre_tzanetakis.reg", "genre_tzanetakis.roc"];

        var columnsHumor = ["mood_acoustic.acoustic", "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad"];

        columnsHumor.forEach(function (item,idx) {
            radInterface.addDimension(idx,item);
        });

        var mydat = selectColumns(info.data, Object.keys(info.data));

        var smallestCircle = radInterface.getSmallestCircleRadius();

        console.log(Object.keys(info.data));
        var anchors = computeAnchors(info.data, Object.keys(info.data));
        //anchors = [{name: 'A', pos: 0}, {name: 'B', pos: 67}];

        console.log(anchors);

        var rad = radviz(mydat, info.tags.filename);


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


        radInterface.getSvg().selectAll(".dot")
            .data(rad)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .on("mouseover", function (d) {
                if (d.tip) {
                    tooltip.show(d.tip);
                }
            })
            .on("mouseout", function (d) {
                if (d.tip) {
                    tooltip.hide();
                }
            });
    }//renderValue function
})//extend networkOutputBindingRadviz

Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');
  

