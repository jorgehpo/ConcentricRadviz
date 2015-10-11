# ui.R

RadvizCanvas <- function (my.id = "myRadvizCanvas"){
  tags$div(id= my.id, class="radvizCanvas",tag("svg",""), width = 8)
}

shinyUI( 
  fluidPage(
    tags$head(
      tags$script(type = "text/javascript", src = "d3.v3/d3.v3.js"),
      tags$script(type = "text/javascript", src = "d3.v3/polybrush.js"),
      tags$link(rel="stylesheet", type="text/css", href="css/radviz.css"),
      tags$script(type="text/javascript", src="numericJS/numeric-1.2.6.min.js"),
      tags$script(type="text/javascript", src="jquery.ui/jquery-ui.min.js"),
      tags$script(type="text/javascript", src="FileSaver/FileSaver.min.js"),
      tags$script(type="text/javascript", src= "scripts/Tooltip.js"),
      tags$script(type="text/javascript", src= "scripts/Selector.js"),
      tags$script(type="text/javascript", src= "scripts/Sigmoid.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizInterface.js"),
      tags$script(type="text/javascript", src= "scripts/Radviz.js"),
      tags$script(type="text/javascript", src= "scripts/TSP_R.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizViews.js"),
      tags$script(type="text/javascript", src= "scripts/RadvizDimensionGroup.js"),
      tags$script(type="text/javascript", src= "scripts/scriptRadviz.js"),
      tags$script(type="text/javascript", src= "scripts/SortAllDGs.js")
    ),
    titlePanel("Concentric Radviz"),
    fluidPage(
      fluidRow(
        column(3,class="well",
          fileInput('file1', 'Choose file to upload',
                    accept = c(
                      'text/csv',
                      'text/comma-separated-values',
                      'text/tab-separated-values',
                      'text/plain',
                      '.csv',
                      '.tsv'
                    )
          ),
          tags$hr(),
          tags$div(class="sidebar-dimensions", checked=NA,
                tags$p("Available Dimensions:"),
                tags$div(class="sidebar-dimensions-list")
          ),
          tags$div(class="sidebar-dimensions", checked=NA,
                  tags$p("Dimensions Groups:"),
                  tags$div(class="sidebar-groups-list"),
                  tags$button(id="btn-add-group",class="btn btn-block btn-primary","Add Group")
          ),
          tags$div(id="dimensionSlider",class="hidden",sliderInput("dimensionSliderController", label = "Slider",min = 0, max = 1, step = 0.1, value = 1)),
          selectInput(inputId = "tooltipDimension", label = "Tooltip Dimension", choices = c(), selected = NULL, multiple = FALSE, selectize=FALSE),
          selectInput(inputId = "colorDimension", label = "Color Dimension", choices = c(), selected = "Draw Selection", multiple = FALSE, selectize=FALSE)
        ),
        column(6,RadvizCanvas("myCanvas")),
        column(3,class="well",strong('Selector'),
          includeHTML("selectorButtons.html"),
          tags$div(id="anchorSelectorSlider",class="",sliderInput("anchorSelectorSliderController", label = "Anchor Distance",min = 0.01, max = 1.0, step = 0.01, value = 0.1)),
          tags$hr(),
          selectInput(inputId = "listDimension", label = "Label Dimension", choices = c(), selected = NULL, multiple = FALSE, selectize=FALSE),
          selectInput(inputId = "selectionList", label = "Selected Elements", choices = c(), selected = NULL, multiple = TRUE, selectize=FALSE),
          includeHTML("selectorButtons2.html"),
        tags$div(id="sigmoidTranslateSlider",class="",sliderInput("sigmoidTranslateSliderController", label = "Sigmoid Translate",min = -1.0, max = 1.0, step = 0.01, value = 1.0)),
        tags$div(id="sigmoidScaleSlider",class="",sliderInput("sigmoidScaleSliderController", label = "Sigmoid Scale",min = 0, max = 100.0, step = 0.1, value = 10.0)),
        tags$div(id="drawSigmoid",class="",style="height: 120px; width: 100%")

        )
      )
    )#,
    #includeHTML("modal.html")
  )
)