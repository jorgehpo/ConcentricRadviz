//scriptRadviz.js

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function (scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function (el, info) {

        var radViews = new RadvizViews(el, {diameter: 800, circleOffset: 20});
        var radInterface = new RadvizInterface(radViews);
        var tooltip = new Tooltip();

        radInterface.addDimension("A","a");
        radInterface.addDimension("B","b");
        radInterface.addDimension("C","c");
        radInterface.addDimension("D","d");

        radInterface.addGroup("Group 1","#27ae60");
        radInterface.addGroup("Group 2","#16a085");

        radInterface.addDimensionToGroup(0,0);
        radInterface.addDimensionToGroup(1,0);
        radInterface.addDimensionToGroup(3,1);
        //-----------------------------
        //-Código de Exemplo
        /*
         radViews.addDimensionsGroup(new RadvizDimensionGroup("Group 1","#27ae60",[{name: "A", pos: 0},{name: "B", pos: 90},{name: "C", pos: 180},{name: "D", pos: 270}]));
         radViews.addDimensionsGroup(new RadvizDimensionGroup("Group 2","#16a085",[{name: "E", pos: 45},{name: "F", pos: 135},{name: "G", pos: 225}]));
         radViews.addDimensionsGroup(new RadvizDimensionGroup("Group 3","#2980b9",[{name: "H", pos: 30},{name: "I", pos: 195},{name: "J", pos: 260}]));

         setTimeout(function () {
         radViews.removeDimension(1);
         },1500);
         setTimeout(function () {
         radViews.addDimensionsGroup(new RadvizDimensionGroup("Group 4","#16a085",[{name: "W", pos: 60},{name: "Y", pos: 145},{name: "Z", pos: 230}]));
         },2500);

         */

        //%%%%%%%%%%%%%%%%% RADVIZ AND PLOTTING %%%%%%%%%%%%%%%%%%%%%%%
        var columnsGenre = ["genre_tzanetakis.blu", "genre_tzanetakis.cla", "genre_tzanetakis.cou", "genre_tzanetakis.dis", "genre_tzanetakis.hip", "genre_tzanetakis.jaz", "genre_tzanetakis.met", "genre_tzanetakis.pop", "genre_tzanetakis.reg", "genre_tzanetakis.roc"];

        var columnsHumor = ["mood_acoustic.acoustic", "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad"];

        var mydat = selectColumns(info.data, Object.keys(info.data));

        var smallestCircle = radViews.getSmallestCircleRadius();

        console.log(Object.keys(info.data))
        var anchors = computeAnchors(info.data, Object.keys(info.data));
        //anchors = [{name: 'A', pos: 0}, {name: 'B', pos: 67}];

        radViews.addDimensionsGroup(new RadvizDimensionGroup("Genre", "#27ae60", anchors));

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


        radViews.getSvg().selectAll(".dot")
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
  

