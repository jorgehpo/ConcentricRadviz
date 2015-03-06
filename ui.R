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
      tags$script(type="text/javascript", src="jquery.ui/jquery-ui.min.js"),
      tags$script(type="text/javascript", src= "scripts/Tooltip.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizInterface.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizCore.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizViews.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizDimensionGroup.js"),
      tags$script(type="text/javascript", src= "scripts/scriptRadviz.js")
      
    ),
    titlePanel("Concentric Radviz"),
    sidebarLayout(
      sidebarPanel("Menu pra colocar alguma coisa",
        selectInput(inputId = "n_breaks",
              label = "Dataset:",
              choices = c("Dataset 1", "Dataset 2", "Dataset 3", "Dataset 4"),
              selected = "Dataset 1"
        ),
        tags$div(class="sidebar-dimensions", checked=NA,
              tags$p("Available Dimensions:"),
              tags$div(class="sidebar-dimensions-list")
        ),
        tags$div(class="sidebar-dimensions", checked=NA,
                tags$p("Dimensions Groups:"),
                tags$div(class="sidebar-groups-list"),
                tags$button(id="btn-add-group",class="btn btn-block btn-primary","Add Group")
        ),
      width=3),
      mainPanel(RadvizCanvas("myCanvas"),width=7)
    )
  )
)