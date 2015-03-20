#server.R

require(shiny)
source("ReadMusicData.R")
options(shiny.maxRequestSize=50*1024^2) 

inputSongs <- function(text){
  array = eval(parse(text=text))
  if (length(array) == 1){
    array = c(array,array)
  }
  return (array)
}

fast_normalize01 <- function(x) { 
  x <- sweep(x, 2, function(x){ifelse(class(x)=='numeric', apply(x, 2, min), x)}) 
  sweep(x, 2, apply(x, 2, max), "/") 
}

shinyServer(function(input, output,session) {
  #data <- generateDataRecursive("/media/Dados/Experimentos/StreamingExtractorArchiveMusic/PersonalSongs/")
  #data <- generateDataRecursive("data/CoversJ")
  #data <- list(data=iris[,1:4], tags=list(filename=iris[,5]))
  
  
  #output$myCanvas <- reactive(data)
  
  
  output$myCanvas <- reactive({
    if (is.null(input$file1))
      return(NULL)
    read.csv(input$file1$datapath)
  })
})
