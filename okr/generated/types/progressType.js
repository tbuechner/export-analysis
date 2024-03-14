let progressType = workspace.assertType("cf.cplace.solution.okr.progress");
progressType.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});

let resultAttribute = progressType.assertAttribute("cf.cplace.solution.okr.result");
resultAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
resultAttribute.setLocalizedNames({"de": "Ergebnise", "en": "Results"});

let problemAttribute = progressType.assertAttribute("cf.cplace.solution.okr.problem");
problemAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
problemAttribute.setLocalizedNames({"de": "Probleme", "en": "Problems"});

let lessonsLearnedAttribute = progressType.assertAttribute("cf.cplace.solution.okr.lessonsLearned");
lessonsLearnedAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
lessonsLearnedAttribute.setLocalizedNames({"de": "Learnings", "en": "Learnings"});

let nextStepsAttribute = progressType.assertAttribute("cf.cplace.solution.okr.nextSteps");
nextStepsAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
nextStepsAttribute.setLocalizedNames({"de": "N\u00e4chste Schritte", "en": "Next Steps"});

let keyResultAttribute = progressType.assertAttribute("cf.cplace.solution.okr.keyResult");
keyResultAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
keyResultAttribute.setLocalizedNames({"de": "Key Result", "en": "Key Result"});
keyResultAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let cycleAttribute = progressType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});
cycleAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
cycleAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let objectiveAttribute = progressType.assertAttribute("cf.cplace.solution.okr.objective");
objectiveAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
objectiveAttribute.setLocalizedNames({"de": "Objective", "en": "Objective"});
objectiveAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
objectiveAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.objective");

let smallSupportAttribute = progressType.assertAttribute("cf.cplace.solution.okr.smallSupport");
smallSupportAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
smallSupportAttribute.setLocalizedNames({"de": "Small Support", "en": "Small Support"});
smallSupportAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
smallSupportAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.smallSupport");

let bigSupportAttribute = progressType.assertAttribute("cf.cplace.solution.okr.bigSupport");
bigSupportAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
bigSupportAttribute.setLocalizedNames({"de": "Big Support", "en": "Big Support"});
bigSupportAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
bigSupportAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.bigSupport");

let progressIndicatorAttribute = progressType.assertAttribute("cf.cplace.solution.okr.progressIndicator");
progressIndicatorAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
progressIndicatorAttribute.setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

let confidenceLevelAttribute = progressType.assertAttribute("cf.cplace.solution.okr.confidenceLevel");
confidenceLevelAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceLevelAttribute.setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

let gradingForecastAttribute = progressType.assertAttribute("cf.cplace.solution.okr.gradingForecast");
gradingForecastAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
gradingForecastAttribute.setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

let lastUpdateAttribute = progressType.assertAttribute("cf.cplace.solution.okr.lastUpdate");
lastUpdateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
lastUpdateAttribute.setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});

let setAttribute = progressType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});
setAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
setAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.set");