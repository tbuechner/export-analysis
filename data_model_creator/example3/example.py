import json

from dotenv import load_dotenv
from openai import OpenAI
import os
import requests
from openai.lib.azure import AzureOpenAI

def call_ai():

    load_dotenv()
    api_key = os.environ.get("AZURE_OPENAI_API_KEY", "<your OpenAI API key if not set as env var>")
    # print("API Key:", api_key)
    azure_openai_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "https://api.openai.com")
    # print("Azure OpenAI Endpoint:", azure_openai_endpoint)
    client = AzureOpenAI(
        api_version="2024-02-01",
        azure_endpoint = azure_openai_endpoint,
        azure_deployment = "gpt-35-turbo",
        api_key=api_key)

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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0,
        tools=[{
                "type": "function",
                "function" :     {
                    'name': 'generate_data_model',
                    'description': 'Generate a data model from the body of the input text',
                    'parameters': parameters
                }}],
    )

    response_str = str(response)
    print("Full response:", response_str)

    for choice in response.choices:
        message = choice.message
        if message.tool_calls:
            for tool_call in message.tool_calls:
                print("Tool called with argument:")
                print(tool_call.function.arguments)

        if message.content:
            print("Answer:")
            print(message.content)


call_ai()
