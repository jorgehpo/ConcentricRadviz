function TSP(callbackSolution){

    this.callbackSolution = callbackSolution;
    Shiny.addCustomMessageHandler("MessageTSPSolved",
        //a funcao nao vai ser a mesma (a cada inicializacao), mas funciona
        this.callbackSolution
    );
}

TSP.prototype.setCallbackSolution = function(callbackSolution){
    this.callbackSolution = callbackSolution;
};

TSP.prototype.solveTSPCities = function(cities, groupId){
    //send data to R
    //remember in R code that cities is 0-based. index (cities +1)
    console.log("Solve group: " + groupId);
    var cityObj = {cities:cities,groupId:groupId};
    Shiny.onInputChange("cityObj", cityObj);
};


