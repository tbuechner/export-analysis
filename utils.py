import json
import xml.etree.ElementTree as ET


def remove(root, parent_map, xpath):
    # Find elements by XPath and remove them
    for target in root.findall(xpath):
        parent = parent_map[target]  # Get the parent element from the map
        parent.remove(target)  # Remove the target element from its parent

def printAllTypes(root):
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

    # If the element is equals to "{}", remove it
    if element.text == "{}":
        parent.remove(element)

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

def removeNonReferenceAttributes(root, parent_map):
    global parent
    for attributeDefinition in root.findall('.//attributeDefinition'):
        typeConstraint = attributeDefinition.find('typeConstraint')
        # print("typeConstraint: ", typeConstraint)
        if typeConstraint is not None and typeConstraint.text != 'Link':
            # print("Removing: ", attributeDefinition)
            parent = parent_map[attributeDefinition]
            parent.remove(attributeDefinition)

def rewriteLocalizedNameAttributes(doc):
    if isinstance(doc, list):
        for item in doc:
            rewriteLocalizedNameAttributes(item)
    elif isinstance(doc, dict):
        for key, value in doc.items():
            if key == 'localizedName' or key == 'localizedNameSingular' or key == 'localizedNamePlural' or key == 'localizedShortName':
                # parse the value as json and replace the value with the parsed json
                # print(json.loads(value))
                # print(value)
                if value is not None:
                    doc[key] = json.loads(value)

            rewriteLocalizedNameAttributes(value)

def rewriteAttributes(doc):
    if isinstance(doc, list):
        for item in doc:
            rewriteAttributes(item)
    elif isinstance(doc, dict):
        for key, value in doc.items():
            if value is not None and key == 'attributeDefinitions':
                # print (value)
                attributeDefinition = value['attributeDefinition']
                # print(attributeDefinition)
                # print(type(attributeDefinition))
                # if attributeDefinition is a list, then create a new list
                if isinstance(attributeDefinition, list):

                    newList = []
                    for attribute in attributeDefinition:
                        newList.append(attribute)

                    # replace the value with the list object
                    doc[key] = newList

                elif isinstance(attributeDefinition, dict):
                    newList = []
                    newList.append(attributeDefinition)

                    # replace the value with the list object
                    doc[key] = newList

            rewriteAttributes(value)


def removeGenericElements(root, parent_map):
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


def removeOkrTypes(root, parent_map):
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
