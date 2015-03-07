//scriptRadviz.js #main function called from R shiny

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function (scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function (el, info) {

        var radViews = new RadvizViews(el, {diameter: 800, circleOffset: 20});
        var radInterface = new RadvizInterface(radViews);
        var tooltip = new Tooltip();
        var dimensionsStr = Object.keys(info.data);
        dimensionsStr.forEach(function(str,id){
            //radInterface.addDimension(String.fromCharCode('A'.charCodeAt(0)+id),str);
            radInterface.addDimension(str,str); //Eh pra colocar 'A', depois
        });
        radInterface.addGroup("Group 1","#27ae60");
        radInterface.addGroup("Group 2","#16a085");

        //%%%%%%%%%%%%%%%%% RADVIZ AND PLOTTING %%%%%%%%%%%%%%%%%%%%%%%
        var smallestCircle = radViews.getSmallestCircleRadius();

        var columnsGenre = ["genre_tzanetakis.blu", "genre_tzanetakis.cla", "genre_tzanetakis.cou", "genre_tzanetakis.dis", "genre_tzanetakis.hip", "genre_tzanetakis.jaz", "genre_tzanetakis.met", "genre_tzanetakis.pop", "genre_tzanetakis.reg", "genre_tzanetakis.roc"];
        var columnsHumor = ["mood_acoustic.acoustic", "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad"];

        var anchors = [{name: "A", pos: 0},{name: "B", pos: 90},{name: "C", pos: 180},{name: "D", pos: 270}];

        var anchors2 = [{name: "Z", pos: 180},{name: "F", pos: 270}];

        radViews.addDimensionsGroup(new RadvizDimensionGroup("Genre", "#27ae60", anchors));

        radViews.addDimensionsGroup(new RadvizDimensionGroup("Mood", "#0033CC", anchors2));

        var radviz = new Radviz(info.data, columnsGenre, info.tags.filename);

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


        radViews.getSvg().selectAll(".dot")
            .data(radviz.computeProjection())
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
