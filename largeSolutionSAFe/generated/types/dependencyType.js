let dependencyType = workspace.assertType("cf.cplace.solution.safe.dependency");
dependencyType.setLocalizedNames({"de": "Abh\u00e4ngigkeit", "en": "Dependency"});

let titleAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.title").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let successorAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.successor").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "A", "en": "A"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let typeAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.type").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Typ", "en": "Type"});

let predecessorAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.predecessor").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "B", "en": "B"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let statusAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.status").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Status", "en": "Status"});

let descriptionAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.description").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let plannedStartAAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.plannedStartA").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Geplanter Start A", "en": "Planned Start A"});.setDerivableReferencingAttributeName("cf.cplace.solution.safe.successor").setDerivableReferencedAttributeName("cf.cplace.solution.safe.plannedStart");

let plannedEndBAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.plannedEndB").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Geplantes Ende B", "en": "Planned End B"});.setDerivableReferencingAttributeName("cf.cplace.solution.safe.predecessor").setDerivableReferencedAttributeName("cf.cplace.solution.safe.plannedEnd");