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
