import xml.etree.ElementTree as ET

# Load and parse the XML document
tree = ET.parse('export.xml')
root = tree.getroot()

# Create a dictionary that maps from children to their parents
parent_map = {c: p for p in tree.iter() for c in p}

def remove(xpath):
    global parent
    # Find elements by XPath and remove them
    for target in root.findall(xpath):
        # log target element to console with prefix "target: "
        # print("target: ", target)
        parent = parent_map[target]  # Get the parent element from the map
        parent.remove(target)  # Remove the target element from its parent

remove('.//customCssClasses')
remove('.//localizedAppName')
remove('.//isAppDefSpace')
remove('.//apps')
remove('.//pluginSpaceConfigurations')

remove('.//rootPage')
remove('.//lowCodeJobs')
remove('.//lowCodeChangeListeners')
remove('.//lowCodeTypeMessages')
remove('.//lowCodePageActions')
remove('.//alternativeLayout')
remove('.//widgetContainer')
remove('.//maps')
remove('.//orderable')

remove('.//alternativeValueRepresentation')
remove('.//showInverseRoleAsList')
remove('.//showInverseRoleAsList')
remove('.//showInTables')
remove('.//showInAttributesWidget')
remove('.//showInColumnSelection')
remove('.//showInNewDialog')
remove('.//showInMenuIfHierarchy')
remove('.//showValuesWithLineBreak')
remove('.//showMultiLine')
remove('.//duplicatesAreAllowed')
remove('.//showCreateNewButton')
remove('.//validateAdditionalFilters')
remove('.//refreshAfterSetting')
remove('.//tableColumnWidth')
remove('.//additionalConstraintData')
remove('.//customConstraintName')

remove('.//isShownInExplorer')
remove('.//nameGenerationInstanceCount')
remove('.//showNewButton')
remove('.//hideTabVersions')
remove('.//allowDivergentLayouts')
remove('.//showInGlobalNewDialog')
remove('.//instancesPage')
remove('.//enableIconLink')
remove('.//showInGlobalSearch')
remove('.//defaultPageInPackageStrategy')
remove('.//nameTableColumnWidth')
remove('.//appliesTo')
remove('.//autocompleteDetailsPattern')

remove('.//id')

remove('.//type[name="default.file"]')
remove('.//type[name="default.page"]')
remove('.//type[name="cf.cplace.enumerationIcons.page"]')
remove('.//type[name="cf.cplace.simpleCalendar.eventClassConfiguration"]')
remove('.//type[name="cf.cplace.simpleCalendar.eventTypeConfiguration"]')

remove('.//type[name="cf.cplace.solution.okr.administrationDashboard"]')
remove('.//type[name="cf.cplace.solution.okr.okrManualDashboard"]')
remove('.//type[name="cf.cplace.solution.okr.meetingsDashbaord"]')
remove('.//type[name="cf.cplace.solution.okr.cyclesDashboard"]')
remove('.//type[name="cf.cplace.solution.okr.strategyDashbaord"]')
remove('.//type[name="cf.cplace.solution.okr.myDashboard"]')
remove('.//type[name="cf.cplace.solution.okr.okrDashboard"]')
remove('.//type[name="cf.cplace.solution.okr.settings"]')
remove('.//type[name="cf.cplace.solution.okr.updateKeyResult"]')
remove('.//type[name="cf.cplace.solution.okr.organizationalUnit"]')
remove('.//type[name="cf.cplace.solution.okr.topic"]')


def printAllTypes():
    # find all <name> elements of root which sit under a <type> element
    for name in root.findall('.//type/name'):
        print(name.text)
    pass

def is_empty(element):
    return (not element.text or element.text.isspace()) and not element.tail and len(element) == 0

def remove_empty_elements(element, parent=None):
    # Recursively check all children of the current element
    for child in list(element):
        remove_empty_elements(child, element)

    # If the element is empty and it's not the root element, remove it
    if parent is not None and is_empty(element):
        parent.remove(element)


printAllTypes()

remove_empty_elements(root)

def writeCompressedToFile(root, fileName):
    global file
    # Convert the XML tree to a string
    xml_string = ET.tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    with open(fileName + '-pretty.xml', 'w') as file:
        file.write(xml_string)

    # Remove all line breaks and extra spaces
    compressed_xml_string = xml_string.replace('\n', '').replace('\t', '').replace('  ', '')
    # Save the compressed XML string to a file
    with open(fileName + '-compressed.xml', 'w') as file:
        file.write(compressed_xml_string)


writeCompressedToFile(root, 'modified')

# Remove all <attributeDefinition> elements, which have a <typeConstraint> element with a content which is not "Link"

tree = ET.parse('modified-compressed.xml')
root = tree.getroot()

parent_map = {c: p for p in root.iter() for c in p}

for attributeDefinition in root.findall('.//attributeDefinition'):
    typeConstraint = attributeDefinition.find('typeConstraint')
    # print("typeConstraint: ", typeConstraint)
    if typeConstraint is not None and typeConstraint.text != 'Link':
        # print("Removing: ", attributeDefinition)
        parent = parent_map[attributeDefinition]
        parent.remove(attributeDefinition)

writeCompressedToFile(root, 'modified-only-references')