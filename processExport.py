import json
import xml.etree.ElementTree as ET

import xmltodict

import os

import util
from jsonToCode import generate_copilot_examples_constants, convert_json_to_js, generate_copilot_examples_literals
from util import remove, remove_empty_elements, write_json_to_file, write_to_file, write_token_count


def print_all_types(root):
    # find all <name> elements of root which sit under a <type> element
    for name in root.findall('.//type/name'):
        print(name.text)


def write_types(root, folder_name, file_name):
    # find all <name> elements of root which sit under a <type> element
    type_names = []
    for name in root.findall('.//type/name'):
        type_names.append(name.text)

    with open(folder_name + '/' +  file_name + '.txt', 'w') as f:
        for item in type_names:
            f.write("%s\n" % item)


def remove_non_reference_attributes(root, parent_map):
    global parent
    for attribute_definition in root.findall('.//attributeDefinition'):
        type_constraint = attribute_definition.find('typeConstraint')
        # print("typeConstraint: ", typeConstraint)
        if type_constraint is not None and type_constraint.text != 'Link':
            # print("Removing: ", attributeDefinition)
            parent = parent_map[attribute_definition]
            util.remove(attribute_definition)


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
    # remove(root, parent_map, './/enumerationValues')
    remove(root, parent_map, './/enumerationValues2icons')
    # remove(root, parent_map, './/enumerationValues2localizedLabels')


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


class LowCodeScript:

    counter = 0

    def __init__(self, script_type, code, type_name=None, attributes=None):
        self.type = script_type
        self.code = code
        self.attributes = attributes
        self.type_name = type_name
        self.counter = LowCodeScript.counter
        LowCodeScript.counter += 1


def return_all_low_code_scripts(root, parent_map):
    scripts = []
    LowCodeScript.counter = 0

    for element in root.iter():
        if element.text is not None and element.tag == "lowCodeScript":
            script_type = element.find('scriptType').text
            code = element.find('cplaceJSScript').text
            # q: how to access the parent of an element?
            # a: use the parent_map to access the parent of an element
            parent_parent = parent_map[parent_map[element]]
            type_name = parent_parent.find('name').text
            script = LowCodeScript(script_type, code, type_name)
            additional_data = element.find('additionalData')
            if additional_data is not None:
                # parse the additionalData as json
                if additional_data.text is not None:
                    additional_data_as_json = json.loads(additional_data.text)
                    # if the key "attributeNames" exists in the json
                    if "attributeNames" in additional_data_as_json:
                        # print all keys of additionalDataAsJson
                        # print(additionalDataAsJson.keys())
                        script.attributes = additional_data_as_json["attributeNames"]
            scripts.append(script)

    # iterate over all elements in the tree
    for element in root.iter():
        # if the text of the element starts with "s{"filters":"
        if element.text is not None and element.text.startswith('s{') and element.text.endswith('}'):
            text = element.text[1:]
            # parse text as json
            text_as_json = json.loads(text)

            # if the key "script" exists in the json
            if "script" in text_as_json:
                # print all keys of text_as_json
                # print(text_as_json.keys())
                code = text_as_json["script"]
                script = LowCodeScript('custom_attribute', code)
                scripts.append(script)
                # print(text_as_json["script"])

    return scripts


def remove_attribute(widget_, name):
    if 'attributes' in widget_:
        for attribute in widget_['attributes']:
            if 'name' in attribute and attribute['name'] == name:
                # remove the attribute
                widget_['attributes'].remove(attribute)


def remove_all_attributes(widget_):
    del widget_['attributes']


def remove_configuration(widget_, name):
    if 'configuration' in widget_:
        for attribute in widget_['configuration']:
            if 'name' in attribute and attribute['name'] == name:
                # remove the attribute
                widget_['configuration'].remove(attribute)


def get_attribute_value(widget_, name):
    if 'attributes' in widget_:
        for attribute in widget_['attributes']:
            if 'name' in attribute and attribute['name'] == name:
                return attribute['value']


def count_widget_kinds(widgets, folder_name_generated):
    widget_kind_2_count = {}

    # iterate over all widgets
    for widget in widgets:
        # iterate over all rows
        for row in widget['rows']:
            # iterate over all columns
            for column in row['columns']:
                # iterate over all widgets
                for widget_ in column['widgets']:
                    widget_type = widget_['widgetType']

                    # increase the count of the widgetType by 1
                    if widget_type in widget_kind_2_count:
                        widget_kind_2_count[widget_type] += 1
                    else:
                        widget_kind_2_count[widget_type] = 1

    with open(folder_name_generated + '/' + 'widget-kind-to-count.json', 'w') as f:
        f.write(json.dumps(widget_kind_2_count, indent=4))


def replace_embedded_widget(value):

    while '<embeddedwidget>' in value:
        # find the index of '<embeddedwidget>'
        start = value.find('<embeddedwidget>')
        # find the index of '</embeddedwidget>'
        end = value.find('</embeddedwidget>')
        # replace the content between '<embeddedwidget>' and '</embeddedwidget>' with '<_embeddedwidget_>'
        value = value[:start] + '<_embeddedwidget_>' + value[end + len('</embeddedwidget>'):]
        # print("value: ", value)

    return value


def strip_embedded_widgets(widget_):
    if 'attributes' in widget_:
        if isinstance(widget_['attributes'], list):
            for attribute in widget_['attributes']:
                replace_embedded_widget_in_attribute(attribute)
        elif isinstance(widget_['attributes'], dict):
            replace_embedded_widget_in_attribute(widget_['attributes'])
    else:
        print("No attributes found: ", widget_)


def replace_embedded_widget_in_attribute(attribute):
    if isinstance(attribute, dict) and 'value' in attribute and attribute['value'] is not None:
        value = attribute['value']
        if isinstance(value, str):
            # if value contains <embeddedwidget>any_content</embeddedwidget> at any place - strip the content between the tags
            attribute['value'] = replace_embedded_widget(value)


def condense_attributes_group(value):
    layout = value['widgetsLayout']
    for row in layout['rows']:
        # iterate over all columns
        for column in row['columns']:
            # iterate over all widgets
            for widget_ in column['widgets']:
                remove_configuration(widget_, 'cf.platform.inPlaceEditing')
                remove_configuration(widget_, 'cf.platform.reloadAfterChange')
                remove_configuration(widget_, 'cf.platform.useParent')
                remove_configuration(widget_, 'cf.platform.singleColumn')
                remove_configuration(widget_, 'cf.platform.withLabel')
                remove_configuration(widget_, 'cf.platform.withValue')

                remove_configuration(widget_, 'inPlaceEditing')
                remove_configuration(widget_, 'reloadAfterChange')
                remove_configuration(widget_, 'showAttributeScript')
                remove_configuration(widget_, 'singleColumn')
                remove_configuration(widget_, 'singleSelectionWidgetId')
                remove_configuration(widget_, 'withLabel')
                remove_configuration(widget_, 'withValue')


def rewrite_search(search):
    for filter in search['filters']:
        if 'customAttributeMultiExactValues' in filter:
            for value in filter['values']:
                if isinstance(value, str) and value.startswith('s'):
                    # replace the value in the list with the result of stripping the first character
                    filter['values'][filter['values'].index(value)] = value[1:]
                elif isinstance(value, str) and value.startswith('d'):
                    filter['values'][filter['values'].index(value)] = float(value[1:])


def write_widgets_per_type(widgets, widgets_for_types_folder, folder_name_generated):
    type_2_widgets = {}
    type_2_count = {}

    for widget in widgets:
        type_name = widget['typeName']
        if type_name is not None:
            if type_name in type_2_widgets:
                type_2_widgets[type_name].append(widget)
            else:
                type_2_widgets[type_name] = [widget]

            # increase the count by 1
            if type_name in type_2_count:
                type_2_count[type_name] += 1
            else:
                type_2_count[type_name] = 1

    for type_name in type_2_widgets:

        simple_type_name = type_name.split(".")[-1]
        simple_type_name = simple_type_name[0].lower() + simple_type_name[1:]

        widgets = type_2_widgets[type_name]

        write_json_to_file(widgets_for_types_folder, simple_type_name + '-widgets', widgets, True)

    with open(folder_name_generated + '/' + 'widget-type-to-count.json', 'w') as f:
        f.write(json.dumps(type_2_count, indent=4))


def condense_widgets(widgets):

    # iterate over all widgets
    for widget in widgets:
        # iterate over all rows
        for row in widget['rows']:
            # iterate over all columns
            for column in row['columns']:
                # iterate over all widgets
                for widget_ in column['widgets']:
                    strip_embedded_widgets(widget_)

                    widget_type = widget_['widgetType']

                    # if widget_type equals 'cf.cplace.visualizations.scriptingHighcharts'
                    if widget_type == 'cf.cplace.visualizations.scriptingHighcharts':
                        remove_attribute(widget_, 'cf.cplace.visualization.script')
                        remove_attribute(widget_, 'cf.cplace.visualization.showFrame')
                        remove_attribute(widget_, 'height')
                        remove_attribute(widget_, 'sortOrder')

                    if widget_type == 'de.visualistik.visualRoadmap.widget':
                        remove_all_attributes(widget_)

                    if widget_type == 'cf.cplace.platform.connectedAttributesGroup':
                        remove_attribute(widget_, 'singleSelectionWidgetId')
                        remove_attribute(widget_, 'singleColumn')
                        remove_attribute(widget_, 'height')
                        remove_attribute(widget_, 'cf.cplace.platform.useNewFrontend')
                        remove_attribute(widget_, 'cf.cplace.platform.attributesGroup.showFrame')
                        condense_attributes_group(get_attribute_value(widget_, 'cf.cplace.platform.attributesGroup.layout'))

                    if widget_type == 'cf.cplace.platform.attributesGroup':
                        remove_attribute(widget_, 'cf.cplace.platform.attributesGroup.showFrame')
                        remove_attribute(widget_, 'cf.cplace.platform.attributesGroup.useNewFrontend')
                        remove_attribute(widget_, 'cf.platform.attributesGroup.enableMultiEdit')
                        remove_attribute(widget_, 'cf.platform.singleColumn')
                        condense_attributes_group(get_attribute_value(widget_, 'cf.cplace.platform.attributesGroup.layout'))

                    if widget_type == 'cf.platform.embeddedSearchAsTable':
                        remove_attribute(widget_, 'showTableActions')
                        remove_attribute(widget_, 'showTableFooter')
                        remove_attribute(widget_, 'showTableHeader')
                        remove_attribute(widget_, 'singleSpaced')
                        remove_attribute(widget_, 'showNewButton')
                        remove_attribute(widget_, 'hideTableLinks')
                        remove_attribute(widget_, 'hideNames')
                        remove_attribute(widget_, 'height')
                        remove_attribute(widget_, 'groupOrder')
                        remove_attribute(widget_, 'columns')
                        rewrite_search(get_attribute_value(widget_, 'search'))

                    if 'attributes' in widget_ and widget_['attributes'] is None:
                        del widget_['attributes']


def rewrite_widgets(widgets):
    # iterate over all widgets
    for widget in widgets:
        # iterate over all rows
        for row in widget['rows']:
            # iterate over all columns
            for column in row['columns']:
                # iterate over all widgets
                for widget_ in column['widgets']:
                    # remove 'collapsed' key from widget_
                    if 'collapsed' in widget_:
                        del widget_['collapsed']
                    # remove 'id' key from widget_
                    if 'id' in widget_:
                        del widget_['id']
                    if 'attributes' in widget_:
                        attributes = widget_['attributes']
                        if isinstance(attributes, list):
                            for attribute in attributes:
                                if 'value' in attribute:
                                    value = attribute['value']
                                    # if value is a string and starts with "s" - strip the first character and replace the value with the result
                                    if isinstance(value, str) and (value.startswith('s') or value.startswith('m')):
                                        new_value = value[1:]
                                        # test if new_value is a json string or json array
                                        if new_value.startswith('{') or new_value.startswith('['):
                                            # parse new_value as json - catch json.decoder.JSONDecodeError
                                            try:
                                                new_value = json.loads(new_value)
                                            except json.decoder.JSONDecodeError:
                                                print("Error parsing json: ", new_value)

                                            # if new_value is a dictionary and has a key "widgets" and "widgetsLayout"
                                            if isinstance(new_value, dict) and 'widgets' in new_value and 'widgetsLayout' in new_value:

                                                widget_id_2_widget = {}

                                                widgets = json.loads(new_value['widgets'])
                                                # iterate over all widgets
                                                for widget__ in widgets:
                                                    # if the widget has a key "configuration"
                                                    if 'configuration' in widget__:
                                                        # convert configuration value of widget to json
                                                        widget__['configuration'] = json.loads(widget__['configuration'])
                                                    # if the widget has a key "id"
                                                    widget_id_2_widget[widget__['id']] = widget__

                                                del new_value['widgets']
                                                # new_value['widgets'] = widgets

                                                # convert widgetsLayout value of new_value to json
                                                widgets_layout = json.loads(new_value['widgetsLayout'])
                                                new_value['widgetsLayout'] = widgets_layout

                                                # iterate over all rows
                                                for row_ in widgets_layout['rows']:
                                                    # iterate over all columns
                                                    for column_ in row_['columns']:
                                                        # iterate over all widgets
                                                        new_widgets = []
                                                        for widget__ in column_['widgets']:
                                                            widget_id = widget__['id']
                                                            # test if the widgetId is in the map widgetId2widget
                                                            if widget_id in widget_id_2_widget:
                                                                widget_from_map = widget_id_2_widget[widget_id]
                                                                del widget_from_map['id']

                                                                new_widgets.append(widget_from_map)

                                                                del widget__['id']
                                                            else:
                                                                print("Widget not found: ", widget_id, widget_id_2_widget)

                                                        column_['widgets'] = new_widgets


                                        attribute['value'] = new_value
                                    # if value is a string and starts with "b" - strip the first character and convert the value to a boolean
                                    elif isinstance(value, str) and value.startswith('b'):
                                        attribute['value'] = value[1:] == 'true'
                                    # if value is a string and starts with "d" - strip the first character and convert the value to a number
                                    elif isinstance(value, str) and value.startswith('d'):
                                        attribute['value'] = float(value[1:])
                                    elif isinstance(value, str) and value.startswith('r'):
                                        attribute['value'] = value[1:]


def find_all_widgets(root, parent_map):
    result = []
    # Find elements by XPath and remove them
    for target in root.findall('.//widgetContainer'):

        parent = parent_map[target]

        # convert target from xml to json
        as_json = xmltodict.parse(ET.tostring(target, encoding='utf-8', method='xml').decode('utf-8'))

        # print(asJson)

        widget_container = as_json['widgetContainer']

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

            layout_type = parent.tag
            if 'page' == layout_type:
                layout_type = 'pageLayout'
            elif 'type' == layout_type:
                layout_type = 'typeLayout'

            layout_as_json['layoutType'] = layout_type

            if 'typeDefinitionLayout' == parent.tag:
                as_json = xmltodict.parse(ET.tostring(parent, encoding='utf-8', method='xml').decode('utf-8'))
                type_definition_layout = as_json['typeDefinitionLayout']
                layout_as_json['internalLayoutName'] = type_definition_layout['internalName']
                layout_as_json['localizedLayoutName'] = json.loads(type_definition_layout['localizedName'])

                type_ = parent_map[parent_map[parent]]
                as_json = xmltodict.parse(ET.tostring(type_, encoding='utf-8', method='xml').decode('utf-8'))
                layout_as_json['typeName'] = as_json['type']['name']

        if 'type' == parent.tag:
                as_json = xmltodict.parse(ET.tostring(parent, encoding='utf-8', method='xml').decode('utf-8'))
                type_definition_layout = as_json['type']
                layout_as_json['typeName'] = type_definition_layout['name']

    return result


def write_token_counts(folder_name):
    with open(folder_name + '/' + 'token-counts.txt', 'w') as f:
        write_token_count(f, folder_name, "copilot_examples_constants.js")
        write_token_count(f, folder_name, "copilot_examples_literals.js")
        write_token_count(f, folder_name, "types-compressed.json")
        write_token_count(f, folder_name, "types-pretty.json")
        write_token_count(f, folder_name, "types-pretty.yaml")
        write_token_count(f, folder_name, "types.js")
        write_token_count(f, folder_name, "widgets-rewritten-compressed.json")
        write_token_count(f, folder_name, "widgets-rewritten-pretty.json")
        write_token_count(f, folder_name, "widgets-rewritten-pretty.yaml")

        write_token_count(f, folder_name, "widgets-rewritten-first-3-compressed.json")
        write_token_count(f, folder_name, "widgets-rewritten-first-3-pretty.json")
        write_token_count(f, folder_name, "widgets-rewritten-first-3-pretty.yaml")

        write_token_count(f, folder_name, "widgets-condensed-compressed.json")
        write_token_count(f, folder_name, "widgets-condensed-pretty.json")
        write_token_count(f, folder_name, "widgets-condensed-pretty.yaml")


def process_ws_export(folder_name):

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

    write_types(root, folder_name_generated, 'types-all')

    # Create a dictionary that maps from children to their parents
    parent_map = {c: p for p in tree.iter() for c in p}

    searches = return_all_searches(root, parent_map)
    # print("Searches: ", searches)
    write_json_to_file(folder_name_generated, "searches", searches)

    searches = searches[:10]
    write_json_to_file(folder_name_generated, "searches-10", searches)

    low_code_scripts = return_all_low_code_scripts(root, parent_map)
    # print("LowCodeScripts: ", lowCodeScripts)

    low_code_folder_name = folder_name_generated + '/low-code'
    os.mkdir(low_code_folder_name)

    write_low_code_scripts_to_file(folder_name_generated, low_code_folder_name, low_code_scripts)

    widgets = find_all_widgets(root, parent_map)
    # print("Widgets: ", widgets)
    write_json_to_file(folder_name_generated, "widgets", widgets)

    rewrite_widgets(widgets)
    write_json_to_file(folder_name_generated, "widgets-rewritten", widgets)
    write_json_to_file(folder_name_generated, "widgets-rewritten-first-3", widgets[:3])

    count_widget_kinds(widgets, folder_name_generated)

    condense_widgets(widgets)
    write_json_to_file(folder_name_generated, "widgets-condensed", widgets)

    widgets_folder_name = folder_name_generated + '/widgets-for-types'
    os.mkdir(widgets_folder_name)

    write_widgets_per_type(widgets, widgets_folder_name, folder_name_generated)

    remove_generic_elements(root, parent_map)

    for t in types_to_be_removed:
        remove(root, parent_map, './/type[name="' + t + '"]')

    remove_empty_elements(root)

    write_types(root, folder_name_generated, 'types-after-removal')

    # store XML to a string
    as_string = ET.tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    doc = xmltodict.parse(as_string)

    rewrite_localized_name_attributes(doc)

    rewrite_attributes(doc)
    rewrite_types(doc)

    write_json_to_file(folder_name_generated, "types", doc)

    copilot_examples_constants = generate_copilot_examples_constants(doc)
    write_to_file(folder_name_generated, "copilot_examples_constants.js", copilot_examples_constants)

    copilot_examples_literals = generate_copilot_examples_literals(doc)
    write_to_file(folder_name_generated, "copilot_examples_literals.js", copilot_examples_literals)

    types_folder_name = folder_name_generated + '/copilot-examples-for-types'
    os.mkdir(types_folder_name)

    convert_json_to_js(doc, folder_name_generated, True, False)
    convert_json_to_js(doc, folder_name_generated, True, True)
    convert_json_to_js(doc, types_folder_name, False, True)

    # convert_json_to_js_per_type(doc, types_folder_name, True)

    write_token_counts(folder_name_generated)

    # q: how to prevent a warning to be printed?
    # a: use the following command to suppress the warning:
    # warnings.simplefilter("ignore", exceptions.SecurityWarning)


def write_low_code_scripts_to_file(folder_name, low_code_folder_name, low_code_scripts):
    with open(folder_name + '/low-code-scripts.js', 'w') as f:
        for low_code_script in low_code_scripts:
            # separate the lowCodeScripts by a new line and "---------------------------------------------------"
            f.write(low_code_script.code + "\n")
            f.write("\n")
            f.write("//------------------------------------------------------------------------------------------------------\n")
            f.write("\n")

    # write the low_code_scripts to a json file
    with open(folder_name + '/low-code-scripts-pretty.json', 'w') as f:
        f.write(json.dumps([ob.__dict__ for ob in low_code_scripts], indent=4))

    # iterate over all low_code_scripts
    for low_code_script in low_code_scripts:
        # write the code of the low_code_script to a file
        # generate a file name which consists of the count filled with leading zeros
        code_file_name = str(low_code_script.counter).zfill(4) + '.js'
        write_to_file(low_code_folder_name, code_file_name, low_code_script.code)

        json_file_name = str(low_code_script.counter).zfill(4) + '.json'
        # write the low_code_script to a json file
        # q: how to handle TypeError: Object of type LowCodeScript is not JSON serializable
        # a: use the json.dumps function with the argument default=lambda o: o.__dict__
        with open(low_code_folder_name + '/' + json_file_name, 'w') as f:
            f.write(json.dumps(low_code_script, default=lambda o: o.__dict__, indent=4))


