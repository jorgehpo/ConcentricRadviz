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
        window.radviz = null;
        if (info.tooltip){
            window.radviz = new Radviz(info, info.tooltip);
        }else{
            window.radviz = new Radviz(info);
        }

        window.radInterface = new RadvizInterface(window.radviz,new RadvizViews(el, {diameter: 800, circleOffset: 20}));
        window.radInterface.drawPoints();
    }//renderValue function
})//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');

