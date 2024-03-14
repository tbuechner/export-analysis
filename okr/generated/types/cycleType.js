let cycleType = workspace.assertType("cf.cplace.solution.okr.cycle");
cycleType.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

let yearAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.year").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Jahr", "en": "Year"});

let quarterAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.quarter").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Quartal", "en": "Quarter"});

let statusAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.status").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Status", "en": "Status"});

let cyclesDashboardAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.cyclesDashboard").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Zyklen Dashboard", "en": "Cycles Dashboard"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(true);

let startAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.start").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Start", "en": "Start"});

let endAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.end").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Ende", "en": "End"});

let statusForNameGenerationPatternAttribute = cycleType.assertAttribute("cf.cplace.solution.okr.statusForNameGenerationPattern").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Status f\u00fcr die Namensgenerierung", "en": "Status for name generation pattern"});