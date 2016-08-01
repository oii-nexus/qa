library(igraph)

N<-25
output<-data.frame(blue=rep(NA,N),red=rep(NA,N))
for (i in seq(N)) {

	g<-sample_smallworld(1,15,3,0.1)
	V(g)$color<-"grey"
	V(g)$degree<-degree(g)
	#quantiles<-quantile(V(g)$degree,probs=c(.2,.8),na.rm=TRUE)
	#quantiles
	#
	#if (quantiles["25%"]==quantiles["75%"]) {
	#	stop("Nodes have the same degree!")
	#}

	color1<-sample(c("red","blue"),1)
	color2<-ifelse(color1=="red","blue","red")

	x<-V(g)$degree==min(V(g)$degree)
	V(g)$color[x & !duplicated(x)]<-color1
	output[i,color1]<-min(V(g)$degree)
	
	x<-V(g)$degree==max(V(g)$degree)
	V(g)$color[x & !duplicated(x)]<-color2
	output[i,color2]<-max(V(g)$degree)
	
	table(V(g)$color)

	#layout<-layout_with_kk(g)
	#See ?igraph.plotting for options to plot
	#layout<-layout_randomly(g) #Don't precondition to force-directed layouts
	layout<-layout_with_fr(g) 
	xlim<-c(min(layout[,1]),max(layout[,1]))
	ylim<-c(min(layout[,2]),max(layout[,2]))
	plot(g,layout=layout,asp=9/16,margin=-0.15,xlim=xlim,ylim=ylim,rescale=FALSE,vertex.size=5,vertex.label=NA)
	print(paste(color2,"has higher degree centrality than",color1,"(",max(V(g)$degree),"versus",min(V(g)$degree),")"))

	V(g)$x<-layout[,1]
	V(g)$y<-layout[,2]
	write.graph(g,paste0("degree/pretest_degree_",sprintf("%02d",i),".graphml"),format="graphml")
	system(paste0("python graphml2json.py degree/pretest_degree_",sprintf("%02d",i),".graphml degree/pretest_degree_",sprintf("%02d",i),".json")) 

}
write.csv(output,"degree/results.csv",row.names=FALSE)
