//scriptRadviz.js #main function called from R shiny

var networdOutputBindingRadviz = new Shiny.OutputBinding();
$.extend(networdOutputBindingRadviz, {
    find: function (scope) {
        return $(scope).find('.radvizCanvas');
    },
    renderValue: function (el, info) {
        var radviz = processDataset(info);
        window.radInterface = new RadvizInterface(radviz,new RadvizViews(el, {diameter: 800, circleOffset: 20}));
        window.radInterface.drawPoints();
        //Obter posição de uma dimensão
        //radInterface.getDimensionPosition(dimension_id);
    }//renderValue function
})//extend networkOutputBindingRadviz


Shiny.outputBindings.register(networdOutputBindingRadviz, 'binding.radviz');


function processDataset (info) {
    //%%%%%%%%%%%%%%%%% RADVIZ AND PLOTTING %%%%%%%%%%%%%%%%%%%%%%%
    //var columnsGenre = ["genre_tzanetakis.blu", "genre_tzanetakis.cla", "genre_tzanetakis.cou", "genre_tzanetakis.dis", "genre_tzanetakis.hip", "genre_tzanetakis.jaz", "genre_tzanetakis.met", "genre_tzanetakis.pop", "genre_tzanetakis.reg", "genre_tzanetakis.roc"];
    //var columnsHumor = ["mood_acoustic.acoustic", "mood_aggressive.aggressive", "mood_electronic.electronic", "mood_happy.happy", "mood_party.party", "mood_relaxed.relaxed", "mood_sad.sad"];
    return new Radviz(info.data, info.tags.filename);
}