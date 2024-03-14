import json
import re

def convertToSnakeUpperCase(input):
    # convert from camel case to snake case with a regular expression
    return re.sub('([A-Z])', r'_\1', input).upper()


def getConstantName(simple_type_name_SnakeCase, simple_attr_name):
    return f"ATTR_{simple_type_name_SnakeCase}_{convertToSnakeUpperCase(simple_attr_name)}"


def generate_copilot_examples(data):

    snippet = """function accessBuiltInPageAttributes(page) {
    const absoluteUrl = page.getBuiltinFeatureValue("absoluteUrl");
    const comments = page.getBuiltinFeatureValue("comments");
    const commentsForVersioning = page.getBuiltinFeatureValue("commentsForVersioning");
    const content = page.getBuiltinFeatureValue("content");
    const creator = page.getBuiltinFeatureValue("creator");
    const created = page.getBuiltinFeatureValue("created");
    const customType = page.getBuiltinFeatureValue("customType");
    const documents = page.getBuiltinFeatureValue("documents");
    const id = page.getBuiltinFeatureValue("id");
    const localizedName = page.getBuiltinFeatureValue("localizedName");
    const name = page.getBuiltinFeatureValue("name");
    const orderIndex = page.getBuiltinFeatureValue("orderIndex");
    const readers = page.getBuiltinFeatureValue("readers");
    const readersAreDefault = page.getBuiltinFeatureValue("readersAreDefault");
    const space = page.getBuiltinFeatureValue("space");
    const writersAreDefault = page.getBuiltinFeatureValue("writersAreDefault");
}

"""

    snippet += """function updatePage(page) {
    cplace.actions().updatePage(page, {
        customAttributes: {
            [ATTRIBUTE_NAME_1]: value1,
            [ATTRIBUTE_NAME_2]: value2
        },
    });
}

function createPage() {
    return cplace.actions().createPage({
        customType: TYPE_NAME,
        customAttributes: {
            [ATTRIBUTE_NAME_1]: value1,
            [ATTRIBUTE_NAME_2]: value2
        }
    }, {
        setGeneratedName: true
    });
}

"""

    types = data['export']['workspace']['types']
    # print("type of types: " + str(type(types)))

    for eachType in types:

        fully_qualified_type_name = eachType['name']
        simple_type_name = fully_qualified_type_name.split(".")[-1]
        # print("type_name: " + simple_type_name)

        # convert from camel case to snake case
        # q: how to convert from camel case to snake case?
        # a: use regular expressions
        simple_type_name_SnakeCase = convertToSnakeUpperCase(simple_type_name)
        # print("type_name_snake_case: " + simple_type_name_SnakeCase)

        # convert first letter to uppercase
        simple_type_name_firstLetterCapital = simple_type_name[0].upper() + simple_type_name[1:]
        function_name = "readFrom" + simple_type_name_firstLetterCapital
        attributes = eachType['attributeDefinitions']

        # q: is there a way to set a string variale with a multi-line string?
        #

        # Start building the function snippet
        snippet += f"function {function_name}({simple_type_name}) {{\n"
        for attr in attributes:
            attr_name = attr['name']
            simple_attr_name = attr_name.split(".")[-1]
            constant_name = getConstantName(simple_type_name_SnakeCase, simple_attr_name)
            snippet += f"    const {attr_name.split('.')[-1]} = {simple_type_name}.get({constant_name});\n"
        snippet += "}\n"
        snippet += "\n"

    # q: what is a f" string?
    # a: f-strings are a way to embed expressions inside string literals, using curly braces
        # q: how to escape "/" in a f-string?
        #

        snippet += f"// --- start: Constants for Type '{fully_qualified_type_name}' ---\n"
        snippet += f"const TYPE_{simple_type_name_SnakeCase} = '{fully_qualified_type_name}';\n"
        for attr in attributes:
            attr_name = attr['name']
            simple_attr_name = attr_name.split(".")[-1]
            constant_name = getConstantName(simple_type_name_SnakeCase, simple_attr_name)
            snippet += f"const {constant_name} = '{attr_name}';\n"
        snippet += f"// --- end: Constants for Type '{fully_qualified_type_name}' ---\n"
        snippet += "\n"

    return snippet


def convert_json_to_js(data, folder_name, one_file, use_chained_calls=False):
    js_code = ""
    for type_def in data["export"]["workspace"]["types"]:
        type_name = type_def["name"]
        localized_name_singular = type_def["localizedNameSingular"]
        type_name_variable_name = type_name.split(".")[-1] + "Type"
        # convert the first character to lower case
        type_name_variable_name = type_name_variable_name[0].lower() + type_name_variable_name[1:]
        js_code += f'let {type_name_variable_name} = workspace.assertType("{type_name}");\n'
        js_code += f'{type_name_variable_name}.setLocalizedNames({json.dumps(localized_name_singular)});\n\n'

        for attr_def in type_def["attributeDefinitions"]:
            attr_name = attr_def["name"]
            localized_name = attr_def["localizedName"]
            m = attr_def["multiplicity"]
            if m is not None:
                multiplicity = attr_def["multiplicity"].replace("exactlyOne", "EXACTLY_ONE").replace("maximalOne", "AT_MOST_ONE").replace("atLeastOne", "AT_LEAST_ONE")
            else:
                multiplicity = "ANY_NUMBER"
            type_constraint = attr_def["typeConstraint"]

            attr_name_variable_name = attr_name.split(".")[-1] + "Attribute"
            # convert the first character to lower case
            attr_name_variable_name = attr_name_variable_name[0].lower() + attr_name_variable_name[1:]

            if use_chained_calls:
                js_code += f'let {attr_name_variable_name} = {type_name_variable_name}.assertAttribute("{attr_name}");\n'
                js_code += f'{attr_name_variable_name}.setType(Type.{type_constraint.upper()})'
                js_code += f'.setMultiplicity(Multiplicity.{multiplicity});\n'
                js_code += f'{attr_name_variable_name}.setLocalizedNames({json.dumps(localized_name)});'
            else:
                js_code += f'let {attr_name_variable_name} = {type_name_variable_name}.assertAttribute("{attr_name}");\n'
                js_code += f'{attr_name_variable_name}.setType(Type.{type_constraint.upper()});\n'
                js_code += f'{attr_name_variable_name}.setMultiplicity(Multiplicity.{multiplicity});\n'
                js_code += f'{attr_name_variable_name}.setLocalizedNames({json.dumps(localized_name)});\n'

            if type_constraint == "Link":
                link_entity_kind = attr_def["linkEntityKind"]
                link_same_workspace = "true" if attr_def["linkSameWorkspace"].lower() == "true" else "false"
                link_is_hierarchy = "true" if attr_def["linkIsHierarchy"].lower() == "true" else "false"
                if use_chained_calls:
                    js_code += f'\n{attr_name_variable_name}.setEntityKind("{link_entity_kind}")'
                    js_code += f'.setReferenceSameWorkspace({link_same_workspace})'
                    js_code += f'.setReferenceIsHierarchy({link_is_hierarchy});'
                else:
                    js_code += f'{attr_name_variable_name}.setEntityKind("{link_entity_kind}");\n'
                    js_code += f'{attr_name_variable_name}.setReferenceSameWorkspace({link_same_workspace});\n'
                    js_code += f'{attr_name_variable_name}.setReferenceIsHierarchy({link_is_hierarchy});\n'

            if "derivable" in attr_def:
                derivable_config = attr_def["derivable"]
                referencing_attribute_name = derivable_config["referencingAttributeName"]
                referenced_attribute_name = derivable_config["referencedAttributeName"]
                if use_chained_calls:
                    js_code += f'\n{attr_name_variable_name}.setDerivableReferencingAttributeName("{referencing_attribute_name}")'
                    js_code += f'.setDerivableReferencedAttributeName("{referenced_attribute_name}");'
                else:
                    js_code += f'{attr_name_variable_name}.setDerivableReferencingAttributeName("{referencing_attribute_name}");\n'
                    js_code += f'{attr_name_variable_name}.setDerivableReferencedAttributeName("{referenced_attribute_name}");\n'

            if use_chained_calls:
                js_code += f'\n\n'
            else:
                js_code += f'\n'

        if not one_file:
            # Determine the filename for the type
            filename = f"{type_name_variable_name}.js"
            # Write the generated js to a file named after the type
            with open(folder_name + "/" + filename, 'w') as js_file:
                js_file.write(js_code.rstrip('\n'))
            js_code = ""
    if one_file:
        if use_chained_calls:
            with open(folder_name + "/types-chained.js", 'w') as js_file:
                js_file.write(js_code.rstrip('\n'))
        else:
            with open(folder_name + "/types.js", 'w') as js_file:
                js_file.write(js_code.rstrip('\n'))

def convert_json_to_js_per_type(data, folder_name, use_chained_calls=False):
    for type_def in data["export"]["workspace"]["types"]:
        type_name = type_def["name"]
        localized_name_singular = type_def["localizedNameSingular"]

        # Generate variable names
        type_name_variable_name = type_name.split(".")[-1] + "Type"
        type_name_variable_name = type_name_variable_name[0].lower() + type_name_variable_name[1:]  # Lowercase the first character

        # Start JavaScript code
        js_code = f'let {type_name_variable_name} = workspace.assertType("{type_name}");\n'
        js_code += f'{type_name_variable_name}.setLocalizedNames({json.dumps(localized_name_singular)});\n\n'

        for attr_def in type_def["attributeDefinitions"]:
            attr_name = attr_def["name"]
            localized_name = attr_def["localizedName"]
            m = attr_def["multiplicity"]
            multiplicity = "ANY_NUMBER" if m is None else m.replace("exactlyOne", "EXACTLY_ONE").replace("maximalOne", "AT_MOST_ONE").replace("atLeastOne", "AT_LEAST_ONE")
            type_constraint = attr_def["typeConstraint"]

            attr_name_variable_name = attr_name.split(".")[-1] + "Attribute"
            attr_name_variable_name = attr_name_variable_name[0].lower() + attr_name_variable_name[1:]  # Lowercase the first character

            chain_prefix = '' if use_chained_calls else '\n'
            setter = f'.setType(Type.{type_constraint.upper()}).setMultiplicity(Multiplicity.{multiplicity}).setLocalizedNames({json.dumps(localized_name)});'
            js_code += f'let {attr_name_variable_name} = {type_name_variable_name}.assertAttribute("{attr_name}"){chain_prefix}{setter}'

            if type_constraint == "Link":
                link_entity_kind = attr_def["linkEntityKind"]
                link_same_workspace = "true" if attr_def["linkSameWorkspace"].lower() == "true" else "false"
                link_is_hierarchy = "true" if attr_def["linkIsHierarchy"].lower() == "true" else "false"
                chain_prefix = '' if use_chained_calls else f'{attr_name_variable_name}'
                js_code += f'{chain_prefix}.setEntityKind("{link_entity_kind}").setReferenceSameWorkspace({link_same_workspace}).setReferenceIsHierarchy({link_is_hierarchy});'

            if "derivable" in attr_def:
                derivable_config = attr_def["derivable"]
                referencing_attribute_name = derivable_config["referencingAttributeName"]
                referenced_attribute_name = derivable_config["referencedAttributeName"]
                chain_prefix = '' if use_chained_calls else f'{attr_name_variable_name}'
                js_code += f'{chain_prefix}.setDerivableReferencingAttributeName("{referencing_attribute_name}").setDerivableReferencedAttributeName("{referenced_attribute_name}");'

            js_code += f'\n\n' if use_chained_calls else f'\n'

        # Determine the filename for the type
        filename = f"{type_name_variable_name}.js"
        # Write the generated js to a file named after the type
        with open(folder_name + "/" + filename, 'w') as js_file:
            js_file.write(js_code.rstrip('\n'))