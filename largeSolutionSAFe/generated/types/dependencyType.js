let dependencyType = workspace.assertType("cf.cplace.solution.safe.dependency");
dependencyType.setLocalizedNames({"de": "Abh\u00e4ngigkeit", "en": "Dependency"});

let titleAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let successorAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.successor");
successorAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
successorAttribute.setLocalizedNames({"de": "A", "en": "A"});
successorAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let typeAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.type");
typeAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
typeAttribute.setLocalizedNames({"de": "Typ", "en": "Type"});

let predecessorAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessorAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
predecessorAttribute.setLocalizedNames({"de": "B", "en": "B"});
predecessorAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let statusAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.status");
statusAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
statusAttribute.setLocalizedNames({"de": "Status", "en": "Status"});

let descriptionAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.description");
descriptionAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let plannedStartAAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.plannedStartA");
plannedStartAAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedStartAAttribute.setLocalizedNames({"de": "Geplanter Start A", "en": "Planned Start A"});
plannedStartAAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.successor").setDerivableReferencedAttributeName("cf.cplace.solution.safe.plannedStart");

let plannedEndBAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.plannedEndB");
plannedEndBAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedEndBAttribute.setLocalizedNames({"de": "Geplantes Ende B", "en": "Planned End B"});
plannedEndBAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.predecessor").setDerivableReferencedAttributeName("cf.cplace.solution.safe.plannedEnd");