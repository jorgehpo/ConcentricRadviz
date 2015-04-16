source('MAPMeasure.R')


Precision <- function(retrieved, relevant){ #r-precision se considera soh os |relevantes| primeiros retrieved
  return (sum (retrieved %in% relevant) / length(retrieved) )
}


Recall <- function(retrieved, relevant){
  return (sum (retrieved %in% relevant) / length(relevant) )
}

MIR = read.csv("data/MIR_Dortmund.csv")
auxGenre = MIR[,6:14] #from alternative to rock
genreClass = colnames(auxGenre)[apply(auxGenre, 1, which.max)]


auxSinger = MIR[,c("male","female")]
singerClass = colnames(auxSinger)[apply(auxSinger, 1, which.max)]

auxMood = MIR[,c("happy", "sad")]
moodClass = colnames(auxMood)[apply(auxMood,1,which.max)]

auxInst = MIR[,c("voice","instrumental")]
instrumentClass = colnames(auxInst)[apply(auxInst,1,which.max)]

auxTempo = MIR[,c("aggressive", "relaxed")]
tempoClass = colnames(auxTempo)[apply(auxTempo, 1, which.max)]

ret = list()

#test Genre without sigmoid
cat('test Genre without sigmoid\n')
mat = as.matrix(read.table("OriginalRadvizGenre/Dissimilarity.dat"))
ret$OriginalRadvizGenre = list()
ret$OriginalRadvizGenre$precision = rep(0,ncol(auxGenre))
ret$OriginalRadvizGenre$recall = rep(0,ncol(auxGenre))
ret$OriginalRadvizGenre$MAP = MAPmeasure(classes = genreClass, dissMatrix = mat)
names(ret$OriginalRadvizGenre$precision) = colnames(auxGenre)
names(ret$OriginalRadvizGenre$recall) = colnames(auxGenre)
for (i in 1:ncol(auxGenre)){
  genreStr = colnames(auxGenre)[i]
  fc <- file(paste('OriginalRadvizGenre/', genreStr, '.dat',sep = ''))
  order <- as.integer(unlist(strsplit(readLines(fc), " ")))
  close(fc)
  queryGenre = which(genreClass == genreStr)
  ret$OriginalRadvizGenre$precision[i] = Precision(order[1:length(queryGenre)], queryGenre)
  ret$OriginalRadvizGenre$recall[i] = Recall(order[1:length(queryGenre)], queryGenre)
}

#test Genre with sigmoid t = -0.5, s = 10
cat('test Genre with sigmoid t = -0.5, s = 10\n')
mat = as.matrix(read.table("SigmoidRadvizGenre1/Dissimilarity.dat"))
ret$SigmoidRadvizGenre1 = list()
ret$SigmoidRadvizGenre1$precision = rep(0,ncol(auxGenre))
ret$SigmoidRadvizGenre1$recall = rep(0,ncol(auxGenre))
ret$SigmoidRadvizGenre1$MAP = MAPmeasure(classes = genreClass, dissMatrix = mat)
names(ret$SigmoidRadvizGenre1$precision) = colnames(auxGenre)
names(ret$SigmoidRadvizGenre1$recall) = colnames(auxGenre)
for (i in 1:ncol(auxGenre)){
  genreStr = colnames(auxGenre)[i]
  fc <- file(paste('SigmoidRadvizGenre1/', genreStr, '.dat',sep = ''))
  order <- as.integer(unlist(strsplit(readLines(fc), " ")))
  close(fc)
  queryGenre = which(genreClass == genreStr)
  ret$SigmoidRadvizGenre1$precision[i] = Precision(order[1:length(queryGenre)], queryGenre)
  ret$SigmoidRadvizGenre1$recall[i] = Recall(order[1:length(queryGenre)], queryGenre)
}

#test Genre with sigmoid t = -0.8, s = 10
cat('test Genre with sigmoid t = -0.8, s = 10')
mat = as.matrix(read.table("SigmoidRadvizGenre2/Dissimilarity2.dat"))
ret$SigmoidRadvizGenre2 = list()
ret$SigmoidRadvizGenre2$precision = rep(0,ncol(auxGenre))
ret$SigmoidRadvizGenre2$recall = rep(0,ncol(auxGenre))
ret$SigmoidRadvizGenre2$MAP = MAPmeasure(classes = genreClass, dissMatrix = mat)
names(ret$SigmoidRadvizGenre2$precision) = colnames(auxGenre)
names(ret$SigmoidRadvizGenre2$recall) = colnames(auxGenre)
for (i in 1:ncol(auxGenre)){
  genreStr = colnames(auxGenre)[i]
  fc <- file(paste('SigmoidRadvizGenre2/', genreStr, '.dat',sep = ''))
  order <- as.integer(unlist(strsplit(readLines(fc), " ")))
  close(fc)
  queryGenre = which(genreClass == genreStr)
  ret$SigmoidRadvizGenre2$precision[i] = Precision(order[1:length(queryGenre)], queryGenre)
  ret$SigmoidRadvizGenre2$recall[i] = Recall(order[1:length(queryGenre)], queryGenre)
}


#test Genre with sigmoid t = -1, s = 100
cat('test Genre with sigmoid t = -1, s = 100')
mat = as.matrix(read.table("SigmoidRadvizGenre3/Dissimilarity3.dat"))
ret$SigmoidRadvizGenre3 = list()
ret$SigmoidRadvizGenre3$MAP = MAPmeasure(classes = genreClass, dissMatrix = mat)






#test Genre Mood (happy sad) t = 0, s = 0
cat('test Genre Mood (happy sad) t = 0, s = 0')
mat = as.matrix(read.table("GenreMood/Dissimilarity0_0.dat"))
GenreMoodClass = paste(genreClass,moodClass,sep='.')
genremood1 = MAPmeasure(classes = GenreMoodClass, dissMatrix = mat)

#test Genre Mood (happy sad) t = -1, s = 100
cat('test Genre Mood (happy sad) t = -1, s = 100')
mat = as.matrix(read.table("GenreMood/Dissimilarity-1_100.dat"))
GenreMoodClass = paste(genreClass,moodClass,sep='.')
genremood2 = MAPmeasure(classes = GenreMoodClass, dissMatrix = mat)

#test Genre Mood (happy sad) t = -.5, s = 10
cat('test Genre Mood (happy sad) t = -.5, s = 10')
mat = as.matrix(read.table("GenreMood/Dissimilarity-.5_10.dat"))
GenreMoodClass = paste(genreClass,moodClass,sep='.')
genremood3 = MAPmeasure(classes = GenreMoodClass, dissMatrix = mat)

#test Genre Mood (happy sad) t = -.5, s = 10
cat('test Genre Mood (happy sad) t = -.5, s = 10')
mat = as.matrix(read.table("GenreMood/Dissimilarity-.8_10.dat"))
GenreMoodClass = paste(genreClass,moodClass,sep='.')
genremood4 = MAPmeasure(classes = GenreMoodClass, dissMatrix = mat)



#test Genre Mood Sex 
cat('test Genre Mood Sex 1')
GenreMoodSexClass = paste(genreClass, moodClass, singerClass, sep='.')
mat = as.matrix(read.table("GenreMoodSex/Dissimilarity0_0.dat"))
genremoodsex1 = MAPmeasure(classes = GenreMoodSexClass, dissMatrix = mat)

cat('test Genre Mood Sex 2')
GenreMoodSexClass = paste(genreClass, moodClass, singerClass, sep='.')
mat = as.matrix(read.table("GenreMoodSex/Dissimilarity-.5_10.dat"))
genremoodsex2 = MAPmeasure(classes = GenreMoodSexClass, dissMatrix = mat)


cat('test Genre Mood Sex 3')
GenreMoodSexClass = paste(genreClass, moodClass, singerClass, sep='.')
mat = as.matrix(read.table("GenreMoodSex/Dissimilarity-.8_10.dat"))
genremoodsex3 = MAPmeasure(classes = GenreMoodSexClass, dissMatrix = mat)


cat('test Genre Mood Sex 4')
GenreMoodSexClass = paste(genreClass, moodClass, singerClass, sep='.')
mat = as.matrix(read.table("GenreMoodSex/Dissimilarity-1_100.dat"))
genremoodsex3 = MAPmeasure(classes = GenreMoodSexClass, dissMatrix = mat)


#test Pop
pop = which(genreClass == 'pop')
fc <- file('Indices.dat')
order <- as.integer(unlist(strsplit(readLines(fc), " ")))
close(fc)
Precision(order[1:length(pop)], pop)

#test Genre, mood, gender, instrumental/voice

GenreMoodSexInstrument = paste(genreClass, moodClass, singerClass, instrumentClass, sep='.')
mat = as.matrix(read.table("Dissimilarity.dat"))
MAPmeasure(classes = GenreMoodSexClass, dissMatrix = mat)

#############################

cat('query 1 - rock male sad')
rockMaleSad = which(genreClass == 'funksoulrnb' & singerClass == 'female' & moodClass == 'happy')

fc <- file('Query2/Indices-1_100.dat')
order <- as.integer(unlist(strsplit(readLines(fc), " ")))
close(fc)

Precision(order[1:length(rockMaleSad)], rockMaleSad)


#############################
query = which(tempoClass == "relaxed" & genreClass == "alternative")
fc <- file('Indices.dat')
order <- as.integer(unlist(strsplit(readLines(fc), " ")))
close(fc)
Precision(order[1:length(query)], query)