//scriptRadviz.js #main function called from R shiny

$(document).keypress(function (eventObject) {
    if (eventObject.keyCode == 97){ //pressed 'a' for MAP - distance Matrix
        var x = [];
        var y = [];

        d3.selectAll('.dot').each(function(xx) {
            var _x = parseInt(d3.select(this).attr('cx'));
            var _y = parseInt(d3.select(this).attr('cy'));
            var id = parseInt(d3.select(this).attr('id'));
            x[id] = _x;
            y[id] = _y;
        });

        var nElem = x.length;

        //var dissMatrix = numeric.rep([nElem * nElem], 0);
        var text = ''

        for (var i = 0; i < nElem; i++){
            for (var j = 0; j < nElem; j++){
                //dissMatrix[i*nElem + j] = Math.sqrt(Math.pow(x[i]-x[j],2) + Math.pow(y[i]-y[j],2));
                var d = Math.sqrt(Math.pow(x[i]-x[j],2) + Math.pow(y[i]-y[j],2));
                if (d - 0.001 < 0){
                    text  = text + '0';
                }else{
                    text = text + d.toPrecision(6)
                }
                if (j == nElem-1){
                    text = text + '\n'
                }else{
                    text = text + ' '
                }
            }
        }

        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "Dissimilarity.dat");
    }

    if (eventObject.keyCode == 99){ //pressed 'c'
        var text = '';
        var mySelect = $("#selectionList");
        var options = mySelect.contents();
        for (var i = 0; i < options.length; i++){
            text = text + options[i].value + ',';
        }
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "Indices.txt");
    }
    if (eventObject.keyCode == 109){ //pressed 'm', for mouse
        var distances = [];
        d3.selectAll('.dot').each(function(x){
            var x = parseInt(d3.select(this).attr('cx'));
            var y = parseInt(d3.select(this).attr('cy'));
            var id = parseInt(d3.select(this).attr('id'));
            var mouseX = window.radInterface.radvizViews._mouseX;
            var mouseY = window.radInterface.radvizViews._mouseY;
            var dist = Math.pow(x-mouseX,2) + Math.pow(y-mouseY,2);
            distances[id] = [dist,id+1]; //we are processing in R, which is 1-based
        });

        distances.sort(function(left, right) {
            return left[0] < right[0] ? -1 : 1;
        });

        var ordered = String(distances[0][1]);
        for (i = 1; i < distances.length; i++){
            ordered = ordered + ' ' + String(distances[i][1]);
        }
        ordered = ordered + '\n';
        var blob = new Blob([ordered], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "Indices.dat");
    }
});

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function (scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function (el, info) {
        if (!info){
            return;
        }
        var radviz = new Radviz(info);

        if (window.radInterface) {
            window.radInterface.destroy();
        }

        window.radInterface = new RadvizInterface(radviz,new RadvizViews(el, {diameter: 900, circleOffset: 40}));
        window.radInterface.drawPoints();

        //window.radInterface.addGroup("Grupo Automatico","green");
        //var cols = []; for (var i = 0; i < Math.min(400,Object.keys(info).length); i++){
        //    cols.push(i);
        //}
        //window.radInterface.addDimensionsToGroup(cols,0);


    }//renderValue function
});//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');

