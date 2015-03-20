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

        if (window.radInterface) {
            window.radInterface.destroy();
        }

        window.radInterface = new RadvizInterface(radviz,new RadvizViews(el, {diameter: 900, circleOffset: 40}));
        window.radInterface.drawPoints();
    }//renderValue function
})//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');

