function TSP(callbackSolution){
    this.description = "sends and receives data from R package TSP";

    Shiny.addCustomMessageHandler("MessageTSPSolved",
        callbackSolution
    );
}

TSP.prototype.solveTSPCities = function(cities, groupId){
    //send data to R
    //remember in R code that cities is 0-based. index (cities +1)
    console.log("Solve group: " + groupId);
    var cityObj = {cities:cities,groupId:groupId};
    Shiny.onInputChange("cityObj", cityObj);
};


