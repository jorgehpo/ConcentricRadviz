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
      input$cities
      if (!is.null(session$dataRadviz)){
        dataCols = session$dataRadviz[input$cities+1] #input$cities eh 0-based (javascript)
        mat = 1-cor(dataCols)
        order = as.integer(solve_TSP(TSP(mat)))
        session$sendCustomMessage(type='MessageTSPSolved',input$cities[order])
      }
    }
  )
})
