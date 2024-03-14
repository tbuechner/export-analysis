let taskType = workspace.assertType("cf.cplace.solution.okr.task");
taskType.setLocalizedNames({"de": "Aufgabe", "en": "Task"});

let titleAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.title").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let responsibleAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.responsible").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Verantwortliche(r)", "en": "Responsible"});.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let descriptionAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.description").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let statusAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.status").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Status", "en": "Status"});

let dueDateAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.dueDate").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "F\u00e4lligkeitsdatum", "en": "Due Date"});

let keyResultAttribute = taskType.assertAttribute("cf.cplace.solution.okr.keyResult").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Key Result", "en": "Key Result"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let escalationLevelAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.escalationLevel").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Eskalationslevel", "en": "Escalation Level"});