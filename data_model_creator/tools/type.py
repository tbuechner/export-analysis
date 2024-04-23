import json
from typing import Dict, List, Optional, Sequence

from langchain_core.tools import StructuredTool, ToolException
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import BaseTool
from pydantic.json import pydantic_encoder

from data_model_creator.models import Type, TypeDefinitions


class CreateDataModelInput(BaseModel):
    name: str = Field(
        description="Human Readable Name of the data model type. Example: User Story"
    )
    type_id: str = Field(
        description="ID of the type, must be unique. Example: cf.cplace.userStory"
    )


class ModifyTypeInput(BaseModel):
    type_id: str = Field(description="Current ID of the data type.")
    new_type_id: Optional[str] = Field(
        description="New ID of the type, must be unique. Example: cf.cplace.userStory. Optional.",
        default=None,
    )
    new_name: Optional[str] = Field(
        description="New Human Readable Name of the type. Example: Risk Description",
        default=None,
    )


def get_type_tools(type_definitions: TypeDefinitions) -> Sequence[BaseTool]:

    def create_type(name: str, type_id: str) -> str:
        """Create a single data model type with the given name and internal."""
        type = Type(type="type", name=name, id=type_id)
        if type_id in type_definitions:
            raise ToolException("An error occurred: Type already exists")

        type_definitions[type_id] = type
        return "Created: " + json.dumps(type, default=pydantic_encoder)

    create_type_tool = StructuredTool.from_function(
        func=create_type,
        args_schema=CreateDataModelInput,
        handle_tool_error=True,
    )

    def modify_type(
        type_id: str,
        new_type_id: Optional[str] = None,
        new_name: Optional[str] = None,
    ) -> str:
        """Modify a single data model type. You can change the internal or human readable name of the type."""
        try:
            response = ""
            data_model = type_definitions[type_id]
            if new_type_id:
                data_model.id = new_type_id
                type_definitions[new_type_id] = type_definitions.pop(type_id)
                # Change all references to the new identifier
                references = _get_references(type_definitions, type_id)
                for type_id, attributes in references.items():
                    for attribute in attributes:
                        type_definitions[type_id].attributes[
                            attribute
                        ].config.reference_to = new_type_id

            if new_name:
                data_model.name = new_name

            response += "Modified: " + json.dumps(data_model, default=pydantic_encoder)

            return response
        except KeyError:
            raise ToolException(
                f"An error occurred: Type '{type_id}' not found. You likely specified a wrong identifier.The following attributes are available: "
                + ", ".join('"' + key + '"' for key in type_definitions.keys())
            )

    modify_type_tool = StructuredTool.from_function(
        func=modify_type,
        args_schema=ModifyTypeInput,
        handle_tool_error=True,
    )

    def delete_type(internal_identifier: str) -> str:
        """Delete a single data model type."""
        try:
            if internal_identifier not in type_definitions:
                raise ToolException(
                    f'An error occurred: Type "{internal_identifier}" not found. You likely specified a wrong identifier. The following types are available: {", ".join(type_definitions.keys())}'
                )
            del type_definitions[internal_identifier]
            return f"Deleted type: {internal_identifier}"
        except KeyError:
            raise ToolException(
                f'An error occurred: Type "{internal_identifier}" not found'
            )

    delete_type_tool = StructuredTool.from_function(
        func=delete_type,
        handle_tool_error=True,
    )

    def get_type_list() -> dict:
        """Get a list of the identifiers of all existing types. Use when you don't know which types are available."""
        return ", ".join(type_definitions.keys())

    get_type_list_tool = StructuredTool.from_function(
        func=get_type_list,
        handle_tool_error=True,
    )

    def get_attributes_of_type(internal_identifier: str) -> dict:
        """List all the attributes of a type."""
        try:
            data_model = type_definitions[internal_identifier]
            return data_model
        except KeyError:
            raise ToolException(
                f'An error occurred: Type "{internal_identifier}" not found. You likely specified a wrong identifier. The following types are available: {", ".join(type_definitions.keys())}'
            )

    get_type_with_attribute_definitions_tool = StructuredTool.from_function(
        func=get_attributes_of_type,
        handle_tool_error=True,
    )

    def get_references(internal_identifier: str) -> str:
        """Get a list of all attributes by their type that reference the given data model (internal_identifier).

        Args:
            internal_identifier (str): The ID of the data model type.

        Returns:
            str: The list of attributes by their type that reference the given data model.
        """
        references = _get_references(type_definitions, internal_identifier)
        if len(references.keys()) == 0:
            return f"No references found for '{internal_identifier}'"

        # Return the references by type in the following format: "<Type>:\n-<Attribute>\n-<Attribute>"
        return f"""Below you find a list of types whose attributes reference  '{internal_identifier}:'
        
        """ + "\n".join(
            [
                f"""Type {data_model}:
            {', '.join(attributes)}"""
                for data_model, attributes in references.items()
            ]
        )

    get_references_tool = StructuredTool.from_function(
        func=get_references,
        handle_tool_error=True,
    )
    return [
        get_type_list_tool,
        get_type_with_attribute_definitions_tool,
        create_type_tool,
        modify_type_tool,
        delete_type_tool,
        get_references_tool,
    ]


def _get_references(
    data_models: TypeDefinitions, internal_identifier: str
) -> Dict[str, List[str]]:
    """Get a list of all attributes by their type that reference the given data model (internal_identifier).

    Args:
        internal_identifier (str): The ID of the data model type.

    Returns:
        str: The list of attributes by their type that reference the given data model.
    """
    references: Dict[str, List[str]] = {}
    for data_model in data_models.values():
        for attribute in data_model.attributes.values():
            if (
                attribute.type == "reference"
                and attribute.config.reference_to == internal_identifier
            ):
                if data_model.id not in references:
                    references[data_model.id] = []
                references[data_model.id].append(attribute.id)
    return references
