import json
from typing import Any, Dict, Sequence

from pydantic.json import pydantic_encoder
from langchain_core.tools import StructuredTool
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import BaseTool

from data_model_creator.models import TypeDefinitions


class AddDataInput(BaseModel):
    data_model_id: str = Field(
        description="Internal Identifier of the type, must be unique. Example: cf.cplace.userStory"
    )
    values: Dict[str, Any] = Field(description="Data values to be added to the type")


def get_data_tools(type_definitions: TypeDefinitions) -> Sequence[BaseTool]:

    def add_data_point(data_model_id: str, values: Dict[str, Any]) -> dict:
        """Add data to a data model."""
        data_model = type_definitions[data_model_id]

        data_model.data.append(values)
        return "Inserted data: " + json.dumps(values, default=pydantic_encoder)

    add_data_point_tool = StructuredTool.from_function(
        func=add_data_point,
        args_schema=AddDataInput,
        handle_tool_error=True,
    )
    return [add_data_point_tool]
