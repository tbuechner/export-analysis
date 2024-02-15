import json
import xml.etree.ElementTree as ET

import xmltodict

from utils import remove, printAllTypes, remove_empty_elements, writeCompressedToFile, removeNonReferenceAttributes, \
    rewriteLocalizedNameAttributes, rewriteAttributes, removeGenericElements

# Load and parse the XML document
tree = ET.parse('export.xml')
root = tree.getroot()

# Create a dictionary that maps from children to their parents
parent_map = {c: p for p in tree.iter() for c in p}

removeGenericElements(root, parent_map)

remove(root, parent_map, './/type[name="default.file"]')
remove(root, parent_map, './/type[name="default.page"]')
remove(root, parent_map, './/type[name="cf.cplace.enumerationIcons.page"]')
remove(root, parent_map, './/type[name="cf.cplace.simpleCalendar.eventClassConfiguration"]')
remove(root, parent_map, './/type[name="cf.cplace.simpleCalendar.eventTypeConfiguration"]')

remove(root, parent_map, './/type[name="cf.cplace.solution.okr.administrationDashboard"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.okrManualDashboard"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.meetingsDashbaord"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.cyclesDashboard"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.strategyDashbaord"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.myDashboard"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.okrDashboard"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.settings"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.updateKeyResult"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.organizationalUnit"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.topic"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.meeting"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.set"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.priority"]')

remove_empty_elements(root)

parent_map = {c: p for p in root.iter() for c in p}

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
