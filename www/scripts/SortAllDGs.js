//SortAllDGs.js

function SortAllDGs(callbackSolution){

    this.callbackSolution = callbackSolution;
    Shiny.addCustomMessageHandler("MessageDGsSolved",
        //a funcao nao vai ser a mesma (a cada inicializacao), mas funciona
        this.callbackSolution
    );
}

SortAllDGs.prototype.setCallbackSolution = function(callbackSolution){
    this.callbackSolution = callbackSolution;
};

SortAllDGs.prototype.solveSortAllDGs = function(dgs, idsDAs, scale, translate){
    //send data to R
    Shiny.onInputChange("SortAllDGs", {dgs:dgs, idsDAs:idsDAs, sigmoidScale: scale, sigmoidTranslate:translate});
};


