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

printAllTypes(root)

remove_empty_elements(root)

writeCompressedToFile(root, 'modified')

# Remove all <attributeDefinition> elements, which have a <typeConstraint> element with a content which is not "Link"

tree = ET.parse('modified-compressed.xml')
root = tree.getroot()
parent_map = {c: p for p in root.iter() for c in p}

removeNonReferenceAttributes(root, parent_map)

writeCompressedToFile(root, 'modified-only-references')

tree = ET.parse('modified-compressed.xml')
root = tree.getroot()
parent_map = {c: p for p in root.iter() for c in p}

remove(root, parent_map, './/localizedPageNamesMode')
remove(root, parent_map, './/iconName')
remove(root, parent_map, './/nameGenerationPattern')
remove(root, parent_map, './/displayNameGenerationPattern')
remove(root, parent_map, './/internalAttributeNamePrefix')
remove(root, parent_map, './/isTuple')
remove(root, parent_map, './/namesAreUnique')
remove(root, parent_map, './/isReadOnly')
remove(root, parent_map, './/localizedInverseRoleName')
remove(root, parent_map, './/numberPrecision')
remove(root, parent_map, './/numberTextAfter')
remove(root, parent_map, './/localizedNumberTextAfter')
remove(root, parent_map, './/dateSpecificity')
remove(root, parent_map, './/dateFormat')
remove(root, parent_map, './/dateWithTime')
remove(root, parent_map, './/defaultValues')
remove(root, parent_map, './/textRegExp')
remove(root, parent_map, './/textRegExpErrorMessage')
remove(root, parent_map, './/enumerationValues')
remove(root, parent_map, './/enumerationValues2icons')
remove(root, parent_map, './/enumerationValues2localizedLabels')

writeCompressedToFile(root, 'modified-thinned-out')

print ("After removing the types:")
printAllTypes(root)

writeCompressedToFile(root, 'modified-thinned-out-removed-types')

# convert the XML to json
with open('modified-thinned-out-removed-types-pretty.xml') as fd:
    doc = xmltodict.parse(fd.read())

rewriteLocalizedNameAttributes(doc)

rewriteAttributes(doc)

# print(doc)
# write doc to a file
with open('modified-thinned-out-removed-types-compressed.json', 'w') as file:
    # remove as many spaces as possible
    file.write(json.dumps(doc, separators=(',', ':')))

with open('modified-thinned-out-removed-types-pretty.json', 'w') as file:
    # pretty-print the json
    file.write(json.dumps(doc, indent=4))
