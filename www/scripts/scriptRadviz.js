//scriptRadviz.js #main function called from R shiny

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
        //var columnsHumor = ["mood_acoustic.acoustic", "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad"];

        var dimensionNames = Object.keys(info.data);

        dimensionNames.forEach(function (item,idx) {
            //addDimension( id : number, name_circle: small name, name_attribute: complete name)
            radInterface.addDimension(idx,idx,item);
        });
        //Obter posição de uma dimensão
        //radInterface.getDimensionPosition(dimension_id);

        var smallestCircle = radInterface.getSmallestCircleRadius();

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


        radInterface.getSvg().selectAll(".dot")
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
