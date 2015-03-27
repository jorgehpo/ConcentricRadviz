function TSP(callbackSolution){
    this.description = "sends and receives data from R package TSP";

    Shiny.addCustomMessageHandler("MessageTSPSolved",
        callbackSolution
    );
}

TSP.prototype.solveTSPCities = function(cities){
    //send data to R
    //remember in R code that cities is 0-based. index (cities +1)
    Shiny.onInputChange("cities", cities);
};


