import json
from pydantic.json import pydantic_encoder
from enum import Enum
from typing import List, Optional, Sequence

from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import BaseTool, StructuredTool, ToolException

from data_model_creator.models import (
    Attribute,
    AttributeType,
    AttributeTypeValues,
    Config,
    Enumeration,
    Multiplicity,
    MultiplicityValues,
    TypeDefinitions,
)


class AddAttributeInput(BaseModel):
    type_id: str = Field(
        description="ID of the type, must be unique. Example: cf.cplace.risk"
    )
    attribute_name: str = Field(
        description="Human readable name of the attribute. Example: Risk Description"
    )
    attribute_id: str = Field(
        description="ID of the attribute, must be unique. Example: cf.cplace.title"
    )
    attribute_type: AttributeType = Field(description=f"Type of the attribute.")
    multiplicity: Multiplicity = Field(description="Multiplicity of the attribute")
    reference_to: Optional[str] = Field(
        description="Optional: ID of the type the attribute references",
        default=None,
    )
    enumeration: Optional[List[Enumeration]] = Field(
        description="Optional: Enumeration of the attribute. Only allowed for stringEnum and integerEnum attributes.",
        default=None,
    )


class EditAttributeInput(BaseModel):
    type_id: str = Field(description="ID of the type where the attribute is located")
    attribute_id: str = Field(
        description="ID of the existing attribute that should be changed"
    )
    new_attribute_id: Optional[str] = Field(
        description="Optional: New ID of the attribute, must be unique. Example: cf.cplace.title",
        default=None,
    )
    attribute_name: Optional[str] = Field(
        description="Optional: Human readable name of the attribute. Example: Risk Description",
        default=None,
    )
    attribute_type: Optional[AttributeType] = Field(
        description=f"Optional: Type of the attribute, must be one of: {', '.join(AttributeTypeValues)}",
        default=None,
    )
    multiplicity: Optional[Multiplicity] = Field(
        description="Optional: Multiplicity of the attribute", default=None
    )
    reference_to: Optional[str] = Field(
        description="Optional: ID of the type, must be unique. Example: cf.cplace.userStory",
        default=None,
    )
    enumeration: Optional[List[Enumeration]] = Field(
        description="Optional: Enumeration of the attribute. Only allowed for stringEnum and integerEnum attributes.",
        default=None,
    )


def get_attribute_tools(type_definitions: TypeDefinitions) -> Sequence[BaseTool]:

    def add_attribute(
        type_id: str,
        attribute_name: str,
        attribute_id: str,
        attribute_type: AttributeType,
        multiplicity: Multiplicity,
        enumeration: List[Enumeration] = None,
        reference_to: Optional[str] = None,
    ) -> str:
        """Add  a new attribute to a type."""

        if attribute_type not in AttributeTypeValues:
            raise ToolException(
                "An error occurred: Invalid attribute type. Must be one of: string, integer, reference"
            )
        if multiplicity not in MultiplicityValues:
            raise ToolException(
                f"An error occurred: Invalid multiplicity. Must be one of: {', '.join(MultiplicityValues)}"
            )
        if type_id not in type_definitions:
            raise ToolException(f"An error occurred: Type {type_id} does not exist.")
        if enumeration and attribute_type not in ["stringEnum", "integerEnum"]:
            raise ToolException(
                "An error occurred: Enumeration is only allowed for stringEnum and integerEnum attributes."
            )
        if reference_to and reference_to not in type_definitions:
            raise ToolException(
                f"An error occurred: Type {reference_to} does not exist."
            )

        data_model = type_definitions[type_id]

        attribute = Attribute(
            name=attribute_name,
            id=attribute_id,
            type=attribute_type,
            config=Config(
                multiplicity=multiplicity, reference_to=reference_to, enum=enumeration
            ),
        )

        if attribute_id in data_model.attributes:
            raise ToolException(
                f"An error occurred: Attribute with attribute_id '{attribute_id}' already exists: "
                + json.dumps(
                    data_model.attributes[attribute_id], default=pydantic_encoder
                )
            )

        data_model.attributes[attribute_id] = attribute
        return "Added attribute: " + json.dumps(attribute, default=pydantic_encoder)

    add_attribute_tool = StructuredTool.from_function(
        func=add_attribute,
        args_schema=AddAttributeInput,
        handle_tool_error=True,
        handle_validation_errors=True,
    )

    def modify_attribute(
        type_id: str,
        attribute_id: str,
        new_attribute_id: Optional[str] = None,
        attribute_name: Optional[str] = None,
        attribute_type: Optional[AttributeType] = None,
        multiplicity: Optional[Multiplicity] = None,
        reference_to: Optional[str] = None,
        enumeration: Optional[List[Enumeration]] = None,
    ) -> str:
        """Modify an existing attribute of a type."""
        try:
            if attribute_type and attribute_type not in AttributeTypeValues:
                raise ToolException(
                    "An error occurred: Invalid attribute type. Must be one of: string, integer, reference"
                )
            if multiplicity and multiplicity not in MultiplicityValues:
                raise ToolException(
                    f"An error occurred: Invalid multiplicity. Must be one of: {', '.join(MultiplicityValues)}"
                )
            if type_id not in type_definitions:
                raise ToolException(
                    f"An error occurred: Type {type_id} does not exist."
                )
            if enumeration and attribute_type not in ["stringEnum", "integerEnum"]:
                raise ToolException(
                    "An error occurred: Enumeration is only allowed for stringEnum and integerEnum attributes."
                )
            if reference_to and reference_to not in type_definitions:
                raise ToolException(
                    f"An error occurred: Referencing {reference_to} not possible. Type {reference_to} does not exist. The following types are available:"
                    + ", ".join('"' + key + '"' for key in type_definitions.keys())
                )
            data_model = type_definitions[type_id]

            attribute = data_model.attributes[attribute_id]

            if attribute_type:
                if attribute.type == "reference" and attribute_type != "reference":
                    attribute.config.reference_to = None
                attribute.type = attribute_type
            if reference_to:
                attribute.type = "reference"
                attribute.config.reference_to = reference_to
            if attribute_name:
                attribute.name = attribute_name
            if multiplicity:
                attribute.config.multiplicity = multiplicity
            if enumeration:
                attribute.config.enum = enumeration

            if new_attribute_id:
                attribute.id = new_attribute_id
                data_model.attributes[new_attribute_id] = data_model.attributes.pop(
                    attribute_id
                )

            return "Modified attribute: " + json.dumps(
                attribute, default=pydantic_encoder
            )
        except KeyError:
            raise ToolException(
                f"An error occurred: Attribute with attribute_id '{attribute_id}' does not exist. You likely specified a wrong attribute_id. The following attribute ids are available: "
                + ", ".join('"' + key + '"' for key in data_model.attributes.keys())
            )

    modify_attribute_tool = StructuredTool.from_function(
        func=modify_attribute,
        args_schema=EditAttributeInput,
        handle_tool_error=True,
        handle_validation_errors=True,
    )

    class DeleteAttributeInput(BaseModel):
        type_id: str = Field(description="ID of the data type")
        attribute_id: str = Field(description="ID of the attribute")

    def delete_attribute(
        type_id: dict,
        attribute_id: str,
    ) -> dict:
        """Delete an existing attribute of a type."""
        if type_id not in type_definitions:
            raise ToolException(
                f"An error occurred: Type {type_id} does not exist. The following types are available:"
                + ", ".join('"' + key + '"' for key in type_definitions.keys())
            )
        data_model = type_definitions[type_id]

        if attribute_id not in data_model.attributes:
            raise ToolException(
                f"An error occurred: Attribute with attribute_id '{attribute_id}' does not exist. You likely specified a wrong attribute_id. The following attribute ids are available: "
                + ", ".join('"' + key + '"' for key in data_model.attributes.keys())
            )
        del data_model.attributes[attribute_id]
        return "Deleted attribute: " + attribute_id

    delete_attribute_tool = StructuredTool.from_function(
        func=delete_attribute,
        args_schema=DeleteAttributeInput,
        handle_tool_error=True,
        handle_validation_errors=True,
    )

    return [add_attribute_tool, modify_attribute_tool, delete_attribute_tool]
