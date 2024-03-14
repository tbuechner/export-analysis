let progressType = workspace.assertType("cf.cplace.solution.okr.progress");
progressType.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});

let resultAttribute = progressType.assertAttribute("cf.cplace.solution.okr.result").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Ergebnise", "en": "Results"});

let problemAttribute = progressType.assertAttribute("cf.cplace.solution.okr.problem").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Probleme", "en": "Problems"});

let lessonsLearnedAttribute = progressType.assertAttribute("cf.cplace.solution.okr.lessonsLearned").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Learnings", "en": "Learnings"});

let nextStepsAttribute = progressType.assertAttribute("cf.cplace.solution.okr.nextSteps").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "N\u00e4chste Schritte", "en": "Next Steps"});

let keyResultAttribute = progressType.assertAttribute("cf.cplace.solution.okr.keyResult").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Key Result", "en": "Key Result"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let cycleAttribute = progressType.assertAttribute("cf.cplace.solution.okr.cycle").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Zyklus", "en": "Cycle"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let objectiveAttribute = progressType.assertAttribute("cf.cplace.solution.okr.objective").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Objective", "en": "Objective"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.objective");

let smallSupportAttribute = progressType.assertAttribute("cf.cplace.solution.okr.smallSupport").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Small Support", "en": "Small Support"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.smallSupport");

let bigSupportAttribute = progressType.assertAttribute("cf.cplace.solution.okr.bigSupport").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Big Support", "en": "Big Support"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.bigSupport");

let progressIndicatorAttribute = progressType.assertAttribute("cf.cplace.solution.okr.progressIndicator").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

let confidenceLevelAttribute = progressType.assertAttribute("cf.cplace.solution.okr.confidenceLevel").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

let gradingForecastAttribute = progressType.assertAttribute("cf.cplace.solution.okr.gradingForecast").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

let lastUpdateAttribute = progressType.assertAttribute("cf.cplace.solution.okr.lastUpdate").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});

let setAttribute = progressType.assertAttribute("cf.cplace.solution.okr.set").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Set", "en": "Set"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.keyResult").setDerivableReferencedAttributeName("cf.cplace.solution.okr.set");