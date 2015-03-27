#server.R

require(shiny)
require(TSP)


source("ReadMusicData.R")
options(shiny.maxRequestSize=100*1024^2) 



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
      cat("cities",unlist(input$cityObj$cities)+1,"\n")
      cat("groupId",input$cityObj$groupId,"\n")
      
      if (!is.null(session$dataRadviz)){
        cities = unlist(input$cityObj$cities)
        groupId = unlist(input$cityObj$groupId)
        if (length(cities) > 0){
          dataCols = session$dataRadviz[,cities+1]
          mat = 1-cor(as.matrix(dataCols))
          order = as.integer(solve_TSP(TSP(mat)))
          returnObj = list()
          returnObj$cities = input$cityObj$cities[order];
          returnObj$groupId = input$cityObj$groupId;
          session$sendCustomMessage(type='MessageTSPSolved',returnObj)
        }
      }
    }
  )
})
