def generate_code_snippets(data):
    snippets = []

    # print(type(data))

    # print(type(data['export']))
    # print(type(data['export']['workspace']))
    types = data['export']['workspace']['types']
    # print("type of types: " + str(type(types)))

    # iterate over all keys in the dictionary types
    # for eachType in types:
    #     print("eachType: " + eachType)
    #     print(type(eachType))

    # data is a dictionary, we know it has the key 'export'
    # access key 'export' and then access key 'workspace'
    # then access key 'types' to get the list of types
    # iterate over each type in the list
    # print("types: " + str(types))
    for eachType in types:

        fully_qualified_type_name = eachType['name']
        simple_type_name = fully_qualified_type_name.split(".")[-1]
        print("type_name: " + simple_type_name)
        # convert first letter to uppercase
        simple_type_name_firstLetterCapital = simple_type_name[0].upper() + simple_type_name[1:]
        function_name = "readFrom" + simple_type_name_firstLetterCapital
        attributes = eachType['attributeDefinitions']

        # Start building the function snippet
        snippet = f"function {function_name}({simple_type_name}) {{\n"
        for attr in attributes:
            attr_name = attr['name']
            snippet += f"    const {attr_name.split('.')[-1]} = {simple_type_name}.get('{attr_name}');\n"
        snippet += "}\n"
        snippet += "\n"


        snippets.append(snippet)

    return snippets












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
