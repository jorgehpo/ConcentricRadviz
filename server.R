#server.R

require(shiny)
require(TSP)

source("SortAllDGs.R")
source("OffsetDG.R")

sigmoid <- function(x, s=10, t= -1){
  return (1/(1+exp(-s*(x+t))))
}


options(shiny.maxRequestSize=100*1024^2) 

#concorde_path("/home/jorgehpo/Desktop/concorde/TSP")

shinyServer(function(input, output,session) {
  dataRadviz = NULL  
  output$myCanvas <- reactive({
    if (is.null(input$file1))
      return(NULL)
    dataRadviz <<- read.csv(input$file1$datapath)
    dataRadviz
  })
  
  observe({
    if ((!is.null(input$SortAllDGs)) && (!is.null(dataRadviz))){
      cat("===============================================\n")
      cat("Comecou a ordenacao...",date(),"\n")
      cat("===============================================\n")
      retSort = list()
      retSort$DGs = input$SortAllDGs$dgs
      retSort$anchorAngles = input$SortAllDGs$dgs
      retSort$anchorIndex = input$SortAllDGs$idsDAs


      
      nSamp = min(500, nrow(dataRadviz))
      samp = sample(1:nrow(dataRadviz), nSamp)
      classes = matrix(0, nrow = nSamp, ncol = 0)
      dataset = matrix(0, ncol = 0, nrow = nSamp)
      

      for (i in 1:length(input$SortAllDGs$dgs)){
        myD = dataRadviz[samp, as.numeric(input$SortAllDGs$idsDAs[[i]]) + 1]
        classes = cbind(classes, apply(myD, 1, which.max))
        myD = sweep(myD, MARGIN = 1, apply(myD,MARGIN = 1, max), FUN = "/") #normaliza por linha de forma bonita
        dataset = cbind(dataset, myD)
      }
      dataset = sigmoid(dataset, s= input$SortAllDGs$sigmoidScale, t= input$SortAllDGs$sigmoidTranslate)
      classes = apply(classes, 1, paste, collapse = "")
      dataset = sweep(dataset, MARGIN = 1, apply(dataset,MARGIN = 1, sum), FUN = "/") #todo mundo soma 1
      dataset = as.matrix(dataset)
      retSort$offsets = sortAllDGs(input$SortAllDGs$dgs, dataset = dataset, classes = classes)
      #print(paste("=============input: ",date()))
      #print(input$SortAllDGs)
      #print(dataset)
      session$sendCustomMessage(type='MessageDGsSolved',retSort)
    }
  })
  
  observe(
    {
      input$cityObj
      if (!is.null(dataRadviz)){
        cities = unlist(input$cityObj$cities)
        groupId = unlist(input$cityObj$groupId)
        anglesUsed = unlist(input$cityObj$anglesUsed)
        if (length(cities) > 0){
          dataCols = as.matrix(dataRadviz[,cities+1])
          if(length(cities)<=2){
            order = 1:length(cities)
          }else{
            mat = 1-cor(dataCols)
            suppressWarnings({order = solve_TSP(TSP(mat))})
          }
          returnObj = list()
          returnObj$cities = input$cityObj$cities[order];
          returnObj$groupId = input$cityObj$groupId;
          returnObj$offset = computeOffsetDG(anglesUsed, length(cities))
          session$sendCustomMessage(type='MessageTSPSolved',returnObj)
        }
      }
    }
  )
})
