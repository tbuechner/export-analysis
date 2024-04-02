let taskType = workspace.assertType("cf.cplace.solution.okr.task");
taskType.setLocalizedNames({"de": "Aufgabe", "en": "Task"});

let titleAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let responsibleAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.responsible");
responsibleAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
responsibleAttribute.setLocalizedNames({"de": "Verantwortliche(r)", "en": "Responsible"});
responsibleAttribute.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let descriptionAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.description");
descriptionAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let statusAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.status");
statusAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
statusAttribute.setLocalizedNames({"de": "Status", "en": "Status"});

let dueDateAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.dueDate");
dueDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
dueDateAttribute.setLocalizedNames({"de": "F\u00e4lligkeitsdatum", "en": "Due Date"});

let keyResultAttribute = taskType.assertAttribute("cf.cplace.solution.okr.keyResult");
keyResultAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
keyResultAttribute.setLocalizedNames({"de": "Key Result", "en": "Key Result"});
keyResultAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let escalationLevelAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.escalationLevel");
escalationLevelAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
escalationLevelAttribute.setLocalizedNames({"de": "Eskalationslevel", "en": "Escalation Level"});