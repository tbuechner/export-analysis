import json

from langchain_core.prompts import (
    ChatPromptTemplate,
)
from langchain.prompts import MessagesPlaceholder, HumanMessagePromptTemplate
from langchain_core.messages import SystemMessage
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.language_models import LanguageModelLike
from langchain_openai import AzureChatOpenAI
from pydantic.json import pydantic_encoder

from data_model_creator.tools.models import TypeDefinitions
from data_model_creator.tools.package import get_search_tools
from tools.attribute import get_attribute_tools
from tools.type import get_type_tools


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


def create_data_model_agent(
    llm: LanguageModelLike,
    type_definitions: TypeDefinitions,
    verbose: bool = False,
):
    """Create an agent for data model creation and modification."""

    messages = [
        SystemMessage(
            content=f"""You are a data model creation tool. You can create, modify, and view data models. 
            A data model consists of a type (similar to a table in a SQL database) and it's attributes. 
            By default each type has a 'Name' attribute which is not explicitly listed in the data model. Just assume it is there. 
            You can get the available types using the 'get_type_list' tool.
            Before modifying or adding an attribute you MUST inspect the type using the 'get_attributes_of_type' tool."""
        ),
        MessagesPlaceholder(variable_name="history"),
        HumanMessagePromptTemplate.from_template("{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
    prompt = ChatPromptTemplate.from_messages(messages)

    tools = []
    tools.extend(get_type_tools(type_definitions))
    tools.extend(get_attribute_tools(type_definitions))
    # tools.extend(get_search_tools())

    agent = create_openai_tools_agent(llm, tools, prompt)
    # Create an agent executor by passing in the agent and tools
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=verbose,
        handle_parsing_errors=True,
    )

    return agent_executor
