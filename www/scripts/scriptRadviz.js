//scriptRadviz.js

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);
    
    
  var teste = d3.select("body").append("div")
    .style("width", "200px")
    .style("height", "200px")
    .style("fill", "c0392b");


function normalizeData(m){
  var min = m[0].slice() //copy array by value
  var max = m[0].slice() //copy array by value
  for (var i = 0; i < m.length; i++){
    for (var j = 0; j < m[0].length; j++){
      if (m[i][j] < min[j]){
        min[j] = m[i][j]
      }
      if (m[i][j] > max[j]){
        max[j] = m[i][j]
      }
    }
  }
    
  for (var i = 0; i < m.length; i++){
    for (var j = 0; j < m[0].length; j++){
      m[i][j] = (m[i][j] - min[j]) / (max[j] - min[j])
    }
  }
}


function selectColumns(data, columns){
  var mat = [];
  columns.forEach(function (c){
    mat.push(data[c])
  });
  mat = numeric.transpose(mat)
  return (mat)
}



function radviz(data, tooltip){
  normalizeData(data) //normalize columns [0,1]
  var nAnchors = data[0].length;
  var angle = 2*Math.PI/nAnchors
  var rotMat = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
  
  var anchors = [[0,1]];
  
  for (var i = 1; i < nAnchors; i++){
    var newAnchor = numeric.dot(rotMat, anchors[i-1]);
    anchors.push(newAnchor);
  }
  
  
  var nrow = data.length;
  var ncol = data[0].length;
  var proj = [];
  for (var i = 0; i < nrow; i++){
    var yi = numeric.sum(data[i]);
    var _x = 0 , _y = 0;
    for (j = 0; j < ncol; j++){
      _x = _x + anchors[j][0] * data[i][j];
      _y = _y + anchors[j][1] * data[i][j];
    }
    _x = _x/yi;
    _y = _y/yi;
    if (tooltip){
      proj.push({x:_x, y:_y, tip:tooltip[i]});
    }else{
      proj.push({x:_x, y:_y});
    }
  }
  return (proj)
}//end - function radviz


var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function(scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function(el, data){

        //-----------------------------
        //-Código de Exemplo
        var radViews = new RadvizViews(el,{diameter: 800, circleOffset: 20});

        radViews.addCircle(new RadvizViewsCircle("Group 1","#27ae60",[{name: "A", pos: 0},{name: "B", pos: 90},{name: "C", pos: 180},{name: "D", pos: 270}]));
        radViews.addCircle(new RadvizViewsCircle("Group 2","#16a085",[{name: "E", pos: 45},{name: "F", pos: 135},{name: "G", pos: 225}]));
        radViews.addCircle(new RadvizViewsCircle("Group 3","#2980b9",[{name: "H", pos: 30},{name: "I", pos: 195},{name: "J", pos: 260}]));

        setTimeout(function () {
            radViews.removeCircle(1);
        },1500);
        setTimeout(function () {
            radViews.addCircle(new RadvizViewsCircle("Group 4","#16a085",[{name: "W", pos: 60},{name: "Y", pos: 145},{name: "Z", pos: 230}]));
        },2500);
        rad = radviz(data);

        var smallestCircle = radViews.getSmallestCircleRadius();
        //-----------------------------
   
    //%%%%%%%%%%%%%%%%% RADVIZ AND PLOTTING %%%%%%%%%%%%%%%%%%%%%%%
    var columnsGenre = ["genre_tzanetakis.blu", "genre_tzanetakis.cla", "genre_tzanetakis.cou", "genre_tzanetakis.dis", "genre_tzanetakis.hip", "genre_tzanetakis.jaz", "genre_tzanetakis.met", "genre_tzanetakis.pop", "genre_tzanetakis.reg", "genre_tzanetakis.roc"];
    
    var columnsHumor = ["mood_acoustic.acoustic",   "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad" ];
    
    var mydat = selectColumns(info.data, columnsGenre);
    
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
          console.log(d3.event.pageX + " "+ d3.event.pageY)
          console.log(d.tip)
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.tip)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        }
      })
      .on("mouseout", function(d){
        if (d.tip){
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
        }
      });
    }//renderValue function
})//extend networkOutputBindingRadviz
  
  Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');
  

