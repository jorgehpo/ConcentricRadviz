# ui.R

RadvizCanvas <- function (my.id = "myRadvizCanvas"){
  tags$div(id= my.id, class="radvizCanvas",tag("svg",""), width = 8)
}

shinyUI( 
  fluidPage(
    tags$head(
      tags$script(type = "text/javascript", src = "d3.v3/d3.v3.js"),
      tags$link(rel="stylesheet", type="text/css", href="css/radviz.css"),
      tags$script(type="text/javascript", src="numericJS/numeric-1.2.6.min.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizViews.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizViewsCircle.js"),
      tags$script(type="text/javascript", src= "scripts/scriptRadviz.js")
      
    ),
    titlePanel("Concentric Radviz"),
    sidebarLayout(
      sidebarPanel("Menu pra colocar alguma coisa"),
      mainPanel(
        RadvizCanvas("myCanvas")
        ,width=7)
    )
    
  )
)