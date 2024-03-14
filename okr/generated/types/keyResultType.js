let keyResultType = workspace.assertType("cf.cplace.solution.okr.keyResult");
keyResultType.setLocalizedNames({"de": "Schl\u00fcsselergebnis", "en": "Key Result"});

let numberAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.number");
numberAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.EXACTLY_ONE);
numberAttribute.setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let progressIndicatorAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.progressIndicator");
progressIndicatorAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
progressIndicatorAttribute.setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

let confidenceLevelAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.confidenceLevel");
confidenceLevelAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceLevelAttribute.setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

let gradingForecastAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.gradingForecast");
gradingForecastAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
gradingForecastAttribute.setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

let smallSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.smallSupport");
smallSupportAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
smallSupportAttribute.setLocalizedNames({"de": "Receive Small Support", "en": "Receive Small Support"});
smallSupportAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let bigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.bigSupport");
bigSupportAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
bigSupportAttribute.setLocalizedNames({"de": "Big Support", "en": "Big Support"});
bigSupportAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
bigSupportAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.giveBigSupport").setDerivableReferencedAttributeName("cf.cplace.solution.okr.organizationalUnit");

let giveBigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.giveBigSupport");
giveBigSupportAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
giveBigSupportAttribute.setLocalizedNames({"de": "Give Big Support", "en": "Give Big Support"});
giveBigSupportAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let receiveBigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.receiveBigSupport");
receiveBigSupportAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
receiveBigSupportAttribute.setLocalizedNames({"de": "Receive Big Support", "en": "Receive Big Support"});
receiveBigSupportAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let objectiveAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.objective");
objectiveAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
objectiveAttribute.setLocalizedNames({"de": "Objective", "en": "Objective"});
objectiveAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(true);

let progressAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.progress");
progressAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
progressAttribute.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});
progressAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let setAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});
setAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
setAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.objective").setDerivableReferencedAttributeName("cf.cplace.solution.okr.set");

let cycleAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});
cycleAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
cycleAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set").setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let organizationalUnitAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.organizationalUnit");
organizationalUnitAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
organizationalUnitAttribute.setLocalizedNames({"de": "Organsationseinheit", "en": "Organizational Unit"});
organizationalUnitAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
organizationalUnitAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set").setDerivableReferencedAttributeName("cf.cplace.solution.okr.organizationalUnit");

let lastUpdateAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.lastUpdate");
lastUpdateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
lastUpdateAttribute.setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});
lastUpdateAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.progress").setDerivableReferencedAttributeName("cf.cplace.solution.okr.lastUpdate");