require(RJSONIO)

generateDataRecursive <- function(json.folder, genre = "genre_tzanetakis"){

  files= list.files(json.folder,recursive = T,full.names = T)
  js = fromJSON(files[1])
  vars = unlist(js$highlevel,recursive = T)
  varNames = names(vars)
  nums = as.numeric(vars)
  idsNA = which(is.na(nums))
  
  #columns to ignore
  idsProbability = which(unlist(lapply(varNames,function(x){grepl('probability',x)})))
  idsMirex = which(unlist(lapply(varNames,function(x){grepl('mirex',x)})))
  idsNot = which(unlist(lapply(varNames,function(x){grepl('not',x)})))
  idsGenre = which(unlist(lapply(varNames,function(x){grepl('genre',x)})))
  idsGenreInterest = which(unlist(lapply(varNames,function(x){grepl('genre_tzanetakis',x)})))
  idsIgnoreGenres = setdiff(idsGenre, idsGenreInterest)
  ignoreIDs = c(idsNA,idsProbability,idsMirex,idsNot, idsIgnoreGenres)
  
  
  varNames = varNames[-ignoreIDs]
  varNames = gsub(".all","",varNames)
  mat = matrix(0, nrow = length(files), ncol = length(varNames))
  colnames(mat) = varNames
  ret = list()
  ret$tags = list()
  ret$tags$title = c()
  ret$tags$artist = c()
  ret$tags$filename = c()
  for (fid in seq_len(length(files))){
    js = fromJSON(files[fid])
    bname = basename(files[fid])
    ret$tags$filename = c(ret$tags$filename, substr(bname,start = 1, stop = nchar(bname) - 9)) #remove ".mp3.jpson"
    
    ret$tags$title = c(ret$tags$title, js$metadata$tags$title)
    ret$tags$artist = c(ret$tags$artist, js$metadata$tags$artist)
    vars = unlist(js$highlevel,recursive = T)
    nums = as.numeric(vars)
    nums = nums[-ignoreIDs]
    mat[fid,] = nums
  }
  ret$data = as.data.frame(mat)
  return (ret)
}


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
  
  ret$dataFrame = matGenre
  ret$varNames = genres
  
  return (ret)
}