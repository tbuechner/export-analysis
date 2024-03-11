import os
import sys

from tokenizer import count_tokens_in_file


# concatenate the contents of all the files in the directory group into a single file named group-all.txt
def concatenate(folder_name):
    # get the list of files in the directory group
    output_file_name = folder_name + '.txt'

    concatenate_files_in_folder(folder_name, output_file_name)

    print('tokens of ' + output_file_name + ': ' + str(count_tokens_in_file(output_file_name)))


def concatenate_files_in_folder(folder_name, output_file_name):
    print('concatenating files in directory: ' + folder_name)
    files = os.listdir(folder_name)
    # order files alphabetically
    files.sort()
    # open the file group-all.txt in write mode
    with open(output_file_name, 'w') as outfile:
        # for each file in the directory group
        for file in files:
            # file might be a directory
            if os.path.isdir(folder_name + '/' + file):
                concatenate_files_in_folder(folder_name + '/' + file, output_file_name)
            else:
                concatenate_file(file, folder_name, outfile)

# q: What best practices do exist for method names in Python?
# a: https://stackoverflow.com/questions/159720/what-are-some-best-practices-for-method-names


def concatenate_file(file, folder_name, outfile):
    print('concatenating file: ' + folder_name + '/' + file)
    # open the file in read mode
    with open(folder_name + '/' + file, 'r') as infile:
        # read the contents of the file
        contents = infile.read()

        # insert a line break
        outfile.write('\n')

        # insert a comment which contains the name of the file
        outfile.write('######### start - content of file "' + folder_name + '/' + file + '" #########\n')

        # write the contents of the file to group-all.txt
        outfile.write(contents)

        outfile.write('\n')
        outfile.write('######### end - content of file "' + folder_name + '/' + file + '" #########\n')
        outfile.write('\n')


# call the concatenate function with the directory group as the argument

# concatenate('group-all')
concatenate('group-top-level')
# concatenate('group-user-matrix')
