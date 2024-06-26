import json

from dotenv import load_dotenv
from openai import OpenAI
import os
import requests
from openai.lib.azure import AzureOpenAI

def provide_user_specific_recommendations():

    with open("user_prompt.txt", "r") as file:
        user_prompt = file.read()

    with open("system_prompt.txt", "r") as file:
        system_prompt = file.read()

    with open("json-schema.json", "r") as file:
        json_schema = file.read()

    parameters = json.loads(json_schema)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt}
        ],
        temperature=0,
        tools=[
            {
                "type": "function",
                "function" :     {
                    'name': 'extract_student_info',
                    'description': 'Get the student information from the body of the input text',
                    'parameters': parameters
                }
            }
        ],
    )

    # convert response to a string
    response_str = str(response)
    print("Response:", response_str)

    print(response.choices[0].message.tool_calls)


load_dotenv()

api_key = os.environ.get("AZURE_OPENAI_API_KEY", "<your OpenAI API key if not set as env var>")

azure_openai_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "https://api.openai.com")

print("API Key:", api_key)

client = AzureOpenAI(
    api_version="2024-02-01",
    azure_endpoint = azure_openai_endpoint,
    azure_deployment = "gpt-35-turbo",
    api_key=api_key)

output = provide_user_specific_recommendations()
print(output)
