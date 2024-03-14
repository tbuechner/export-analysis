const objective = workspace.assertType("cf.cplace.solution.okr.objective");
objective.setLocalizedNames({"de": "Objective", "en": "Objective"});

const number = objective.assertAttribute("cf.cplace.solution.okr.number");
number.setType(Type.NUMBER);
number.setMultiplicity(Multiplicity.EXACTLY_ONE);
number.setLocalizedNames({"de": "Nummer", "en": "Number"});

const title = objective.assertAttribute("cf.cplace.solution.okr.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.AT_MOST_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const set = objective.assertAttribute("cf.cplace.solution.okr.set");
set.setType(Type.LINK);
set.setMultiplicity(Multiplicity.EXACTLY_ONE);
set.setLocalizedNames({"de": "Set", "en": "Set"});

const accomplished = objective.assertAttribute("cf.cplace.solution.okr.accomplished");
accomplished.setType(Type.TEXTENUMERATION);
accomplished.setMultiplicity(Multiplicity.AT_MOST_ONE);
accomplished.setLocalizedNames({"de": "Erreicht", "en": "Accomplished"});

const cycle = objective.assertAttribute("cf.cplace.solution.okr.cycle");
cycle.setType(Type.LINK);
cycle.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycle.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

const description = objective.assertAttribute("cf.cplace.solution.okr.description");
description.setType(Type.RICHSTRING);
description.setMultiplicity(Multiplicity.AT_MOST_ONE);
description.setLocalizedNames({"de": "Beschreibung", "en": "Description"});