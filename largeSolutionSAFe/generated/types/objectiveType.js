let objectiveType = workspace.assertType("cf.cplace.solution.safe.objective");
objectiveType.setLocalizedNames({"de": "Zielsetzung", "en": "Objective"});

let objectivetitleAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.objectivetitle");
objectivetitleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
objectivetitleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let timeboxAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.timebox");
timeboxAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
timeboxAttribute.setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});
timeboxAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let sAFeLevelAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.SAFeLevel");
sAFeLevelAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
sAFeLevelAttribute.setLocalizedNames({"de": "SAFe Level", "en": "SAFe Level"});

let referenceAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference");
referenceAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
referenceAttribute.setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});
referenceAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let businessValueAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.businessValue");
businessValueAttribute.setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
businessValueAttribute.setLocalizedNames({"de": "Planned Business Value", "en": "Planned Business Value"});

let actualValueAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.actualValue");
actualValueAttribute.setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
actualValueAttribute.setLocalizedNames({"de": "Actual Business Value", "en": "Actual Business Value"});

let commitmentAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.commitment");
commitmentAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
commitmentAttribute.setLocalizedNames({"de": "Commitment", "en": "Commitment"});

let statementAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.statement");
statementAttribute.setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE);
statementAttribute.setLocalizedNames({"de": "Statement", "en": "Statement"});