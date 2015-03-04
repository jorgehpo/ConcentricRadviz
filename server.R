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
  data <- generateDataGenre("/media/Dados/Experimentos/StreamingExtractorArchiveMusic/CoversJ/")

  output$myCanvas <- reactive(data)
})
