import glob
import os

for file in glob.glob("degree/*.graphml"):
	output=file.replace(".graphml",".json")
	cmd="python graphml2json.py {} {}".format(file,output)
	os.system(cmd)

for file in glob.glob("path/*.graphml"):
	output=file.replace(".graphml",".json")
	cmd="python graphml2json.py {} {}".format(file,output)
	os.system(cmd)
