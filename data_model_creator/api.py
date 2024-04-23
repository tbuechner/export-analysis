import json

from pydantic.json import pydantic_encoder
from langchain_openai import AzureChatOpenAI

from agent import create_data_model_agent
from data_model_creator.tools.models import TypeDefinitions


def invoke(input: str):
    type_definitions: TypeDefinitions = {}

    llm = AzureChatOpenAI(
        temperature=0.0, model="gpt-35-turbo", api_version="2024-02-01"
    )
    # llm.client = Wrapper(llm.client)

    agent_executor = create_data_model_agent(llm, type_definitions, verbose=True)

    history = []

    prompt = f"""{input}.
    The current JSON representation of the data model is: {json.dumps(type_definitions, default=pydantic_encoder)}"""

    result = agent_executor.invoke(
        {
            "input": prompt,
            "history": history,
        },
    )

    print("type_definitions: " + json.dumps(type_definitions, default=pydantic_encoder))
    print("output: " + result["output"])
