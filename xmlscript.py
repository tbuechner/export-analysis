import xml.etree.ElementTree as ET

from utils import remove, printAllTypes, is_empty, remove_empty_elements, writeCompressedToFile, removeNonReferenceAttributes

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