source('MAPMeasure.R')

Precision <- function(retrieved, relevant){ #r-precision se considera soh os |relevantes| primeiros retrieved
  return (sum (retrieved %in% relevant) / length(retrieved) )
}

data = read.csv('MTFLRandomForest.csv')

auxGender = data[,c("male", "female")]
genderClass = colnames(auxGender)[apply(auxGender, 1, which.max)]

auxSmile = data[,c("smiling", "not_smiling")]
smileClass = colnames(auxSmile)[apply(auxSmile, 1, which.max)]

auxGlasses = data[,c("wearing","not_wearing")]
glassesClass = colnames(auxGlasses)[apply(auxGlasses, 1, which.max)]

auxPose = data[,c("left_profile","left","frontal" ,
                  "right","right_profile")]
poseClass = colnames(auxPose)[apply(auxPose, 1, which.max)]

######################################################## MAP

tudo = paste(poseClass, genderClass, smileClass, glassesClass, sep='.')
mat = as.matrix(read.table('Dissimilarity.dat'))
cat (MAPmeasure(classes = tudo, dissMatrix = mat), '\n')

########################################################## RPrecision
#2-a)
query = which(genderClass=='male'&poseClass=='frontal'&smileClass=='smiling' & glassesClass=='not_wearing')
fc <- file('Indices.dat')
order <- as.integer(unlist(strsplit(readLines(fc), " ")))
close(fc)
Precision(order[1:length(query)], query)


#2-b Head Pose: Left; Gender: Female; Glasses: NotWearing;
query = which(genderClass=='female'&poseClass=='left' & glassesClass=='not_wearing')
fc <- file('Indices.dat')
order <- as.integer(unlist(strsplit(readLines(fc), " ")))
close(fc)
Precision(order[1:length(query)], query)