import os
import re
import sys

from tokenizer import count_tokens_in_file


# concatenate the contents of all the files in the directory group into a single file named group-all.txt
def concatenate(folder_name):
    # get the list of files in the directory group
    output_file_name = folder_name + '.txt'

    # print('concatenating files in directory: ' + folder_name)

    concatenated = concatenate_files_in_folder(folder_name)

    concatenated = replace_multiline_whitespace(concatenated)


# write the concatenated contents to a file
    with open(output_file_name, 'w') as outfile:
        outfile.write(concatenated)

    print('tokens of ' + output_file_name + ': ' + str(count_tokens_in_file(output_file_name)))


def concatenate_files_in_folder(folder_name):
    # print('concatenating files in directory: ' + folder_name)
    files = os.listdir(folder_name)
    # order files alphabetically
    files.sort()

    result = ""

    # for each file in the directory group
    for file in files:
        if not file.startswith('.'):
            # file might be a directory
            if os.path.isdir(folder_name + '/' + file):
                # ignore folders starting with a dot
                result += concatenate_files_in_folder(folder_name + '/' + file)
            else:
                result += concatenate_file(file, folder_name)

    return result


def concatenate_file(file, folder_name):
    # print('concatenating file: ' + folder_name + '/' + file)
    # open the file in read mode
    with open(folder_name + '/' + file, 'r') as infile:
        result = ""

        result += '\n'

        # insert a comment which contains the name of the file
        result += '######### start - content of file "' + folder_name + '/' + file + '" #########\n'

        # read the contents of the file
        contents = infile.read()

        contents = filter_code(contents, file)

        result += contents

        result += '\n'
        result += '######### end - content of file "' + folder_name + '/' + file + '" #########\n'
        result += '\n'
    return result


def remove_copyright_comment(content):
    copyright_comment_pattern = r"/\*\n \* Copyright \d{4}, collaboration Factory AG. All rights reserved.\n \*/"
    return re.sub(copyright_comment_pattern, '', content)

def replace_multiline_whitespace(content):
    return re.sub(r'(\n[\s]*\n)+', '\n\n', content)

def filter_code(contents, file):

    # if file ends with .java filter all lines which start with "import "
    if file.endswith('.java'):
        contents = remove_copyright_comment(contents)

        lines = contents.split('\n')
        contents = ''
        for line in lines:
            if not line.startswith('import '):
                contents += line + '\n'
    if file.endswith('.ts'):
        lines = contents.split('\n')
        contents = ''
        for line in lines:
            if line.strip().startswith('import '):
                skip = True
            if skip and line.strip().endswith(';'):
                skip = False
                continue
            if not skip:
                contents += line + '\n'
    return contents


concatenate('group-all')
concatenate('group-top-level')
concatenate('group-user-matrix')
concatenate('group-user-matrix-frontend')
concatenate('old-send-link')
concatenate('new-send-link')
concatenate('old-edit-ldap-identifier')
