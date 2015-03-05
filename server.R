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
  #data <- generateDataRecursive("/media/Dados/Experimentos/StreamingExtractorArchiveMusic/PersonalSongs/")
  output$myCanvas <- reactive(data)
})
