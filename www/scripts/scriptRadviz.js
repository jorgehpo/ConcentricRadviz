//scriptRadviz.js


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

function radviz(data){
  var mData = data.dataFrame //avoid long names
  normalizeData(mData) //normalize columns [0,1]
  var nAnchors = mData[0].length;
  var angle = 2*Math.PI/nAnchors
  var rotMat = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
  
  var anchors = [[0,1]];
  
  for (var i = 1; i < nAnchors; i++){
    var newAnchor = numeric.dot(rotMat, anchors[i-1]);
    anchors.push(newAnchor);
  }
  
  
  var nrow = mData.length;
  var ncol = mData[0].length;
  var proj = [];
  for (var i = 0; i < nrow; i++){
    var yi = numeric.sum(mData[i]);
    var pt = [0,0];
    for (j = 0; j < ncol; j++){
      pt[0] = pt[0] + anchors[j][0] * mData[i][j];
      pt[1] = pt[1] + anchors[j][1] * mData[i][j];
    }
    pt[0] = pt[0]/yi;
    pt[1] = pt[1]/yi;
    proj.push(pt);
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
        
        var xValue = function(d){return d[0];};
        var xScale = d3.scale.linear().range([-smallestCircle, smallestCircle]).domain([-1,1]);//input domain, output range
        var xMap = function(d) { return xScale(xValue(d));}
        var yValue =function(d){return d[1];};
        var yScale = d3.scale.linear().range([-smallestCircle, smallestCircle]).domain([-1,1]);//input domain, output range
        var yMap = function(d) { return yScale(yValue(d));}


        radViews.getSvg().selectAll(".dot")
            .data(rad)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)


    }//renderValue function
})//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');
