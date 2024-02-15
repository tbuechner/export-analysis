import json
import xml.etree.ElementTree as ET

import xmltodict

from utils import remove, printAllTypes, remove_empty_elements, writeCompressedToFile, removeNonReferenceAttributes, \
    rewriteLocalizedNameAttributes, rewriteAttributes

# Load and parse the XML document
tree = ET.parse('export.xml')
root = tree.getroot()

# Create a dictionary that maps from children to their parents
parent_map = {c: p for p in tree.iter() for c in p}

remove(root, parent_map, './/customCssClasses')
remove(root, parent_map, './/localizedAppName')
remove(root, parent_map, './/isAppDefSpace')
remove(root, parent_map, './/apps')
remove(root, parent_map, './/pluginSpaceConfigurations')

remove(root, parent_map, './/rootPage')
remove(root, parent_map, './/lowCodeJobs')
remove(root, parent_map, './/lowCodeChangeListeners')
remove(root, parent_map, './/lowCodeTypeMessages')
remove(root, parent_map, './/lowCodePageActions')
remove(root, parent_map, './/alternativeLayout')
remove(root, parent_map, './/widgetContainer')
remove(root, parent_map, './/maps')
remove(root, parent_map, './/orderable')

remove(root, parent_map, './/alternativeValueRepresentation')
remove(root, parent_map, './/showInverseRoleAsList')
remove(root, parent_map, './/showInverseRoleAsList')
remove(root, parent_map, './/showInTables')
remove(root, parent_map, './/showInAttributesWidget')
remove(root, parent_map, './/showInColumnSelection')
remove(root, parent_map, './/showInNewDialog')
remove(root, parent_map, './/showInMenuIfHierarchy')
remove(root, parent_map, './/showValuesWithLineBreak')
remove(root, parent_map, './/showMultiLine')
remove(root, parent_map, './/duplicatesAreAllowed')
remove(root, parent_map, './/showCreateNewButton')
remove(root, parent_map, './/validateAdditionalFilters')
remove(root, parent_map, './/refreshAfterSetting')
remove(root, parent_map, './/tableColumnWidth')
remove(root, parent_map, './/additionalConstraintData')
remove(root, parent_map, './/customConstraintName')

remove(root, parent_map, './/isShownInExplorer')
remove(root, parent_map, './/nameGenerationInstanceCount')
remove(root, parent_map, './/showNewButton')
remove(root, parent_map, './/hideTabVersions')
remove(root, parent_map, './/allowDivergentLayouts')
remove(root, parent_map, './/showInGlobalNewDialog')
remove(root, parent_map, './/instancesPage')
remove(root, parent_map, './/enableIconLink')
remove(root, parent_map, './/showInGlobalSearch')
remove(root, parent_map, './/defaultPageInPackageStrategy')
remove(root, parent_map, './/nameTableColumnWidth')
remove(root, parent_map, './/appliesTo')
remove(root, parent_map, './/autocompleteDetailsPattern')

remove(root, parent_map, './/id')

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

remove(root, parent_map, './/type[name="cf.cplace.solution.okr.meeting"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.set"]')
remove(root, parent_map, './/type[name="cf.cplace.solution.okr.priority"]')

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
with open('modified-thinned-out-removed-types-pretty.json', 'w') as file:
    # remove as many spaces as possible
    file.write(json.dumps(doc, separators=(',', ':')))