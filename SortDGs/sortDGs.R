require(Radviz) 


polyArea<-function(X){
  if (nrow(X) < 3){
    return (0)
  }
  X<-rbind(X,X[1,])
  x<-X[,1]; y<-X[,2]; lx<-length(x)
  return (abs(-sum((x[2:lx]-x[1:lx-1])*(y[2:lx]+y[1:lx-1]))/2))
}

addDG <- function(vis, toAdd){
  if (length(vis) == 0){
    vis[[1]] = toAdd
  }else{
    #setting up anchors
    anchors = NULL
    for (i in 1:length(vis)){
      anchors = rbind(anchors, rotate(vis[[i]]$anchors, vis[[i]]$offset))
    }
    
    #computing all possibilities
    areas = rep(0, 360)
    for (id in 1:360){
      newAnchors = rbind(anchors, rotate(toAdd$anchors, id * 2*pi/360))
      areas[id] = polyArea(newAnchors[chull(newAnchors),])
    }
    
    toAdd$offset = which.max(areas) * 2*pi/360
    vis[[length(vis)+1]] = toAdd;
  }
  return(vis)
}

rotate <- function(dat, angle){
  rot.mat = matrix(c(cos(angle), -sin(angle), sin(angle), cos(angle)),nrow = 2,ncol = 2, byrow = T)
  return (dat %*% rot.mat)
}

newDG <- function(names){
  n.anchors = length(names)
  angle = 2*pi/n.anchors
  anchor = matrix(0, nrow = n.anchors, ncol = 2)
  anchor[1,] = c(1,0)
  
  rot.mat = matrix(c(cos(angle), -sin(angle), sin(angle), cos(angle)),nrow = 2,ncol = 2, byrow = T)
  for (i in 2:n.anchors){
    anchor[i,] = rot.mat %*% anchor[i-1,];
  }
  rownames(anchor) = names
  ret = list()
  ret$angles = angle * 0:(n.anchors-1)
  ret$anchors = anchor
  ret$offset = 0
  return (ret)
}


plotDGs = function(vis){
  offset = 10
  initRadius = 15
  sizePlot = initRadius + offset * length(vis)
  plot(0, t='n', xlim = c(-sizePlot,sizePlot), ylim = c(-sizePlot,sizePlot))
  for (i in 1:length(vis)){
    circle = c(seq(0,2*pi,0.1), 0)
    points(cos(circle)*(initRadius + offset*i), sin(circle)*(initRadius + offset*i), t='l')
    #points(rotate(vis[[i]]$anchors,vis[[i]]$offset)*(initRadius + offset*i))
    text(rotate(vis[[i]]$anchors,vis[[i]]$offset)*(initRadius + offset*i), labels = rownames(vis[[i]]$anchors))
  }
}


vis = list()
vis <- addDG(vis, newDG(c('happy', 'sad')))
vis <- addDG(vis, newDG(c('Alternative', 'Blues', 'Electronic', 'Folk-Country','Funk-Soul-R&B', 'Jazz', 'Pop', 'Rap-Hiphop', 'Rock')))
vis <- addDG(vis, newDG(c('male', 'female')))
vis <- addDG(vis, newDG(c('party','relaxed', 'aggressive')))
vis <- addDG(vis, newDG(1:4))
plotDGs(vis)