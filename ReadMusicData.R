require(RJSONIO)

generateDataGenre <- function(json.folder, genreType = "genre_tzanetakis"){
  files= list.files(json.folder,recursive = T,full.names = T)
  js = fromJSON(files[1])
  genres = names(js$highlevel[[genreType]]$all)
  matGenre = matrix(0, nrow = length(files), ncol = length(genres))
  classes = c()
  songTitles = c()
  songArtists = c()
  for (fid in seq_len(length(files))){
    js = fromJSON(files[fid])
    classes = c(classes, js$highlevel[[genreType]]$value)
    for (gid in seq_len(length(genres))){
      g = genres[gid]
      matGenre[fid, gid] = js$highlevel[[genreType]]$all[[g]] 
    }
    songTitles = c(songTitles, js$metadata$tags$title)
    songArtists = c(songArtists, js$metadata$tags$artist)
  }
  
  ret = list()
  
  ret$songClass = classes
  
  ret$tags = list()
  ret$tags$songTitles = songTitles
  ret$tags$songArtists = songArtists
  
  ret$matrixData = list()
  ret$matrixData$originalData = matGenre
  ret$matrixData$varNames = genres
  
  #colnames(matGenre) = genres
  #r = radviz(matGenre)
  #ret$radviz =r
  
  return (ret)
}