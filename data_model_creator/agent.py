from langchain_core.prompts import (
    ChatPromptTemplate,
)
from langchain.prompts import MessagesPlaceholder, HumanMessagePromptTemplate
from langchain_core.messages import SystemMessage
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.language_models import LanguageModelLike

from data_model_creator.tools.models import TypeDefinitions
from tools.attribute import get_attribute_tools
from tools.type import get_type_tools


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

    agent = create_openai_tools_agent(llm, tools, prompt)
    # Create an agent executor by passing in the agent and tools
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=verbose,
        handle_parsing_errors=True,
    )

    return agent_executor
