#####
#MAP do Gustavo. Funciona melhor
#####

MAPmeasure <- function(classes, dissMatrix){
  nSongs = nrow(dissMatrix)
  #soma precisões das musicas
  sumAllPrecision = c(0)
  #para cada música
  for (i in 1:nSongs){
    #indices da lista ordenada
    listRetrievalAll = sort.list(dissMatrix[i,],dec=F)
    #indices da lista sem a música corrente
    listRetrieval = setdiff(listRetrievalAll, i)
    #classe do elemento corrente
    thisClass = classes[i]
    #indices das musicas covers existentes na lista na própria lista
    idxCorrect = which(classes[listRetrieval] == thisClass)
    #soma das frações onde existe cover
    sumPrecision = 0
    nCorrect = 0
    #print(listRetrieval)
    #Gustavo:
    for (j in 1:length(idxCorrect)){
      #print(j/idxCorrect[j])
      sumPrecision=sumPrecision+(j/idxCorrect[j])
    }
    #divisão da soma pela quantidade de covers - equivalente a nCorrect
    #songPrecision = sumPrecision/nCorrect
    #gustavo:
    if (length(idxCorrect) > 0){
      songPrecision = sumPrecision/length(idxCorrect)
    }
    #soma precisão para média geral
    sumAllPrecision = sumAllPrecision + songPrecision
  }
  #média geral - divide precisão somada pela quantidade de músicas -1
  MAP = sumAllPrecision/(nSongs)
  MAP
}