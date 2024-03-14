let keyResultType = workspace.assertType("cf.cplace.solution.okr.keyResult");
keyResultType.setLocalizedNames({"de": "Schl\u00fcsselergebnis", "en": "Key Result"});

let numberAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.number").setType(Type.NUMBER).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.title").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let progressIndicatorAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.progressIndicator").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

let confidenceLevelAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.confidenceLevel").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

let gradingForecastAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.gradingForecast").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

let smallSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.smallSupport").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Receive Small Support", "en": "Receive Small Support"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let bigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.bigSupport").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Big Support", "en": "Big Support"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.giveBigSupport").setDerivableReferencedAttributeName("cf.cplace.solution.okr.organizationalUnit");

let giveBigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.giveBigSupport").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Give Big Support", "en": "Give Big Support"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let receiveBigSupportAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.receiveBigSupport").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Receive Big Support", "en": "Receive Big Support"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let objectiveAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.objective").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Objective", "en": "Objective"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(true);

let progressAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.progress").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Fortschritt", "en": "Progress"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let setAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.set").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Set", "en": "Set"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.objective").setDerivableReferencedAttributeName("cf.cplace.solution.okr.set");

let cycleAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.cycle").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Zyklus", "en": "Cycle"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set").setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let organizationalUnitAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.organizationalUnit").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Organsationseinheit", "en": "Organizational Unit"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set").setDerivableReferencedAttributeName("cf.cplace.solution.okr.organizationalUnit");

let lastUpdateAttribute = keyResultType.assertAttribute("cf.cplace.solution.okr.lastUpdate").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});.setDerivableReferencingAttributeName("cf.cplace.solution.okr.progress").setDerivableReferencedAttributeName("cf.cplace.solution.okr.lastUpdate");