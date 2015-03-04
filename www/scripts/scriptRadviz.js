//scriptRadviz.js


function normalizeData(m){
  var min = [m[0].length];
  for (var i = 0; i < m.length; i++){
    for (var j = 0; j < m[0].length; j++){
      
    }
  }
}

function radviz(data){
  //data = normalize.data(data)
  
  //angle = 2*pi/n.anchors
  
  mData = normalizeData(data.matrixData.originalData)
  nAnchors = mData[0].length;//n.anchors = ncol(data)
  rotMat = [[math.cos(angle), -math.sin(angle)], [math.sin(angle), math.cos(angle)]];
  for (i = 0; i < mData.length; i++){
    for (j = 0; j < mData[0].length; i++){
      
    }
  }
}


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
			.attr("height", diameter)
			.append("g")
			.attr("transform", "translate(" + radius + "," + radius + ")");

    //Código do desenho vai aqui
    var circle = svg.append("circle")
                         .attr("cx", 0)
                         .attr("cy", 0)
                         .attr("r", radius);
		
      
  alert(data.matrixData.originalData.length+ " "+ data.matrixData.originalData[1].length)
  
    rad = radviz(data)
    
    }//renderValue function
  })//extend networkOutputBindingRadviz

  
  Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');
