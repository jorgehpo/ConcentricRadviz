//scriptRadviz.js #main function called from R shiny

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function (scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function (el, info) {
        if (!info){
            return;
        }
        var radviz = null;
        if (info.tooltip){
            radviz = new Radviz(info, info.tooltip);
        }else{
            radviz = new Radviz(info);
        }

        window.radInterface = new RadvizInterface(radviz,new RadvizViews(el, {diameter: 800, circleOffset: 20}));
        window.radInterface.drawPoints();
    }//renderValue function
})//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');

