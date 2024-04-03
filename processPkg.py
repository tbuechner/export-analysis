import json
import os
import xml

from xml.dom import minidom

import xml.etree.ElementTree as ET
import xmltodict

import textwrap

from util import remove, remove_empty_elements, write_json_to_file, write_token_count


def add_reference_constraint_def_class(constraint_factory):
    # get child element with tag 'multiplicity'
    multiplicity = constraint_factory.find('.//multiplicity')
    key = multiplicity.find('.//key')
    if key is not None:
        if key.text == 'exactlyOne' or key.text == 'maximalOne':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleReferenceAttributeDef$SingleCustomReferenceAttributeDef')
            return
    add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.MultiReferenceAttributeDef$MultiCustomReferenceAttributeDef')


def add_mandatory_elements(root, parent_map):
    package = root.find('.//package')
    add_element(package, 'cplaceRelease', '24.1')
    add_element(package, 'publishDate', '2024-01-25T14:49:25.893+01:00')

    add_element(root, 'maps')

    # find all workspace elements
    workspaces = root.findall('.//workspace')
    for workspace in workspaces:
        add_element(workspace, 'apps', '["cf.cplace.platform"]')

    constraint_factories = root.findall('.//constraintFactory')
    for constraint_factory in constraint_factories:
        if constraint_factory.get('type') == 'textEnumerationConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleStringAttributeDef')
        elif constraint_factory.get('type') == 'stringConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleStringAttributeDef')
        elif constraint_factory.get('type') == 'dateConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleDateAttributeDef')
        elif constraint_factory.get('type') == 'numberConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleNumberAttributeDef')
        elif constraint_factory.get('type') == 'richStringConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleRichStringAttributeDef')
        elif constraint_factory.get('type') == 'booleanConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleBooleanAttributeDef')
        elif constraint_factory.get('type') == 'colorConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleStringAttributeDef')
        elif constraint_factory.get('type') == 'localizedStringConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleLocalizedStringAttributeDef')
        elif constraint_factory.get('type') == 'dynamicEnumerationConstraint':
            add_element(constraint_factory, 'attributeDefClass', 'cf.cplace.platform.assets.custom.def.SingleDynamicEnumerationAttributeDef')
        elif constraint_factory.get('type') == 'referenceConstraint':
            add_reference_constraint_def_class(constraint_factory)
        else:
            print(constraint_factory.get('type'))

    type_defs = root.findall('.//typeDef')
    for type_def in type_defs:
        applies_to = ET.Element('appliesTo')
        type_def.append(applies_to)
        key = ET.Element('key')
        key.text = 'page'
        applies_to.append(key)

        localized_page_names_mode = ET.Element('localizedPageNamesMode')
        type_def.append(localized_page_names_mode)
        key = ET.Element('key')
        key.text = 'none'
        localized_page_names_mode.append(key)

    attributes = root.findall('.//attributes')
    for attribute in attributes:
        constraint_factory = attribute.find('.//constraintFactory')
        if constraint_factory.get('type') == 'dynamicEnumerationConstraint':
            parent_map.get(attribute).remove(attribute)


def add_element(package, element_name, text=None):
    new_element = ET.Element(element_name)
    if text is not None:
        new_element.text = text
    package.append(new_element)


def process_pkg(folder_name):

    folder_name_generated = folder_name + '/generated'

    print("processing folder: " + folder_name)

    # delete folder folder_name_generated if it exists with all its content
    if os.path.exists(folder_name_generated):
        os.system("rm -r " + folder_name_generated)

    # create folder folder_name_generated
    os.mkdir(folder_name_generated)

    with open(folder_name + '/types-to-be-removed.txt') as f:
        types_to_be_removed = f.read().splitlines()

    with open(folder_name + '/slots-to-be-retained.txt') as f:
        slots_to_be_retained = f.read().splitlines()

    # Load and parse the XML document
    tree = ET.parse(folder_name + '/export.xml')
    root = tree.getroot()

    write_type_names(root, folder_name_generated, 'types-all')

    parent_map = {c: p for p in tree.iter() for c in p}

    remove_slots(root, parent_map, slots_to_be_retained)

    remove_generic_elements(root, parent_map)

    for t in types_to_be_removed:
        remove(root, parent_map, './/typeDef[name="' + t + '"]')

    remove_empty_elements(root)

    write_type_names(root, folder_name_generated, 'types-after-removal')

    pretty_print_xml(root, 0)

    with open(folder_name_generated + '/thinned-out.xml', 'w') as f:
        f.write(ET.tostring(root, encoding='unicode'))

    write_token_counts(folder_name_generated)

    parent_map = {c: p for p in tree.iter() for c in p}
    add_mandatory_elements(root, parent_map)

    pretty_print_xml(root, 0)

    with open(folder_name_generated + '/export.xml', 'w') as f:
        f.write(ET.tostring(root, encoding='unicode'))

    # zip export.xml into package.zip
    os.system("zip -j " + folder_name_generated + "/package.zip " + folder_name_generated + "/export.xml")


def remove_slots(root, parent_map, slots_to_be_retained):
    for slot in root.findall('.//slot'):
        internal_name = slot.get('internalName')
        if internal_name not in slots_to_be_retained:
            slot_parent = parent_map[slot]
            parent = root if slot_parent is None else slot_parent
            parent.remove(slot)


def write_token_counts(folder_name):
    with open(folder_name + '/' + 'token-counts.txt', 'w') as f:
        write_token_count(f, folder_name, "thinned-out.xml")


def pretty_print_xml(elem, level=0, indentation="  "):
    """
    Recursively print an XML element with indentation for pretty formatting.

    Parameters:
    - elem: The XML element to print.
    - level: The current level in the tree (used for indentation).
    - indentation: The string used for indentation, defaulting to two spaces.
    """
    # Add indentation
    indent = "\n" + level * indentation
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = indent + indentation
        if not elem.tail or not elem.tail.strip():
            elem.tail = indent
        for elem in elem:
            pretty_print_xml(elem, level+1, indentation)
        if not elem.tail or not elem.tail.strip():
            elem.tail = indent
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = indent


def write_type_names(root, folder_name, file_name):
    type_names = []
    for name in root.findall('.//types/typeDef/name'):
        type_names.append(name.text)

    with open(folder_name + '/' +  file_name + '.txt', 'w') as f:
        for item in type_names:
            f.write("%s\n" % item)


def remove_generic_elements(root, parent_map):
    remove(root, parent_map, './/workspace/pages')

    remove(root, parent_map, './/workspace/pluginSpaceConfigurations')
    remove(root, parent_map, './/workspace/rootPage')
    remove(root, parent_map, './/workspace/lowCodeJobs')
    remove(root, parent_map, './/numberOfNonrootPages')
    remove(root, parent_map, './/workspace/customCssClasses')
    remove(root, parent_map, './/workspace/apps')
    remove(root, parent_map, './/workspace/id')
    remove(root, parent_map, './/workspace/numberOfNonrootPages')

    remove(root, parent_map, './/package/changelog')
    remove(root, parent_map, './/package/parentPackages')
    remove(root, parent_map, './/package/publishDate')
    remove(root, parent_map, './/package/cplaceRelease')
    remove(root, parent_map, './/package/description')

    remove(root, parent_map, './/maps')

    remove(root, parent_map, './/typeDef/nameTableColumnWidth')
    remove(root, parent_map, './/typeDef/defaultPageInPackageStrategy')
    remove(root, parent_map, './/typeDef/showInGlobalSearch')
    remove(root, parent_map, './/typeDef/localizedPageNamesMode')
    remove(root, parent_map, './/typeDef/appliesTo')
    remove(root, parent_map, './/typeDef/allowDivergentLayouts')
    remove(root, parent_map, './/typeDef/hideTabVersions')
    remove(root, parent_map, './/typeDef/showNewButton')
    remove(root, parent_map, './/typeDef/showInGlobalNewDialog')
    remove(root, parent_map, './/typeDef/enableIconLink')
    remove(root, parent_map, './/typeDef/namesAreUnique')
    remove(root, parent_map, './/typeDef/isTuple')
    remove(root, parent_map, './/typeDef/internalAttributeNamePrefix')
    remove(root, parent_map, './/typeDef/autocompleteDetailsPattern')
    remove(root, parent_map, './/typeDef/displayNameGenerationPattern')
    remove(root, parent_map, './/typeDef/nameGenerationPattern')
    remove(root, parent_map, './/typeDef/iconName')
    remove(root, parent_map, './/typeDef/cplaceJSChangeListeners')
    remove(root, parent_map, './/typeDef/cplaceJSPageActions')


    remove(root, parent_map, './/typeDef/fixNameGenerationPattern')
    remove(root, parent_map, './/typeDef/fixDisplayNameGenerationPattern')
    remove(root, parent_map, './/typeDef/cplaceJSEditLanguageScript')
    remove(root, parent_map, './/typeDef/fixAutocompleteDetailsPattern')
    remove(root, parent_map, './/typeDef/showInExplorer')
    remove(root, parent_map, './/typeDef/defaultWidgetContainerDef')
    remove(root, parent_map, './/typeDef/name2additionalWidgetContainerDefs')
    remove(root, parent_map, './/typeDef/cplaceJSTypeMessages')
    remove(root, parent_map, './/typeDef/id')

    remove(root, parent_map, './/constraintFactory/fixedTypeNames')
    remove(root, parent_map, './/constraintFactory/showLinkAsTextOnly')
    remove(root, parent_map, './/constraintFactory/additionalFiltersSupplier')
    remove(root, parent_map, './/constraintFactory/additionalFilterValidationErrorMessage')
    remove(root, parent_map, './/constraintFactory/sortOrderForReference')
    remove(root, parent_map, './/constraintFactory/cplaceJSValidator')
    remove(root, parent_map, './/constraintFactory/readOnly')
    remove(root, parent_map, './/constraintFactory/isFixed')
    remove(root, parent_map, './/constraintFactory/queryableByApp')
    remove(root, parent_map, './/constraintFactory/queryableForScripting')
    remove(root, parent_map, './/constraintFactory/showMultiLine')
    remove(root, parent_map, './/constraintFactory/defaultValuesSupplier')
    remove(root, parent_map, './/constraintFactory/refreshAfterSetting')
    remove(root, parent_map, './/constraintFactory/validateAdditionalFilters')
    remove(root, parent_map, './/constraintFactory/showInverseRoleAsList')
    remove(root, parent_map, './/constraintFactory/showInMenuIfHierarchy')

    remove(root, parent_map, './/constraintFactory/regexp')
    remove(root, parent_map, './/constraintFactory/regexpErrorMessage')

    remove(root, parent_map, './/constraintFactory/dateFormatSupplier')
    remove(root, parent_map, './/constraintFactory/withTime')

    remove(root, parent_map, './/constraintFactory/attributeDefClass')
    remove(root, parent_map, './/constraintFactory/dynamicEnumerationProviderClass')

    remove(root, parent_map, './/attributes/alternativeValueRepresentation')
    remove(root, parent_map, './/attributes/cplaceJSValidator')
    remove(root, parent_map, './/attributes/readOnly')
    remove(root, parent_map, './/attributes/queryableForScripting')
    remove(root, parent_map, './/attributes/queryableByApp')
    remove(root, parent_map, './/attributes/showInColumnSelection')
    remove(root, parent_map, './/attributes/tableColumnWidth')
    remove(root, parent_map, './/attributes/showValuesWithLineBreak')
    remove(root, parent_map, './/attributes/showInNewDialog')
    remove(root, parent_map, './/attributes/showInAttributesWidget')
    remove(root, parent_map, './/attributes/showInTables')
    remove(root, parent_map, './/attributes/isFixed')

    remove(root, parent_map, './/attributes/duplicatesAreAllowed')
    remove(root, parent_map, './/attributes/showCreateNewButton')
    remove(root, parent_map, './/attributes/derivedAttributeDef')


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
