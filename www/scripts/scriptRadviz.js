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
      var aux = anchors[j].slice();
      var k = aux.length;
      while (--k){
        aux[k] = aux[k] * mData[i][j];
      }
      pt = numeric.add(pt, aux);
    }
    k = pt.length;
    while(--k){
      pt[k] = pt[k]/yi;
    }
    console.log(pt)
    proj.push(pt);
  }
  console.log(proj)
  return (proj)
}//end - function radviz


var networdOutputBindingRadviz = new Shiny.OutputBinding();
  $.extend(networdOutputBindingRadviz, {
    find: function(scope) {
      return $(scope).find('.radvizCanvas');
    },
    renderValue: function(el, data){
  	var diameter = 800, //size of the whole SVG (bundle + labels)
		radius = diameter / 2, //radius of the whole SVG
		innerRadius = radius - 110; //radius of the bundle
		
		var svg = d3.select(el).select("svg");
	  svg.remove();		


		svg = d3.select(el).append("svg")
			.attr("width", diameter)
			.attr("height", diameter);
			//.append("g")
			//.attr("transform", "translate(" + radius + "," + radius + ")");

    rad = radviz(data)
    
    var xValue = function(d){return d[0];};
    var xScale = d3.scale.linear().range([0, diameter]).domain([-1,1]);//input domain, output range
    var xMap = function(d) { return xScale(xValue(d));}
    var yValue =function(d){return d[1];}; 
    var yScale = d3.scale.linear().range([0, diameter]).domain([-1,1]);//input domain, output range
    var yMap = function(d) { return yScale(yValue(d));}
    
    
    svg.selectAll(".dot")
      .data(rad)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)

    
    }//renderValue function
  })//extend networkOutputBindingRadviz

  
  Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');
