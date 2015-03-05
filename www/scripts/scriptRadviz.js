//scriptRadviz.js

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function(scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function(el, info){

        //-----------------------------
        //-Código de Exemplo
        var radViews = new RadvizViews(el,{diameter: 800, circleOffset: 20});
/*
        radViews.addCircle(new RadvizViewsCircle("Group 1","#27ae60",[{name: "A", pos: 0},{name: "B", pos: 90},{name: "C", pos: 180},{name: "D", pos: 270}]));
        radViews.addCircle(new RadvizViewsCircle("Group 2","#16a085",[{name: "E", pos: 45},{name: "F", pos: 135},{name: "G", pos: 225}]));
        radViews.addCircle(new RadvizViewsCircle("Group 3","#2980b9",[{name: "H", pos: 30},{name: "I", pos: 195},{name: "J", pos: 260}]));

        setTimeout(function () {
            radViews.removeCircle(1);
        },1500);
        setTimeout(function () {
            radViews.addCircle(new RadvizViewsCircle("Group 4","#16a085",[{name: "W", pos: 60},{name: "Y", pos: 145},{name: "Z", pos: 230}]));
        },2500);
        
*/

    //%%%%%%%%%%%%%%%%% RADVIZ AND PLOTTING %%%%%%%%%%%%%%%%%%%%%%%
    var columnsGenre = ["genre_tzanetakis.blu", "genre_tzanetakis.cla", "genre_tzanetakis.cou", "genre_tzanetakis.dis", "genre_tzanetakis.hip", "genre_tzanetakis.jaz", "genre_tzanetakis.met", "genre_tzanetakis.pop", "genre_tzanetakis.reg", "genre_tzanetakis.roc"];
    
    var columnsHumor = ["mood_acoustic.acoustic",   "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad" ];
    
    
    
    
    
    var mydat = selectColumns(info.data, columnsGenre);
    
    var smallestCircle = radViews.getSmallestCircleRadius();
    
    
    getAnchorPositions(info.data, columnsGenre)
    
    var rad = radviz(mydat, info.tags.filename)
    
    
    
    var xValue = function(d){return d.x;};
    var xScale = d3.scale.linear().range([-smallestCircle, smallestCircle]).domain([-1,1]);//input domain, output range
    var xMap = function(d) { return xScale(xValue(d));}
    var yValue =function(d){return d.y;}; 
    var yScale = d3.scale.linear().range([-smallestCircle, smallestCircle]).domain([-1,1]);//input domain, output range
    var yMap = function(d) { return yScale(yValue(d));}
    
    
    radViews.getSvg().selectAll(".dot")
      .data(rad)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .on("mouseover", function(d){
        if (d.tip){
          
        }
      })
      .on("mouseout", function(d){
        if (d.tip){
          
        }
      });
    }//renderValue function
})//extend networkOutputBindingRadviz
  
  Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');
  

