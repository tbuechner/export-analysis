import os
import sys

from tokenizer import count_tokens_in_file


# concatenate the contents of all the files in the directory group into a single file named group-all.txt
def concatenate(folderName):
    print('concatenating files in directory: ' + folderName)

    # get the list of files in the directory group
    files = os.listdir(folderName)

    # order files alphabetically
    files.sort()

    # open the file group-all.txt in write mode
    with open(folderName + '-all.txt', 'w') as outfile:
        # for each file in the directory group
        for file in files:
            # file might be a directory
            if os.path.isdir(folderName + '/' + file):
                concatenate(folderName + '/' + file)
            else:
                # open the file in read mode
                with open(folderName + '/' + file, 'r') as infile:
                    # read the contents of the file
                    contents = infile.read()

                    # insert a line break
                    outfile.write('\n')

                    # insert a comment which contains the name of the file
                    outfile.write('######### start - content of file "' + folderName + '/' + file + '" #########\n')

                    # write the contents of the file to group-all.txt
                    outfile.write(contents)

                    outfile.write('\n')
                    outfile.write('######### end - content of file :' + file + ' #########\n')

# call the concatenate function with the directory group as the argument

concatenate('group')

print("tokens: " + str(count_tokens_in_file("group-all.txt")))
