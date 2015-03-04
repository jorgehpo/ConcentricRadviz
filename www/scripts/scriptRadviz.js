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
		innerRadius = radius - 110, //radius of the bundle
        maxCircleRadius = radius - 20;
		
		var svg = d3.select(el).select("svg");
	  svg.remove();		
    
    var dimensions = [{name: "A", pos: 0},{name: "B", pos: 90},{name: "C", pos: 180},{name: "D", pos: 270}];
    var dimensionsGroups = [
        {groupname: "Group 1",
            radius: radius - 20,
            color: "#27ae60",
            dimensions: [{name: "A", pos: 0},{name: "B", pos: 90},{name: "C", pos: 180},{name: "D", pos: 270}],
            dimensionsObjects: []
        },
        {groupname: "Group 2",
            radius: radius - 60,
            color: "#16a085",
            dimensions: [{name: "E", pos: 45},{name: "F", pos: 135},{name: "G", pos: 225}],
            dimensionsObjects: []
        },
        {groupname: "Group 2",
            radius: radius - 100,
            color: "#2980b9",
            dimensions: [{name: "H", pos: 30},{name: "I", pos: 195},{name: "J", pos: 260}],
            dimensionsObjects: []
        }
    ];
    var drag = {dragging: false,element: ""};

		svg = d3.select(el).append("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.append("g")
			.attr("transform", "translate(" + radius + "," + radius + ") scale (1,-1)");
    
    var background = svg.append("rect")
                         .attr("x", -radius)
                         .attr("y", -radius)
                         .attr("width", diameter)
                         .attr("height", diameter)
                         .style("fill","white");
                         
    //Código do desenho vai aqui
        dimensionsGroups.forEach(function (gr,gidx) {

            var circle = svg.append("circle")
                .attr("cx", 0).attr("class","dimension-group dimension-group-" + gidx)
                .attr("cy", 0)
                .attr("r", gr.radius)
                .style("fill","none")
                .style("stroke", gr.color)
                .style("stroke-width","6");

            gr.dimensions.forEach(function (d,i) {
                var dimG = svg.append("g")
                    .attr("class","dimension dimension-" + d.name)
                    .attr('data-element',i)
                    .attr('data-group',gidx)
                    .attr("transform", "rotate(" + d.pos + ")")
                    .attr("width",16)
                    .attr("height",16)
                    .style("cursor","move")
                    .on("mousedown", function () {
                        drag.dragging = true;
                        drag.element = "dimension-" + d.name;
                        d3.selectAll(".dimension-" + d.name).classed("selected",true);
                    });
                dimG.append("circle")
                    .attr("cx", gr.radius)
                    .attr("cy", 0)
                    .attr("r", 9)
                    .style("fill","#2c3e50")
                    .style("stroke","none")
                dimG.append("text")
                    .attr("dx", -5)
                    .attr("dy", 4.5)
                    .text(d.name)
                    .style("fill","lightGray")
                    .attr("transform", "translate(" + gr.radius + ",0) rotate(" + (180 - d.pos) + ") scale(-1,1)");

                gr.dimensionsObjects[i] = dimG;
            });
        });

    svg.on('mouseup', function () {
        drag.dragging = false;
        drag.element = "";
        d3.selectAll(".dimension").classed("selected",false);
    });

    svg.on('mousemove', function () {
        if (drag.dragging) {
            var x = d3.mouse(this)[0];
            var y = d3.mouse(this)[1];
            var element = d3.select("." + drag.element).attr("data-element");
            var group = d3.select("." + drag.element).attr("data-group");

            var hlin = Math.sqrt(x * x + y * y);
            var ylin = maxCircleRadius / hlin * y;

            var sen = ylin / maxCircleRadius;
            var arc = Math.asin(sen);
            if (x < 0) {
                arc = Math.PI - arc;
            }

            dimensionsGroups[group].dimensions[element].pos = (arc/(Math.PI/180));
            d3.select("." + drag.element).attr("transform", "rotate(" + (arc/(Math.PI/180)) + ")");
            d3.select("." + drag.element + " text").attr("transform", "translate(" + dimensionsGroups[group].radius + ",0) rotate(" + (180 - (arc/(Math.PI/180))) + ") scale(-1,1)");
        }
    });

  //alert(data.matrixData.originalData.length+ " "+ data.matrixData.originalData[1].length)
  
    rad = radviz(data)
    
    var xValue = function(d){return d[0];};
    var xScale = d3.scale.linear().range([-radius, radius]).domain([-1,1]);//input domain, output range
    var xMap = function(d) { return xScale(xValue(d));}
    var yValue =function(d){return d[1];}; 
    var yScale = d3.scale.linear().range([-radius, radius]).domain([-1,1]);//input domain, output range
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
