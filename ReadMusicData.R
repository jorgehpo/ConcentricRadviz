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
  idsGenreInterest = which(unlist(lapply(varNames,function(x){grepl(genre,x)})))
  idsIgnoreGenres = setdiff(idsGenre, idsGenreInterest)
  ignoreIDs = c(idsNA,idsProbability,idsMirex,idsNot, idsIgnoreGenres)
  
  
  varNames = varNames[-ignoreIDs]
  varNames = gsub(".all","",varNames)
  mat = matrix(0, nrow = length(files), ncol = length(varNames))
  
  positions = regexpr("\\.",varNames)#remove first part of names (before .)
  for (i in 1:length(varNames)){
    varNames[i] = substr(varNames[i],start = positions[i]+1, stop = nchar(varNames[i]))
  }
  
  
  colnames(mat) = varNames
  title = c()
  artist = c()
  filename = c()
  for (fid in seq_len(length(files))){
    js = fromJSON(files[fid])
    bname = basename(files[fid])
    filename = c(filename, substr(bname,start = 1, stop = nchar(bname) - 9)) #remove ".mp3.jpson"
    
    title = c(title, js$metadata$tags$title)
    artist = c(artist, js$metadata$tags$artist)
    vars = unlist(js$highlevel,recursive = T)
    nums = as.numeric(vars)
    nums = nums[-ignoreIDs]
    mat[fid,] = nums
  }
  mat = as.data.frame(mat)
  
  mat = cbind(mat,filename, title, artist)
  
  return (mat)
}
