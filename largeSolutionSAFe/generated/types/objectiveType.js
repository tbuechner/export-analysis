let objectiveType = workspace.assertType("cf.cplace.solution.safe.objective");
objectiveType.setLocalizedNames({"de": "Zielsetzung", "en": "Objective"});

let objectivetitleAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.objectivetitle").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let timeboxAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.timebox").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let sAFeLevelAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.SAFeLevel").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "SAFe Level", "en": "SAFe Level"});

let referenceAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let businessValueAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.businessValue").setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Planned Business Value", "en": "Planned Business Value"});

let actualValueAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.actualValue").setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Actual Business Value", "en": "Actual Business Value"});

let commitmentAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.commitment").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Commitment", "en": "Commitment"});

let statementAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.statement").setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Statement", "en": "Statement"});