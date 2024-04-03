import json
import os
import xml

import xml.dom.minidom

import xml.etree.ElementTree as ET
import xmltodict

from util import remove, remove_empty_elements, write_json_to_file


def process_pkg(folder_name):

    folder_name_generated = folder_name + '/generated'

    print("processing folder: " + folder_name)

    # delete folder folder_name_generated if it exists with all its content
    if os.path.exists(folder_name_generated):
        os.system("rm -r " + folder_name_generated)

    # create folder folder_name_generated
    os.mkdir(folder_name_generated)

    with open(folder_name + '/types-to-be-removed.txt') as f:
        # read each line and store it in a list
        types_to_be_removed = f.read().splitlines()

    # Load and parse the XML document
    tree = ET.parse(folder_name + '/export.xml')
    root = tree.getroot()

    write_type_names(root, folder_name_generated, 'types-all')

    # Create a dictionary that maps from children to their parents
    parent_map = {c: p for p in tree.iter() for c in p}

    remove_generic_elements(root, parent_map)

    for t in types_to_be_removed:
        remove(root, parent_map, './/typeDef[name="' + t + '"]')

    remove_empty_elements(root)

    write_type_names(root, folder_name_generated, 'types-after-removal')

    # q: how to convert an xml element to a string with indentation of 2 spaces?



    # store XML to a string with formatting
    as_string = pretty_print_xml(root)

    with open(folder_name_generated + '/thinned-out.xml', 'w') as f:
        f.write(as_string)


def pretty_print_xml(element):
    xml_str = ET.tostring(element, encoding='utf8').decode('utf8')
    dom = xml.dom.minidom.parseString(xml_str)  # parse the XML string to a DOM
    pretty_xml_str = dom.toprettyxml(indent="  ")  # convert the DOM to a pretty printed string with 2 spaces indentation
    return pretty_xml_str

def write_type_names(root, folder_name, file_name):
    type_names = []
    for name in root.findall('.//types/typeDef/name'):
        type_names.append(name.text)

    with open(folder_name + '/' +  file_name + '.txt', 'w') as f:
        for item in type_names:
            f.write("%s\n" % item)


def remove_generic_elements(root, parent_map):
    remove(root, parent_map, './/workspace/pages')

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
    # remove(root, parent_map, './/enumerationValues')
    remove(root, parent_map, './/enumerationValues2icons')
    # remove(root, parent_map, './/enumerationValues2localizedLabels')

    remove(root, parent_map, './/fixNameGenerationPattern')
    remove(root, parent_map, './/fixDisplayNameGenerationPattern')
    remove(root, parent_map, './/cplaceJSEditLanguageScript')
    remove(root, parent_map, './/fixAutocompleteDetailsPattern')
    remove(root, parent_map, './/showInExplorer')
    remove(root, parent_map, './/defaultWidgetContainerDef')
    remove(root, parent_map, './/name2additionalWidgetContainerDefs')
    remove(root, parent_map, './/cplaceJSTypeMessages')

    remove(root, parent_map, './/fixedTypeNames')
    remove(root, parent_map, './/showLinkAsTextOnly')
    remove(root, parent_map, './/additionalFiltersSupplier')
    remove(root, parent_map, './/additionalFilterValidationErrorMessage')
    remove(root, parent_map, './/sortOrderForReference')
    remove(root, parent_map, './/cplaceJSValidator')
    remove(root, parent_map, './/readOnly')
    remove(root, parent_map, './/isFixed')
    remove(root, parent_map, './/queryableByApp')
    remove(root, parent_map, './/queryableForScripting')



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
                    print(type(value) + " : " + value)
                    doc[key] = json.loads(value)

            rewrite_localized_name_attributes(value)


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

                new_list = []
                if isinstance(attribute_definition, list):
                    for attribute in attribute_definition:
                        new_list.append(attribute)

                    # replace the value with the list object
                    doc[key] = new_list

                elif isinstance(attribute_definition, dict):
                    new_list.append(attribute_definition)

                    # replace the value with the list object
                    doc[key] = new_list

            rewrite_attributes(value)

        # if the key is "enumerationValues" and the value is not None
        if 'enumerationValues' in doc and doc['enumerationValues'] is not None:
            # parse the value as json and replace the value with the parsed json
            new_value = json.loads(doc['enumerationValues'])
            # print the type of new_value
            if isinstance(new_value, list):
                # print the length of new_value
                # print(len(new_value))
                # iterate over all elements in new_value
                for i in range(len(new_value)):
                    value = new_value[i]
                    # if value is a string and starts with "s" - strip the first character and replace the value with the result
                    if isinstance(value, str) and value.startswith('s'):
                        new_value[i] = value[1:]
                    # if value is a string and starts with "d" - strip the first character, convert the value to a double and replace the value with the result
                    elif isinstance(value, str) and value.startswith('d'):
                        new_value[i] = float(value[1:])

            doc['enumerationValues'] = new_value

        # if the key is "enumerationValues2localizedLabels" and the value is not None
        if 'enumerationValues2localizedLabels' in doc and doc['enumerationValues2localizedLabels'] is not None:
            # parse the value as json and replace the value with the parsed json
            parsed_value = json.loads(doc['enumerationValues2localizedLabels'])

            if isinstance(parsed_value, dict):
                # q: how to prevent "RuntimeError: dictionary keys changed during iteration"?
                # a: create a new dictionary and iterate over the keys of the old dictionary

                new_value = {}

                for key, value in parsed_value.items():
                    if isinstance(key, str) and key.startswith('s'):
                        new_key = key[1:]
                        new_value[new_key] = parsed_value.get(key)
                    elif isinstance(key, str) and key.startswith('d'):
                        new_key = float(key[1:])
                        new_value[new_key] = parsed_value.get(key)

                doc['enumerationValues2localizedLabels'] = new_value


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
