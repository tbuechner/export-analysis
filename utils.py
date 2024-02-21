import json
import xml.etree.ElementTree as ET

import xmltodict

import os

from jsonToCode import generate_copilot_examples
from tokenizer import count_large_files, count_tokens_in_file


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

def rewriteTypes(doc):
    # print("rewriteTypes: " + str(doc))
    if isinstance(doc, list):
        for item in doc:
            rewriteTypes(item)
    elif isinstance(doc, dict):
        for key, value in doc.items():
            if value is not None and key == 'workspace':
                types = value['types']
                # print ("workspace: " + str(value))
                # print("type of types: " + str(type(value['types'])))

                type_ = types['type']
                # print("type of type: " + str(type(type_)))

                if isinstance(type_, list):
                    value['types'] = value['types']['type']
                else:
                    value['types'] = []
                    value['types'].append(type_)

            rewriteTypes(value)

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
    remove(root, parent_map, './/lowCodeValidator')
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


def returnAllSearches(root, parent_map):
    # create a list which will store the text of the elements
    result = []
    # iterate over all elements in the tree
    for element in root.iter():
        # if the text of the element starts with "s{"filters":"
        if element.text is not None and element.text.startswith('s{"filters":'):
            # add the text of the element stripped of the leading "s"
            result.append(element.text[1:])
            # print(element.text)
    # iterate over result
    for i in range(len(result)):
        # replace the text of the element with the result of the search
        search = json.loads(result[i])
        # access the "filters" key of the search
        result[i] = search["filters"]
    return result

def returnAllLowCodeScripts(root, parent_map):
    # create a list which will store the text of the elements
    result = []
    # iterate over all elements in the tree
    for element in root.iter():
        # if the name of the element is "cplaceJSScript"
        if element.text is not None and element.tag == "cplaceJSScript":
            # add the text of the element
            result.append(element.text)
            # print(element.text)


    # iterate over all elements in the tree
    for element in root.iter():
        # if the text of the element starts with "s{"filters":"
        if element.text is not None and element.text.startswith('s{') and element.text.endswith('}'):
            text = element.text[1:]
            # parse text as json
            textAsJson = json.loads(text)
            # if the key "script" exists in the json
            if "script" in textAsJson:
                result.append(textAsJson["script"])

    return result


def findAllWidgets(root, parent_map):
    result = []
    # Find elements by XPath and remove them
    for target in root.findall('.//widgetContainer'):
        # convert target from xml to json
        asJson = xmltodict.parse(ET.tostring(target, encoding='utf-8', method='xml').decode('utf-8'))

        # print(asJson)

        widgetContainer = asJson['widgetContainer']

        # parse widgetsLayout value of widgetContainer as json
        # print(widgetContainer['widgetsLayout'])

        widgetId2widget = {}

        layout_ = widgetContainer['widgetsLayout']
        if layout_ is not None:
            layoutAsJson = json.loads(layout_)
            widgetContainer['widgetsLayout'] = layoutAsJson

            widgets = widgetContainer['widgets']
            if widgets is not None:
                actualWidgets = widgets['widget']
                if actualWidgets is not None:
                    if isinstance(actualWidgets, list):
                        for widget in actualWidgets:
                            widgetId = widget['widgetId']
                            widgetId2widget[widgetId] = widget
                            # print ("adding: ", widgetId, widget)
                    elif isinstance(actualWidgets, dict):
                        widgetId = actualWidgets['widgetId']
                        widgetId2widget[widgetId] = actualWidgets
                        # print ("is dict")
                        # print (actualWidgets)
                    # else:
                    #     # print type of actualWidgets
                    #     # print("No list nor dict" + str(type(actualWidgets)))
                # else:
                #     # print("No widgets found - 2")
            # else:
            #     print("No widgets found - 1")

            for row in layoutAsJson['rows']:
                for column in row['columns']:
                    for widget in column['widgets']:
                        widgetId = widget['id']
                        # print(widgetId)
                        # print("widgetId2widget: " + str(widgetId2widget))

                        # test if the widgetId is in the map widgetId2widget
                        if widgetId in widgetId2widget:
                            widgetFromMap = widgetId2widget[widgetId]

                            # iterate over the keys of the widgetFromMap
                            for key in widgetFromMap:
                                # if the key is not in the widget, then add it
                                if key not in widget:
                                    value = widgetFromMap[key]
                                    if key == 'attributes' and value is not None:
                                        # print ("value: ", json.dumps(value, separators=(',', ':')))
                                        newValue = value['attribute']
                                        if isinstance(newValue, list):
                                            for eachValue in newValue:
                                                # print(eachValue['values'])
                                                eachValue['value'] = eachValue['values']['value']
                                                del eachValue['values']
                                                if 'embeddedWidgets_values' in eachValue:
                                                    del eachValue['embeddedWidgets_values']
                                        else:
                                            newValue['value'] = newValue['values']['value']
                                            del newValue['values']
                                            if 'embeddedWidgets_values' in newValue:
                                                del newValue['embeddedWidgets_values']

                                        widget[key] = newValue
                                    else:
                                        widget[key] = value


                            del widget['widgetId']
                        else:
                            print("Widget not found: ", widgetId, widgetId2widget)

            # print(json.dumps(layoutAsJson, separators=(',', ':')))
            result.append(layoutAsJson)
    return result


def runForFolder(folderName):

    # delete all files with name *.json in folder name
    files = os.listdir(folderName)
    for file in files:
        if file.endswith('.json') or file.endswith('.js'):
            os.remove(folderName + '/' + file)

    # read from file name + '/typesToBeRemoved.txt'
    with open(folderName + '/typesToBeRemoved.txt') as f:
        # read each line and store it in a list
        typesToBeRemoved = f.read().splitlines()

    # Load and parse the XML document
    tree = ET.parse(folderName + '/export.xml')
    root = tree.getroot()

    # Create a dictionary that maps from children to their parents
    parent_map = {c: p for p in tree.iter() for c in p}

    searches = returnAllSearches(root, parent_map)
    # print("Searches: ", searches)
    writeJsonToFile(folderName, "searches", searches)

    searches = searches[:10]
    writeJsonToFile(folderName, "searches-10", searches)

    lowCodeScripts = returnAllLowCodeScripts(root, parent_map)
    # print("LowCodeScripts: ", lowCodeScripts)
    writeLowCodeScriptsToFile(folderName, "lowCodeScripts", lowCodeScripts)

    widgets = findAllWidgets(root, parent_map)
    # print("Widgets: ", widgets)
    writeJsonToFile(folderName, "widgets", widgets)

    removeGenericElements(root, parent_map)

    # iterate through the list and print each line
    for type in typesToBeRemoved:
        remove(root, parent_map, './/type[name="' + type + '"]')

    remove_empty_elements(root)

    print ("After removing the types:")
    printAllTypes(root)

    # store XML to a string
    asString = ET.tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    doc = xmltodict.parse(asString)

    rewriteLocalizedNameAttributes(doc)

    rewriteAttributes(doc)
    rewriteTypes(doc)

    writeJsonToFile(folderName, "types", doc)

    copilot_examples = generate_copilot_examples(doc)
    # print(copilot_examples)
    writeCopilotExamplesToFile(folderName, "copilot_examples", copilot_examples)

    print("tokens copilot_examples: " + str(count_tokens_in_file(folderName + "/copilot_examples.js")))
    print("tokens types-compressed: " + str(count_tokens_in_file(folderName + "/types-compressed.json")))
    print("tokens types-pretty: " + str(count_tokens_in_file(folderName + "/types-pretty.json")))


def writeJsonToFile(folderName, fileName, object):
    with open(folderName + '/' + fileName + '-pretty.json', 'w') as file:
        file.write(json.dumps(object, indent=4))
    with open(folderName + '/' + fileName + '-compressed.json', 'w') as file:
        file.write(json.dumps(object, separators=(',', ':')))

def writeLowCodeScriptsToFile(folderName, fileName, lowCodeScripts):
    with open(folderName + '/' + fileName + '.js', 'w') as file:
        for lowCodeScript in lowCodeScripts:
            # separate the lowCodeScripts by a new line and "---------------------------------------------------"
            file.write(lowCodeScript + "\n")
            file.write("\n")
            file.write("//------------------------------------------------------------------------------------------------------\n")
            file.write("\n")

def writeCopilotExamplesToFile(folderName, fileName, copilot_examples):
    with open(folderName + '/' + fileName + '.js', 'w') as file:
        file.write(copilot_examples)
