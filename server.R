#server.R

require(shiny)
require(TSP)


source("ReadMusicData.R")
options(shiny.maxRequestSize=100*1024^2) 

concorde_path("/home/jorgehpo/Desktop/concorde/TSP")

shinyServer(function(input, output,session) {
  session$dataRadviz = NULL  
  output$myCanvas <- reactive({
    if (is.null(input$file1))
      return(NULL)
    session$dataRadviz = read.csv(input$file1$datapath)
    session$dataRadviz
  })
  
  observe(
    {
      input$cityObj
      if (!is.null(session$dataRadviz)){
        cities = unlist(input$cityObj$cities)
        groupId = unlist(input$cityObj$groupId)
        if (length(cities) > 0){
          dataCols = as.matrix(session$dataRadviz[,cities+1])
          if(length(cities)<=2){
            order = 1:length(cities)
          }else{
            mat = 1-cor(dataCols)
            suppressWarnings({order = solve_TSP(TSP(mat),'concorde')})
          }
          returnObj = list()
          returnObj$cities = input$cityObj$cities[order];
          returnObj$groupId = input$cityObj$groupId;
          session$sendCustomMessage(type='MessageTSPSolved',returnObj)
        }
      }
    }
  )
})
