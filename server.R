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
      cat("cities",unlist(input$cityObj$cities),"\n")
      cat("groupId",input$cityObj$groupId,"\n")

#      if (!is.null(session$dataRadviz)){

#      }
#        dataCols = session$dataRadviz[unlist(input$cityObj$cities)+1] #input$cities eh 0-based (javascript)
#        mat = 1-cor(dataCols)
#        order = as.integer(solve_TSP(TSP(mat)))
#        returnObj = list()
#        returnObj$cities = input$cityObj$cities[order];
#        returnObj$groupId = input$cityObj$groupId;
#        session$sendCustomMessage(type='MessageTSPSolved',returnObj)
#      }
    }
  )
})
