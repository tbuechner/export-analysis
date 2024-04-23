from pydantic import BaseModel
from typing import Any, Dict, Literal, Optional, List, TypeVar, Union

MultiplicityValues = ["anyNumber", "exactlyOne", "maximalOne", "atLeastOne"]

Multiplicity = TypeVar(
    "Multiplicity",
    bound=Literal["anyNumber", "exactlyOne", "maximalOne", "atLeastOne"],
)

AttributeTypeValues = [
    "string",
    "integer",
    "stringEnum",
    "integerEnum",
    "user",
    "reference",
]

AttributeType = TypeVar(
    "AttributeType",
    bound=Literal[
        "string", "integer", "stringEnum", "integerEnum", "user", "reference"
    ],
)


class Enumeration(BaseModel):
    value: Union[str, int]
    display_name: str


class Config(BaseModel):
    multiplicity: Multiplicity
    reference_to: Optional[str] = None
    enum: Optional[List[Enumeration]] = None


class Attribute(BaseModel):
    name: str
    id: str
    type: AttributeType
    config: Config


class Type(BaseModel):
    type: str
    name: str
    id: str
    attributes: Optional[dict[str, Attribute]] = {}
    data: Optional[List[Dict[str, Any]]] = []


TypeDefinitions = TypeVar("TypeDefinitions", bound=Dict[str, Type])
