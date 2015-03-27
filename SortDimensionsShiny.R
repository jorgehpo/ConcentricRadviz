require(TSP)

#######
#Codigo que teoricamente deu certo
sortCorrelation = function(dataNum){
  mat = 1-cor(dataNum)
  order = solve_TSP(TSP(mat))
  return (as.integer(order))
}