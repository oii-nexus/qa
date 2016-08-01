library(igraph)

N<-25
dists<-sample(c(1,2,3),25,replace=TRUE)
output<-data.frame(i=seq(N),distance=dists)

for (i in seq(N)) {

	g<-sample_smallworld(1,15,3,0.1)
	V(g)$color<-"grey"
	color<-"green"
	
	d<-dists[i]
	#dtable<-distance_table(g,directed=FALSE)
	#if (d>length(dtable$res) | dtable$res[d]==0) {
	#	stop(paste0("There is no path of length ",d," in this graph."))
	#}
	
	dtable<-distances(g) #dtable is a matrix
	if (!d%in%dtable) {
		stop(paste0("There is no path of length ",d," in this graph."))
	}
	
	#Select paths of length d
	paths<-which(dtable==d,arr.ind=TRUE)
	#Select one of these paths uniform randomly
	path<-paths[sample.int(length(paths)/2,1),]
	
	V(g)$color[path["row"]]<-color
	V(g)$color[path["col"]]<-color
	
	table(V(g)$color)

	#layout<-layout_with_kk(g)
	#See ?igraph.plotting for options to plot
	#layout<-layout_randomly(g) #Don't precondition to force-directed layouts
	layout<-layout_with_fr(g) 
	xlim<-c(min(layout[,1]),max(layout[,1]))
	ylim<-c(min(layout[,2]),max(layout[,2]))
	plot(g,layout=layout,asp=9/16,margin=-0.15,xlim=xlim,ylim=ylim,rescale=FALSE,vertex.size=5,vertex.label=NA)
	

	V(g)$x<-layout[,1]
	V(g)$y<-layout[,2]
	write.graph(g,paste0("path/pretest_path_",sprintf("%02d",i),".graphml"),format="graphml")
	system(paste0("python graphml2json.py path/pretest_path_",sprintf("%02d",i),".graphml path/pretest_path_",sprintf("%02d",i),".json")) 

}
write.csv(output,"path/results.csv",row.names=FALSE)
