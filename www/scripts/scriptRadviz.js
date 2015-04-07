//scriptRadviz.js #main function called from R shiny

$(document).keypress(function (eventObject) {
    if (eventObject.keyCode == 99){ //pressed 'c'
        var text = '';
        var mySelect = $("#selectionList");
        var options = mySelect.contents();
        for (var i = 0; i < options.length; i++){
            text = text + options[i].value + ',';
        }
        alert(text);
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

