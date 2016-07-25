import pprint
import xml.dom.minidom
from xml.dom.minidom import Node
import sys
from optparse import OptionParser
import json
import random

usage="Run as python gexf2json.py input.gexf output.json [pretty]"

"""parser = OptionParser()
parser.add_option("-i", "--input", dest="input",
                  help="gexf file to read as input", metavar="INPUT")
parser.add_option("-o", "--output", dest="output",
                  help="json file to write to as output", metavar="OUTPUT")
parser.add_option("-q", "--quiet",
                  action="store_false", dest="verbose", default=True,
                  help="don't print status messages to stdout")

(options, args) = parser.parse_args()
"""

if (len(sys.argv)<3):
	print usage
	exit()


HEX = '0123456789abcdef'
def rgb2hex(r,g,b):
    return format((r<<16)|(g<<8)|b, '06x')

colors={"grey":"#888888","green":"#00FF00","red":"#FF0000","blue":"#0000FF"}

gexf = xml.dom.minidom.parse(sys.argv[1])

#Parse Attributes
AttributesDict={}

jsonNodes = []#The nodes of the graph
graph = gexf.getElementsByTagName("graph")[0] #First graph element -- don't deal with the case of more than one
nodes = graph.getElementsByTagName("node")

for node in nodes:
	#print node
	id = node.getAttribute('id')
	#viz defaults just in case they're missing
	size = 1
	x = 100 - 200*random.random()
	y = 100 - 200*random.random()
	color="#888888"
	label=""
	jNode={"id":id,"label":label, "size":size, "x":x, "y":y, "attributes":{}, "color":color};  #The graph node
	for data in node.getElementsByTagName("data"):
		#overwrite defaults or put in attributes
		
		if not data.firstChild:
			continue
		
		key=data.getAttribute("key") #Key less the V- prefix
		if key[:2].lower()=="v_":
			key=key[2:]
		val=data.firstChild.data #Text
		
		#print key
		#print val
		
		lkey = key.lower()
		if (lkey=="x" or lkey=="y" or lkey=="size"):
			jNode[lkey]=float(val)
		elif lkey=="shape" or lkey=="label":
			jNode[lkey]=val
		elif lkey=="color":
			if val in colors:
				val=colors[val]
			jNode[lkey]=val
		elif lkey=="id":
			pass #ignore
		else:
			jNode["attributes"][key]=val

	jsonNodes.append(jNode)

jsonEdges = []
edgeId = 0
edges = graph.getElementsByTagName('edge')
for edge in edges:
	source = edge.getAttribute("source")
	target = edge.getAttribute("target")
	label = id
	id = edgeId
	edgeId=edgeId+1	

	jEdge = {
	    "id":         id,
	    "source":   source,
	    "target":   target,
	    "label":      label,
	    "attributes": {}
	}
	
	for data in edge.getElementsByTagName("data"):
		key=data.getAttribute("key")
		if key[:2]=="E-":
			key=key[2:] #Key less the E- prefix
		val=data.firstChild.data #Text
		lkey = key.lower()
		if (lkey=="edge weight"):
			jEdge["weight"]=float(val)
		elif lkey=="id" or lkey=="label":
			jEdge[lkey]=val
		elif lkey=="color":
			jEdge[lkey]="rgb(%s)"%val #e.g. rgb(0,100,50)
		else:
			jEdge["attributes"][key]=val

	jsonEdges.append(jEdge)

fhOutput = open(sys.argv[2],"w")
j={"nodes":jsonNodes,"edges":jsonEdges}
if len(sys.argv)>=4 and "pretty"==(sys.argv[3]).lower():
	json.dump(j,fhOutput,indent=4)
else:
	json.dump(j,fhOutput)
