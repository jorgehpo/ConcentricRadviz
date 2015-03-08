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
        var radviz = new Radviz(info.data);//, info.tags.filename);
        window.radInterface = new RadvizInterface(radviz,new RadvizViews(el, {diameter: 800, circleOffset: 20}));
        window.radInterface.drawPoints();
    }//renderValue function
})//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');

