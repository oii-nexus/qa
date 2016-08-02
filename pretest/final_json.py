import json
import glob

nets=[]
for f in glob.glob("degree/pretest_degree_0[123].json"):
	fh=open(f,"r")
	j=json.load(fh)
	j["name"]=f
	fh.close()
	nets.append(j)

fhOut=open("../pretest_degree.json","w")
json.dump(nets,fhOut)
fhOut.close()


nets=[]
for f in glob.glob("path/pretest_path_0[123].json"):
	fh=open(f,"r")
	j=json.load(fh)
	j["name"]=f
	fh.close()
	nets.append(j)

fhOut=open("../pretest_path_length.json","w")
json.dump(nets,fhOut)
fhOut.close()


