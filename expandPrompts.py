import os
from jinja2 import Template


def expand_prompts():

    # delete folder folder_name_generated if it exists with all its content
    if os.path.exists('prompts-templates'):
        os.system("rm -r " + 'prompts-templates')


    # traverse all files in the directory 'prompts-templates'
    for root, dirs, files in os.walk('prompts-templates'):
        for file in files:
            # if the file is a .txt file
            if file.endswith('.txt'):
                # render the template
                template_file = os.path.join(root, file)
                rendered_string = render_template(template_file)
                # write the rendered string to a new file
                with open(f'prompts-generated/{file}', "w") as new_file:
                    new_file.write(rendered_string)


def render_template(template_file):
    # Read the template file
    with open(template_file, "r") as file:
        template_string = file.read()

    # Create a template object
    template = Template(template_string)

    # Render the template with the file contents
    rendered_string = template.render(
        load_file=load_file
    )

    return rendered_string


def load_file(file_path):
    # Read the contents of the file
    with open(file_path, "r") as file:
        return file.read()