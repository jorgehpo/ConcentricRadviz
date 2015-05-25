#SortAllDGs.R

require(GA)

MAPmeasure <- function(classes, dissMatrix){
  nSongs = nrow(dissMatrix)
  sumAllPrecision = 0
  for (i in 1:nSongs){
    listRetrievalAll = sort.list(dissMatrix[i,],dec=F)
    listRetrieval = setdiff(listRetrievalAll, i)
    thisClass = classes[i]
    idxCorrect = which(classes[listRetrieval] == thisClass)
    sumPrecision = 0
    nCorrect = 0
    if (length(idxCorrect) > 0){
      for (j in 1:length(idxCorrect)){
        sumPrecision=sumPrecision+(j/idxCorrect[j])
      }
      songPrecision = sumPrecision/length(idxCorrect)
      sumAllPrecision = sumAllPrecision + songPrecision
    }
  }
  MAP = sumAllPrecision/(nSongs)
  MAP
}


makeFunction <- function(DAs, dataset, n.DA, classes){
  force(DAs)
  force(dataset)
  force(n.DA)
  force(classes)
  return(function (thetas){
      #rotate DAs
      startID = cumsum(c(1, n.DA))
      curDAs = DAs
      for (i in 1:length(n.DA)){
        rot.mat = matrix(c(cos(thetas[i]), -sin(thetas[i]), sin(thetas[i]), cos(thetas[i])),nrow = 2,ncol = 2, byrow = T)
        curDAs[startID[i]:(startID[i]+n.DA[i]-1),] = DAs[startID[i]:(startID[i]+n.DA[i]-1),] %*% rot.mat
      }
    
      projected = dataset %*% curDAs #dataset is already normalized: just sum product per DA
      
      return (MAPmeasure(classes, as.matrix(dist(projected))))
    
    })
}

sortAllDGs <- function(dgs, dataset = NULL, classes = NULL){
  if (length(dgs) < 2){
    return (0) #0 rotation 
  }
  
  
  DAs = NULL
  #possibilities = list()
  #offsetPossibilities = c(0)
  n.dimensions = 0
  n.DGs = length(dgs)
  n.DA = c()
  
  for (i in 1:n.DGs){
    angles_i = unlist(dgs[i])
    DAs = rbind(DAs, DAsfromAngles(angles_i))
  #  possibilities[[length(possibilities)+1]] = 1:length(angles_i)
   # if (i>1){
  #    offsetPossibilities = c(offsetPossibilities, length(unlist(dgs[i-1])))
  #  }
    n.DA = c(n.DA, length(angles_i))
    n.dimensions = n.dimensions + length(angles_i)
  }
  
  cat("--> Dentro da funcao sortAllDGS\n")
  #offsetPossibilities = cumsum(offsetPossibilities)
  #possibilities = as.matrix(expand.grid(possibilities)) 
  #possibilities = generateDFromPossibilities(possibilities, n.dimensions, offsetPossibilities) / n.DGs
  #if (is.null(dataset)){
  #  otmFunction = makeFunction(DAs,possibilities, n.DA)  
  #}else{
  otmFunction = makeFunction(DAs, dataset, n.DA, classes = classes)
  #}
  
  o = ga(type = 'real-valued', fitness = otmFunction, min = rep(0, n.DGs), max = rep(2*pi, n.DGs), maxiter = 40, pmutation = .5)
  
  #o = optim(rep(0, n.DGs), otmFunction)
  
  #print(o)
  
  angles = o@solution
  
  anglesObj = list()
  
  for (i in 1:n.DGs){
    anglesObj[names(dgs)[i]] = angles[i]
  }
  
  return (anglesObj)
}

generateDFromPossibilities = function(possibilities, n.dimensions, offsetPossibilities){
  D = matrix(0, nrow = nrow(possibilities), ncol = n.dimensions)
  for (i in 1:nrow(possibilities)){
    D[i,possibilities[i,] + offsetPossibilities] = 1
  }
  return (D)
}
