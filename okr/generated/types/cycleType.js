let cycleType = workspace.assertType("cf.cplace.solution.okr.cycle");
cycleType.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

let yearAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.year");
yearAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
yearAttribute.setLocalizedNames({"de": "Jahr", "en": "Year"});

let quarterAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.quarter");
quarterAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
quarterAttribute.setLocalizedNames({"de": "Quartal", "en": "Quarter"});

let statusAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.status");
statusAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
statusAttribute.setLocalizedNames({"de": "Status", "en": "Status"});

let cyclesDashboardAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.cyclesDashboard");
cyclesDashboardAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
cyclesDashboardAttribute.setLocalizedNames({"de": "Zyklen Dashboard", "en": "Cycles Dashboard"});
cyclesDashboardAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(true);

let startAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.start");
startAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
startAttribute.setLocalizedNames({"de": "Start", "en": "Start"});

let endAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.end");
endAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
endAttribute.setLocalizedNames({"de": "Ende", "en": "End"});

let statusForNameGenerationPatternAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.statusForNameGenerationPattern");
statusForNameGenerationPatternAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
statusForNameGenerationPatternAttribute.setLocalizedNames({"de": "Status f\u00fcr die Namensgenerierung", "en": "Status for name generation pattern"});