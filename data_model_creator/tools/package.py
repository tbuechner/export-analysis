from typing import Sequence

from langchain.tools.base import StructuredTool
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_core.tools import BaseTool

# Define the JSON schema for the tool parameters
parameter_schema = {
    "type": "object",
    "properties": {
        "search_query": {
            "type": "string",
            "description": "The search query to use"
        },
        "max_results": {
            "type": "integer",
            "description": "The maximum number of results to return"
        }
    },
    "required": ["search_query"]
}

# Define the response schema for the tool
response_schema = ResponseSchema(
    name="search_results",
    description="The search results",
    schema={
        "type": "object",
        "properties": {
            "results": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "url": {"type": "string"}
                    }
                }
            }
        }
    }
)

# Define the tool using the StructuredTool class
def search_tool(params: dict) -> dict:
    """Perform a search and return the results."""
    search_query = params["search_query"]
    max_results = params.get("max_results", 10)
    # Implement the search logic here and return the results
    return {
        "results": [
            {"title": "Result 1", "url": "https://example.com/result1"},
            {"title": "Result 2", "url": "https://example.com/result2"}
        ]
    }

def get_search_tools() -> Sequence[BaseTool]:
    return [
        StructuredTool.from_function(
            search_tool,
            name="search",
            description="Perform a search and return the results",
            args_schema=parameter_schema,
            return_schema=response_schema
        )
    ]