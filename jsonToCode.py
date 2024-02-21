import re

def convertToSnakeUpperCase(input):
    # convert from camel case to snake case with a regular expression
    return re.sub('([A-Z])', r'_\1', input).upper()


def getConstantName(simple_type_name_SnakeCase, simple_attr_name):
    return f"ATTR_{simple_type_name_SnakeCase}_{convertToSnakeUpperCase(simple_attr_name)}"


def generate_copilot_examples(data):
    snippet = f"function accessBuiltInPageAttributes(page) {{\n"
    snippet += "    const absoluteUrl = page.getBuiltinFeatureValue(\"absoluteUrl\");\n"
    snippet += f"    const comments = page.getBuiltinFeatureValue(\"comments\");\n"
    snippet += f"    const commentsForVersioning = page.getBuiltinFeatureValue(\"commentsForVersioning\");\n"
    snippet += f"    const content = page.getBuiltinFeatureValue(\"content\");\n"
    snippet += f"    const creator = page.getBuiltinFeatureValue(\"creator\");\n"
    snippet += f"    const created = page.getBuiltinFeatureValue(\"created\");\n"
    snippet += f"    const customType = page.getBuiltinFeatureValue(\"customType\");\n"
    snippet += f"    const documents = page.getBuiltinFeatureValue(\"documents\");\n"
    snippet += f"    const id = page.getBuiltinFeatureValue(\"id\");\n"
    snippet += f"    const localizedName = page.getBuiltinFeatureValue(\"localizedName\");\n"
    snippet += f"    const name = page.getBuiltinFeatureValue(\"name\");\n"
    snippet += f"    const orderIndex = page.getBuiltinFeatureValue(\"orderIndex\");\n"
    snippet += f"    const readers = page.getBuiltinFeatureValue(\"readers\");\n"
    snippet += f"    const readersAreDefault = page.getBuiltinFeatureValue(\"readersAreDefault\");\n"
    snippet += f"    const space = page.getBuiltinFeatureValue(\"space\");\n"
    snippet += f"    const writersAreDefault = page.getBuiltinFeatureValue(\"writersAreDefault\");\n"
    snippet += f"}}\n"
    snippet += f"\n"


    types = data['export']['workspace']['types']
    # print("type of types: " + str(type(types)))

    for eachType in types:

        fully_qualified_type_name = eachType['name']
        simple_type_name = fully_qualified_type_name.split(".")[-1]
        print("type_name: " + simple_type_name)

        # convert from camel case to snake case
        # q: how to convert from camel case to snake case?
        # a: use regular expressions
        simple_type_name_SnakeCase = convertToSnakeUpperCase(simple_type_name)
        print("type_name_snake_case: " + simple_type_name_SnakeCase)

        # convert first letter to uppercase
        simple_type_name_firstLetterCapital = simple_type_name[0].upper() + simple_type_name[1:]
        function_name = "readFrom" + simple_type_name_firstLetterCapital
        attributes = eachType['attributeDefinitions']

        # Start building the function snippet
        snippet += f"function {function_name}({simple_type_name}) {{\n"
        for attr in attributes:
            attr_name = attr['name']
            simple_attr_name = attr_name.split(".")[-1]
            constant_name = getConstantName(simple_type_name_SnakeCase, simple_attr_name)
            snippet += f"    const {attr_name.split('.')[-1]} = {simple_type_name}.get({constant_name});\n"
        snippet += "}\n"
        snippet += "\n"

        snippet += f"const TYPE_{simple_type_name_SnakeCase} = '{fully_qualified_type_name}';\n"
        for attr in attributes:
            attr_name = attr['name']
            simple_attr_name = attr_name.split(".")[-1]
            constant_name = getConstantName(simple_type_name_SnakeCase, simple_attr_name)
            snippet += f"const {constant_name} = '{attr_name}';\n"
        snippet += "\n"

    return snippet












# This function is designed to iterate over each type in the given data model,
# construct a function snippet for each, and then gather these snippets into a list.
# Below is an example output for the "cf.cplace.solution.okr.cycle" type:

"""
function examples_cycle(order) {
    const year = order.get('cf.cplace.solution.okr.year');
    const quarter = order.get('cf.cplace.solution.okr.quarter');
    const status = order.get('cf.cplace.solution.okr.status');
    const cyclesDashboard = order.get('cf.cplace.solution.okr.cyclesDashboard');
    const start = order.get('cf.cplace.solution.okr.start');
    const end = order.get('cf.cplace.solution.okr.end');
    const statusForNameGenerationPattern = order.get('cf.cplace.solution.okr.statusForNameGenerationPattern');
}
"""
