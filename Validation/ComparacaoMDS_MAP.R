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


GenreMood = as.matrix(cbind(MIR[,c(colnames(auxGenre), "happy", "sad")]))
genreMoodClass = paste(genreClass, moodClass, sep = '.')
plotGenreMoodNonSigmoid = cmdscale(dist(GenreMood))
MAPmeasure(classes = genreMoodClass,dissMatrix = as.matrix(dist(plotGenreMoodNonSigmoid)))
#plot MDS genre color
plot(plotGenreMoodNonSigmoid, col = rainbow(9)[as.factor(apply(GenreMood[,1:9],1,which.max))], pch = 20)
legend("topright",legend = levels(as.factor(colnames(GenreMood)[apply(GenreMood[,1:9],1,which.max)])), col = rainbow(9),pch = 20)
#plot MDS mood color 
plot(plotGenreMoodNonSigmoid, col = rainbow(2)[as.factor(apply(GenreMood[,10:11],1,which.max))], pch = 20)
legend("topright",legend = levels(as.factor(colnames(GenreMood[,10:11])[apply(GenreMood[,10:11],1,which.max)])), col = 1:2,pch = 20)
#plot LDA mood color
LDGenreMood = lda(x = GenreMood, grouping = genreMoodClass)
plot3d(GenreMood %*% LDGenreMood$scaling[,1:9], col = rainbow(9)[as.factor(apply(GenreMood[,1:9],1,which.max))])