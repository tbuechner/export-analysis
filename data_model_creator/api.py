import json
import os
from pathlib import Path
from typing import List, Optional, Union

from dotenv import load_dotenv
from pydantic import BaseModel, parse_obj_as
from pydantic.json import pydantic_encoder
from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage
from langchain_openai import AzureChatOpenAI

from agent import create_data_model_agent
from models import TypeDefinitions



class Input(BaseModel):
    data_models: Optional[dict] = {}
    history: Optional[List[Union[HumanMessage, AIMessage, FunctionMessage]]]
    input: str


class Wrapper:
    def __init__(self, wrapped_class):
        self.wrapped_class = wrapped_class

    def __getattr__(self, attr):
        original_func = getattr(self.wrapped_class, attr)

        def wrapper(*args, **kwargs):
            print(f"Calling function: {attr}")
            print(f"Arguments: {args}, {kwargs}")
            result = original_func(*args, **kwargs)
            print(f"Response: {result}")
            return result

        return wrapper


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
