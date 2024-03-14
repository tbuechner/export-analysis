let cycleType = workspace.assertType("cf.cplace.solution.okr.cycle");
cycleType.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

let yearAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.year");
yearAttribute.setType(Type._TEXT);
yearAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
yearAttribute.setLocalizedNames({"de": "Jahr", "en": "Year"});

let quarterAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.quarter");
quarterAttribute.setType(Type._TEXT);
quarterAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
quarterAttribute.setLocalizedNames({"de": "Quartal", "en": "Quarter"});

let statusAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.status");
statusAttribute.setType(Type._TEXT_ENUMERATION);
statusAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
statusAttribute.setLocalizedNames({"de": "Status", "en": "Status"});

let cyclesDashboardAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.cyclesDashboard");
cyclesDashboardAttribute.setType(Type._LINK);
cyclesDashboardAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
cyclesDashboardAttribute.setLocalizedNames({"de": "Zyklen Dashboard", "en": "Cycles Dashboard"});
cyclesDashboardAttribute.setEntityKind("page");
cyclesDashboardAttribute.setReferenceSameWorkspace(true);
cyclesDashboardAttribute.setReferenceIsHierarchy(true);

let startAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.start");
startAttribute.setType(Type._DATE);
startAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
startAttribute.setLocalizedNames({"de": "Start", "en": "Start"});

let endAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.end");
endAttribute.setType(Type._DATE);
endAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
endAttribute.setLocalizedNames({"de": "Ende", "en": "End"});

let statusForNameGenerationPatternAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.statusForNameGenerationPattern");
statusForNameGenerationPatternAttribute.setType(Type._TEXT);
statusForNameGenerationPatternAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
statusForNameGenerationPatternAttribute.setLocalizedNames({"de": "Status f\u00fcr die Namensgenerierung", "en": "Status for name generation pattern"});

let objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({"de": "Objective", "en": "Objective"});

let numberAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.number");
numberAttribute.setType(Type._NUMBER);
numberAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
numberAttribute.setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.title");
titleAttribute.setType(Type._TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let setAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type._LINK);
setAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});
setAttribute.setEntityKind("page");
setAttribute.setReferenceSameWorkspace(true);
setAttribute.setReferenceIsHierarchy(true);

let accomplishedAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished");
accomplishedAttribute.setType(Type._TEXT_ENUMERATION);
accomplishedAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
accomplishedAttribute.setLocalizedNames({"de": "Erreicht", "en": "Accomplished"});

let cycleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type._LINK);
cycleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});
cycleAttribute.setEntityKind("page");
cycleAttribute.setReferenceSameWorkspace(false);
cycleAttribute.setReferenceIsHierarchy(false);
cycleAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set");
cycleAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let descriptionAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.description");
descriptionAttribute.setType(Type._RICH_STRING);
descriptionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let keyResultType = workspace.assertType("cf.cplace.solution.okr.keyResult");
keyResultType.setLocalizedNames({"de": "Schl\u00fcsselergebnis", "en": "Key Result"});

let numberAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.number");
numberAttribute.setType(Type._NUMBER);
numberAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
numberAttribute.setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.title");
titleAttribute.setType(Type._TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let progressIndicatorAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.progressIndicator");
progressIndicatorAttribute.setType(Type._TEXT_ENUMERATION);
progressIndicatorAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
progressIndicatorAttribute.setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

let confidenceLevelAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.confidenceLevel");
confidenceLevelAttribute.setType(Type._TEXT_ENUMERATION);
confidenceLevelAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceLevelAttribute.setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

let gradingForecastAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.gradingForecast");
gradingForecastAttribute.setType(Type._TEXT_ENUMERATION);
gradingForecastAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
gradingForecastAttribute.setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

let smallSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.smallSupport");
smallSupportAttribute.setType(Type._LINK);
smallSupportAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
smallSupportAttribute.setLocalizedNames({"de": "Receive Small Support", "en": "Receive Small Support"});
smallSupportAttribute.setEntityKind("page");
smallSupportAttribute.setReferenceSameWorkspace(true);
smallSupportAttribute.setReferenceIsHierarchy(false);

let bigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.bigSupport");
bigSupportAttribute.setType(Type._LINK);
bigSupportAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
bigSupportAttribute.setLocalizedNames({"de": "Big Support", "en": "Big Support"});
bigSupportAttribute.setEntityKind("page");
bigSupportAttribute.setReferenceSameWorkspace(false);
bigSupportAttribute.setReferenceIsHierarchy(false);
bigSupportAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.giveBigSupport");
bigSupportAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.organizationalUnit");

let giveBigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.giveBigSupport");
giveBigSupportAttribute.setType(Type._LINK);
giveBigSupportAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
giveBigSupportAttribute.setLocalizedNames({"de": "Give Big Support", "en": "Give Big Support"});
giveBigSupportAttribute.setEntityKind("page");
giveBigSupportAttribute.setReferenceSameWorkspace(true);
giveBigSupportAttribute.setReferenceIsHierarchy(false);

let receiveBigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.receiveBigSupport");
receiveBigSupportAttribute.setType(Type._LINK);
receiveBigSupportAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
receiveBigSupportAttribute.setLocalizedNames({"de": "Receive Big Support", "en": "Receive Big Support"});
receiveBigSupportAttribute.setEntityKind("page");
receiveBigSupportAttribute.setReferenceSameWorkspace(true);
receiveBigSupportAttribute.setReferenceIsHierarchy(false);

let objectiveAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.objective");
objectiveAttribute.setType(Type._LINK);
objectiveAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
objectiveAttribute.setLocalizedNames({"de": "Objective", "en": "Objective"});
objectiveAttribute.setEntityKind("page");
objectiveAttribute.setReferenceSameWorkspace(true);
objectiveAttribute.setReferenceIsHierarchy(true);

let progressAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.progress");
progressAttribute.setType(Type._LINK);
progressAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
progressAttribute.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});
progressAttribute.setEntityKind("page");
progressAttribute.setReferenceSameWorkspace(true);
progressAttribute.setReferenceIsHierarchy(false);

let setAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type._LINK);
setAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});
setAttribute.setEntityKind("page");
setAttribute.setReferenceSameWorkspace(false);
setAttribute.setReferenceIsHierarchy(false);
setAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.objective");
setAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.set");

let cycleAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type._LINK);
cycleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});
cycleAttribute.setEntityKind("page");
cycleAttribute.setReferenceSameWorkspace(false);
cycleAttribute.setReferenceIsHierarchy(false);
cycleAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set");
cycleAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let organizationalUnitAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.organizationalUnit");
organizationalUnitAttribute.setType(Type._LINK);
organizationalUnitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
organizationalUnitAttribute.setLocalizedNames({"de": "Organsationseinheit", "en": "Organizational Unit"});
organizationalUnitAttribute.setEntityKind("page");
organizationalUnitAttribute.setReferenceSameWorkspace(false);
organizationalUnitAttribute.setReferenceIsHierarchy(false);
organizationalUnitAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set");
organizationalUnitAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.organizationalUnit");

let lastUpdateAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.lastUpdate");
lastUpdateAttribute.setType(Type._DATE);
lastUpdateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
lastUpdateAttribute.setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});
lastUpdateAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.progress");
lastUpdateAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.lastUpdate");

let progressType = workspace.assertType("cf.cplace.solution.okr.progress");
progressType.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});

let resultAttribute = progressType.assertAttribute("cf.cplace.solution.okr.result");
resultAttribute.setType(Type._TEXT);
resultAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
resultAttribute.setLocalizedNames({"de": "Ergebnise", "en": "Results"});

let problemAttribute = progressType.assertAttribute("cf.cplace.solution.okr.problem");
problemAttribute.setType(Type._TEXT);
problemAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
problemAttribute.setLocalizedNames({"de": "Probleme", "en": "Problems"});

let lessonsLearnedAttribute = progressType.assertAttribute("cf.cplace.solution.okr.lessonsLearned");
lessonsLearnedAttribute.setType(Type._TEXT);
lessonsLearnedAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
lessonsLearnedAttribute.setLocalizedNames({"de": "Learnings", "en": "Learnings"});

let nextStepsAttribute = progressType.assertAttribute("cf.cplace.solution.okr.nextSteps");
nextStepsAttribute.setType(Type._TEXT);
nextStepsAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
nextStepsAttribute.setLocalizedNames({"de": "N\u00e4chste Schritte", "en": "Next Steps"});

let keyResultAttribute = progressType.assertAttribute("cf.cplace.solution.okr.keyResult");
keyResultAttribute.setType(Type._LINK);
keyResultAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
keyResultAttribute.setLocalizedNames({"de": "Key Result", "en": "Key Result"});
keyResultAttribute.setEntityKind("page");
keyResultAttribute.setReferenceSameWorkspace(true);
keyResultAttribute.setReferenceIsHierarchy(false);

let cycleAttribute = progressType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type._LINK);
cycleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});
cycleAttribute.setEntityKind("page");
cycleAttribute.setReferenceSameWorkspace(false);
cycleAttribute.setReferenceIsHierarchy(false);
cycleAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult");
cycleAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let objectiveAttribute = progressType.assertAttribute("cf.cplace.solution.okr.objective");
objectiveAttribute.setType(Type._LINK);
objectiveAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
objectiveAttribute.setLocalizedNames({"de": "Objective", "en": "Objective"});
objectiveAttribute.setEntityKind("page");
objectiveAttribute.setReferenceSameWorkspace(false);
objectiveAttribute.setReferenceIsHierarchy(false);
objectiveAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult");
objectiveAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.objective");

let smallSupportAttribute = progressType.assertAttribute("cf.cplace.solution.okr.smallSupport");
smallSupportAttribute.setType(Type._LINK);
smallSupportAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
smallSupportAttribute.setLocalizedNames({"de": "Small Support", "en": "Small Support"});
smallSupportAttribute.setEntityKind("page");
smallSupportAttribute.setReferenceSameWorkspace(false);
smallSupportAttribute.setReferenceIsHierarchy(false);
smallSupportAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult");
smallSupportAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.smallSupport");

let bigSupportAttribute = progressType.assertAttribute("cf.cplace.solution.okr.bigSupport");
bigSupportAttribute.setType(Type._LINK);
bigSupportAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
bigSupportAttribute.setLocalizedNames({"de": "Big Support", "en": "Big Support"});
bigSupportAttribute.setEntityKind("page");
bigSupportAttribute.setReferenceSameWorkspace(false);
bigSupportAttribute.setReferenceIsHierarchy(false);
bigSupportAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult");
bigSupportAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.bigSupport");

let progressIndicatorAttribute = progressType.assertAttribute("cf.cplace.solution.okr.progressIndicator");
progressIndicatorAttribute.setType(Type._TEXT_ENUMERATION);
progressIndicatorAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
progressIndicatorAttribute.setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

let confidenceLevelAttribute = progressType.assertAttribute("cf.cplace.solution.okr.confidenceLevel");
confidenceLevelAttribute.setType(Type._TEXT_ENUMERATION);
confidenceLevelAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceLevelAttribute.setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

let gradingForecastAttribute = progressType.assertAttribute("cf.cplace.solution.okr.gradingForecast");
gradingForecastAttribute.setType(Type._TEXT_ENUMERATION);
gradingForecastAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
gradingForecastAttribute.setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

let lastUpdateAttribute = progressType.assertAttribute("cf.cplace.solution.okr.lastUpdate");
lastUpdateAttribute.setType(Type._DATE);
lastUpdateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
lastUpdateAttribute.setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});

let setAttribute = progressType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type._LINK);
setAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});
setAttribute.setEntityKind("page");
setAttribute.setReferenceSameWorkspace(false);
setAttribute.setReferenceIsHierarchy(false);
setAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult");
setAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.okr.set");

let taskType = workspace.assertType("cf.cplace.solution.okr.task");
taskType.setLocalizedNames({"de": "Aufgabe", "en": "Task"});

let titleAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.title");
titleAttribute.setType(Type._TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let responsibleAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.responsible");
responsibleAttribute.setType(Type._LINK);
responsibleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
responsibleAttribute.setLocalizedNames({"de": "Verantwortliche(r)", "en": "Responsible"});
responsibleAttribute.setEntityKind("person");
responsibleAttribute.setReferenceSameWorkspace(false);
responsibleAttribute.setReferenceIsHierarchy(false);

let descriptionAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.description");
descriptionAttribute.setType(Type._TEXT);
descriptionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let statusAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.status");
statusAttribute.setType(Type._TEXT_ENUMERATION);
statusAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
statusAttribute.setLocalizedNames({"de": "Status", "en": "Status"});

let dueDateAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.dueDate");
dueDateAttribute.setType(Type._DATE);
dueDateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
dueDateAttribute.setLocalizedNames({"de": "F\u00e4lligkeitsdatum", "en": "Due Date"});

let keyResultAttribute = taskType.assertAttribute("cf.cplace.solution.okr.keyResult");
keyResultAttribute.setType(Type._LINK);
keyResultAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
keyResultAttribute.setLocalizedNames({"de": "Key Result", "en": "Key Result"});
keyResultAttribute.setEntityKind("page");
keyResultAttribute.setReferenceSameWorkspace(true);
keyResultAttribute.setReferenceIsHierarchy(false);

let escalationLevelAttribute = taskType.assertAttribute("cf.cplace.digitalBoard.escalationLevel");
escalationLevelAttribute.setType(Type._TEXT_ENUMERATION);
escalationLevelAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
escalationLevelAttribute.setLocalizedNames({"de": "Eskalationslevel", "en": "Escalation Level"});

let selectNextCycleType = workspace.assertType("cf.cplace.solution.okr.selectNextCycle");
selectNextCycleType.setLocalizedNames({"de": "Select next Cycle", "en": "Select next Cycle"});

let nextCycleAttribute = selectNextCycleType.assertAttribute("cf.cplace.solution.okr.nextCycle");
nextCycleAttribute.setType(Type._LINK);
nextCycleAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
nextCycleAttribute.setLocalizedNames({"de": "N\u00e4chster Zyklus", "en": "Next Cycle"});
nextCycleAttribute.setEntityKind("page");
nextCycleAttribute.setReferenceSameWorkspace(true);
nextCycleAttribute.setReferenceIsHierarchy(false);