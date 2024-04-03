import xml.etree.ElementTree as ET

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

def reformat_xml(xml_string, indentation="  "):
    """
    Parse an XML string and return a pretty-printed version of it.

    Parameters:
    - xml_string: The XML string to be pretty-printed.
    - indentation: The string used for indentation.
    """
    # Parse the XML string into an Element
    root = ET.fromstring(xml_string)

    # Pretty print the XML from the root element
    pretty_print_xml(root, 0, indentation)

    # Convert the Element back into a string
    return ET.tostring(root, encoding='unicode')

# Your XML string
xml_string = """<root><child><subchild>value</subchild></child></root>"""

# Reformat the XML
formatted_xml = reformat_xml(xml_string)
print(formatted_xml)
