import json
import xml.etree.ElementTree as ET

import xmltodict

import os

import yaml


from jsonToCode import generate_copilot_examples
from tokenizer import count_large_files, count_tokens_in_file


def remove(root, parent_map, xpath):
    # Find elements by XPath and remove them
    for target in root.findall(xpath):
        p = parent_map[target]  # Get the parent element from the map
        p.remove(target)  # Remove the target element from its parent


def print_all_types(root):
    # find all <name> elements of root which sit under a <type> element
    for name in root.findall('.//type/name'):
        print(name.text)


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


def write_compressed_to_file(root, fileName):
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


def remove_non_reference_attributes(root, parent_map):
    global parent
    for attribute_definition in root.findall('.//attributeDefinition'):
        type_constraint = attribute_definition.find('typeConstraint')
        # print("typeConstraint: ", typeConstraint)
        if type_constraint is not None and type_constraint.text != 'Link':
            # print("Removing: ", attributeDefinition)
            parent = parent_map[attribute_definition]
            parent.remove(attribute_definition)


def rewrite_localized_name_attributes(doc):
    if isinstance(doc, list):
        for item in doc:
            rewrite_localized_name_attributes(item)
    elif isinstance(doc, dict):
        for key, value in doc.items():
            if key == 'localizedName' or key == 'localizedNameSingular' or key == 'localizedNamePlural' or key == 'localizedShortName':
                # parse the value as json and replace the value with the parsed json
                # print(json.loads(value))
                # print(value)
                if value is not None:
                    doc[key] = json.loads(value)

            rewrite_localized_name_attributes(value)


def rewrite_types(doc):
    # print("rewriteTypes: " + str(doc))
    if isinstance(doc, list):
        for item in doc:
            rewrite_types(item)
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

            rewrite_types(value)


def rewrite_attributes(doc):
    if isinstance(doc, list):
        for item in doc:
            rewrite_attributes(item)
    elif isinstance(doc, dict):
        for key, value in doc.items():
            if value is not None and key == 'attributeDefinitions':
                # print (value)
                attribute_definition = value['attributeDefinition']
                # print(attributeDefinition)
                # print(type(attributeDefinition))
                # if attributeDefinition is a list, then create a new list
                if isinstance(attribute_definition, list):

                    newList = []
                    for attribute in attribute_definition:
                        newList.append(attribute)

                    # replace the value with the list object
                    doc[key] = newList

                elif isinstance(attribute_definition, dict):
                    newList = []
                    newList.append(attribute_definition)

                    # replace the value with the list object
                    doc[key] = newList

            rewrite_attributes(value)


def remove_generic_elements(root, parent_map):
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


def return_all_searches(root, parent_map):
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


def return_all_low_code_scripts(root, parent_map):
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


def find_all_widgets(root, parent_map):
    result = []
    # Find elements by XPath and remove them
    for target in root.findall('.//widgetContainer'):
        # convert target from xml to json
        asJson = xmltodict.parse(ET.tostring(target, encoding='utf-8', method='xml').decode('utf-8'))

        # print(asJson)

        widget_container = asJson['widgetContainer']

        # parse widgetsLayout value of widgetContainer as json
        # print(widgetContainer['widgetsLayout'])

        widget_id2widget = {}

        layout_ = widget_container['widgetsLayout']
        if layout_ is not None:
            layout_as_json = json.loads(layout_)
            widget_container['widgetsLayout'] = layout_as_json

            widgets = widget_container['widgets']
            if widgets is not None:
                actual_widgets = widgets['widget']
                if actual_widgets is not None:
                    if isinstance(actual_widgets, list):
                        for widget in actual_widgets:
                            widget_id = widget['widgetId']
                            widget_id2widget[widget_id] = widget
                            # print ("adding: ", widgetId, widget)
                    elif isinstance(actual_widgets, dict):
                        widget_id = actual_widgets['widgetId']
                        widget_id2widget[widget_id] = actual_widgets
                        # print ("is dict")
                        # print (actualWidgets)
                    # else:
                    #     # print type of actualWidgets
                    #     # print("No list nor dict" + str(type(actualWidgets)))
                # else:
                #     # print("No widgets found - 2")
            # else:
            #     print("No widgets found - 1")

            for row in layout_as_json['rows']:
                for column in row['columns']:
                    for widget in column['widgets']:
                        widget_id = widget['id']
                        # print(widgetId)
                        # print("widgetId2widget: " + str(widgetId2widget))

                        # test if the widgetId is in the map widgetId2widget
                        if widget_id in widget_id2widget:
                            widget_from_map = widget_id2widget[widget_id]

                            # iterate over the keys of the widgetFromMap
                            for key in widget_from_map:
                                # if the key is not in the widget, then add it
                                if key not in widget:
                                    value = widget_from_map[key]
                                    if key == 'attributes' and value is not None:
                                        # print ("value: ", json.dumps(value, separators=(',', ':')))
                                        new_value = value['attribute']
                                        if isinstance(new_value, list):
                                            for eachValue in new_value:
                                                # print(eachValue['values'])
                                                eachValue['value'] = eachValue['values']['value']
                                                del eachValue['values']
                                                if 'embeddedWidgets_values' in eachValue:
                                                    del eachValue['embeddedWidgets_values']
                                        else:
                                            new_value['value'] = new_value['values']['value']
                                            del new_value['values']
                                            if 'embeddedWidgets_values' in new_value:
                                                del new_value['embeddedWidgets_values']

                                        widget[key] = new_value
                                    else:
                                        widget[key] = value

                            del widget['widgetId']
                        else:
                            print("Widget not found: ", widget_id, widget_id2widget)

            # print(json.dumps(layoutAsJson, separators=(',', ':')))
            result.append(layout_as_json)
    return result


def print_token_counts(folderName):
    print_token_count_for_file(folderName, "copilot_examples.js")
    print_token_count_for_file(folderName, "types-compressed.json")
    print_token_count_for_file(folderName, "types-pretty.json")
    print_token_count_for_file(folderName, "types-pretty.yaml")


def print_token_count_for_file(folder_name, file_name):
    print("tokens " + file_name + ": " + str(count_tokens_in_file(folder_name + "/" + file_name)))


def run_for_folder(folder_name):

    # delete all files with name *.json in folder name
    files = os.listdir(folder_name)
    for f in files:
        if f.endswith('.json') or f.endswith('.js') or f.endswith('.yaml'):
            os.remove(folder_name + '/' + f)

    # read from file name + '/typesToBeRemoved.txt'
    with open(folder_name + '/typesToBeRemoved.txt') as f:
        # read each line and store it in a list
        types_to_be_removed = f.read().splitlines()

    # Load and parse the XML document
    tree = ET.parse(folder_name + '/export.xml')
    root = tree.getroot()

    # Create a dictionary that maps from children to their parents
    parent_map = {c: p for p in tree.iter() for c in p}

    searches = return_all_searches(root, parent_map)
    # print("Searches: ", searches)
    write_json_to_file(folder_name, "searches", searches)

    searches = searches[:10]
    write_json_to_file(folder_name, "searches-10", searches)

    low_code_scripts = return_all_low_code_scripts(root, parent_map)
    # print("LowCodeScripts: ", lowCodeScripts)
    write_low_code_scripts_to_file(folder_name, "lowCodeScripts", low_code_scripts)

    widgets = find_all_widgets(root, parent_map)
    # print("Widgets: ", widgets)
    write_json_to_file(folder_name, "widgets", widgets)

    remove_generic_elements(root, parent_map)

    # iterate through the list and print each line
    for t in types_to_be_removed:
        remove(root, parent_map, './/type[name="' + t + '"]')

    remove_empty_elements(root)

    print ("After removing the types:")
    print_all_types(root)

    # store XML to a string
    as_string = ET.tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    doc = xmltodict.parse(as_string)

    rewrite_localized_name_attributes(doc)

    rewrite_attributes(doc)
    rewrite_types(doc)

    write_json_to_file(folder_name, "types", doc)

    copilot_examples = generate_copilot_examples(doc)
    # print(copilot_examples)
    write_copilot_examples_to_file(folder_name, "copilot_examples", copilot_examples)

    print_token_counts(folder_name)

    # q: how to prevent a warning to be printed?
    # a: use the following command to suppress the warning:
    # warnings.simplefilter("ignore", exceptions.SecurityWarning)


def write_json_to_file(folder_name, file_name, o):
    with open(folder_name + '/' + file_name + '-pretty.json', 'w') as f:
        f.write(json.dumps(o, indent=4))
    with open(folder_name + '/' + file_name + '-compressed.json', 'w') as f:
        f.write(json.dumps(o, separators=(',', ':')))

    with open(folder_name + '/' + file_name + '-pretty.yaml', 'w') as f:
        # convert object to yaml and write it to file
        # q: how to convert an object to yaml?
        # a: use the yaml.dump function
        f.write(yaml.dump(o))


def write_low_code_scripts_to_file(folder_name, file_name, low_code_scripts):
    with open(folder_name + '/' + file_name + '.js', 'w') as f:
        for low_code_script in low_code_scripts:
            # separate the lowCodeScripts by a new line and "---------------------------------------------------"
            f.write(low_code_script + "\n")
            f.write("\n")
            f.write("//------------------------------------------------------------------------------------------------------\n")
            f.write("\n")


def write_copilot_examples_to_file(folder_name, file_name, copilot_examples):
    with open(folder_name + '/' + file_name + '.js', 'w') as f:
        f.write(copilot_examples)
