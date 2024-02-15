import json
import xml.etree.ElementTree as ET

import xmltodict

from utils import removeGenericElements, removeOkrTypes, remove_empty_elements, printAllTypes, rewriteLocalizedNameAttributes, rewriteAttributes

# Load and parse the XML document
tree = ET.parse('export.xml')
root = tree.getroot()

# Create a dictionary that maps from children to their parents
parent_map = {c: p for p in tree.iter() for c in p}

removeGenericElements(root, parent_map)

# removeOkrTypes(root, parent_map)

remove_empty_elements(root)

print ("After removing the types:")
printAllTypes(root)

# store XML to a string
asString = ET.tostring(root, encoding='utf-8', method='xml').decode('utf-8')

doc = xmltodict.parse(asString)

rewriteLocalizedNameAttributes(doc)

rewriteAttributes(doc)

with open('compressed.json', 'w') as file:
    # remove as many spaces as possible
    file.write(json.dumps(doc, separators=(',', ':')))

with open('pretty.json', 'w') as file:
    # pretty-print the json
    file.write(json.dumps(doc, indent=4))
