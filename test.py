import xml.etree.ElementTree as ET
from xml.dom import minidom

def reformat_xml(xml_string, indentation=2):
    # Parse the XML string into an ElementTree object
    root = ET.fromstring(xml_string)

    # Convert the ElementTree object back into a string with pretty print formatting
    rough_string = ET.tostring(root, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    pretty_xml = reparsed.toprettyxml(indent=" " * indentation)

    # Split the result into lines and filter out lines that contain only whitespace
    lines = pretty_xml.splitlines()
    non_empty_lines = [line for line in lines if line.strip()]

    # Join the non-empty lines back into a single string
    return '\n'.join(non_empty_lines)

# Your XML string
xml_string = """
<root>
<child>
<subchild>value</subchild>
</child>
</root>
"""

# Reformat the XML
formatted_xml = reformat_xml(xml_string)
print(formatted_xml)
