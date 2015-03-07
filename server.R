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
  data <- generateDataRecursive("data/CoversJ")
  #data <- list(data=iris[,1:4], tags=list(filename=iris[,5]))
  output$myCanvas <- reactive(data)
})
