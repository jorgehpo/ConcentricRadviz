#server.R

require(shiny)
source("ReadMusicData.R")


inputSongs <- function(text){
  array = eval(parse(text=text))
  if (length(array) == 1){
    array = c(array,array)
  }
  return (array)
}

shinyServer(function(input, output,session) {
  #data <- generateDataRecursive("/media/Dados/Experimentos/StreamingExtractorArchiveMusic/PersonalSongs/")
  #data <- generateDataRecursive("data/CoversJ")
  #data <- list(data=iris[,1:4], tags=list(filename=iris[,5]))
  
  
  #output$myCanvas <- reactive(data)
  
  
  output$myCanvas <- reactive(function(){
    if (is.null(input$file1))
      return(NULL)
    list(data = read.csv(input$file1$datapath))
  })
})
