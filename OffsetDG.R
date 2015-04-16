require(MASS) #chull

computeOffsetDG <- function(anglesUsed, n){
  cat ('angles used =', anglesUsed,'\n')
  if (length(anglesUsed) == 0){
    return (0);
  }
  DAs = DAsfromAngles(anglesUsed)
  angle = pi/180
  rot.mat = matrix(c(cos(angle), -sin(angle), sin(angle), cos(angle)),nrow = 2,ncol = 2, byrow = T)
  newDAs = nDAs(n)
  areas = rep(0,360)
  for (i in 1:360){
    totDA = rbind(DAs, newDAs)
    areas[i] = polyArea(totDA[chull(totDA),])
    newDAs = newDAs %*% rot.mat
  }
  return (which.max(areas)* 2*pi/360)
}

nDAs <- function(n.anchors){
  angle = 2*pi/n.anchors
  anchor = matrix(0, nrow = n.anchors, ncol = 2)
  anchor[1,] = c(1,0)
  rot.mat = matrix(c(cos(angle), -sin(angle), sin(angle), cos(angle)),nrow = 2,ncol = 2, byrow = T)
  if (n.anchors > 1){
    for (i in 2:n.anchors){
      anchor[i,] = rot.mat %*% anchor[i-1,];
    }
  }
  return (anchor)
}

DAsfromAngles <- function(angles){
  DAs = matrix(0, nrow = length(angles), ncol = 2)
  for (i in 1:length(angles)){
    DAs[i,] = c(cos(angles[i]), sin(angles[i]))
  }
  return (DAs)
}

polyArea<-function(X){
  if (nrow(X) < 3){
    return (0)
  }
  X<-rbind(X,X[1,])
  x<-X[,1]; y<-X[,2]; lx<-length(x)
  return (abs(-sum((x[2:lx]-x[1:lx-1])*(y[2:lx]+y[1:lx-1]))/2))
}