const cycle = workspace.assertType("cf.cplace.solution.okr.cycle");
cycle.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

const year = cycle.assertAttribute("cf.cplace.solution.okr.year");
year.setType(Type.TEXT);
year.setMultiplicity(Multiplicity.EXACTLY_ONE);
year.setLocalizedNames({"de": "Jahr", "en": "Year"});

const quarter = cycle.assertAttribute("cf.cplace.solution.okr.quarter");
quarter.setType(Type.TEXT);
quarter.setMultiplicity(Multiplicity.EXACTLY_ONE);
quarter.setLocalizedNames({"de": "Quartal", "en": "Quarter"});

const status = cycle.assertAttribute("cf.cplace.solution.okr.status");
status.setType(Type.TEXTENUMERATION);
status.setMultiplicity(Multiplicity.EXACTLY_ONE);
status.setLocalizedNames({"de": "Status", "en": "Status"});

const cyclesDashboard = cycle.assertAttribute("cf.cplace.solution.okr.cyclesDashboard");
cyclesDashboard.setType(Type.LINK);
cyclesDashboard.setMultiplicity(Multiplicity.AT_MOST_ONE);
cyclesDashboard.setLocalizedNames({"de": "Zyklen Dashboard", "en": "Cycles Dashboard"});

const start = cycle.assertAttribute("cf.cplace.solution.okr.start");
start.setType(Type.DATE);
start.setMultiplicity(Multiplicity.AT_MOST_ONE);
start.setLocalizedNames({"de": "Start", "en": "Start"});

const end = cycle.assertAttribute("cf.cplace.solution.okr.end");
end.setType(Type.DATE);
end.setMultiplicity(Multiplicity.AT_MOST_ONE);
end.setLocalizedNames({"de": "Ende", "en": "End"});

const statusForNameGenerationPattern = cycle.assertAttribute("cf.cplace.solution.okr.statusForNameGenerationPattern");
statusForNameGenerationPattern.setType(Type.TEXT);
statusForNameGenerationPattern.setMultiplicity(Multiplicity.AT_MOST_ONE);
statusForNameGenerationPattern.setLocalizedNames({"de": "Status f\u00fcr die Namensgenerierung", "en": "Status for name generation pattern"});

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

const keyResult = workspace.assertType("cf.cplace.solution.okr.keyResult");
keyResult.setLocalizedNames({"de": "Schl\u00fcsselergebnis", "en": "Key Result"});

const number = keyResult.assertAttribute("cf.cplace.solution.okr.number");
number.setType(Type.NUMBER);
number.setMultiplicity(Multiplicity.EXACTLY_ONE);
number.setLocalizedNames({"de": "Nummer", "en": "Number"});

const title = keyResult.assertAttribute("cf.cplace.solution.okr.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.AT_MOST_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const progressIndicator = keyResult.assertAttribute("cf.cplace.solution.okr.progressIndicator");
progressIndicator.setType(Type.TEXTENUMERATION);
progressIndicator.setMultiplicity(Multiplicity.AT_MOST_ONE);
progressIndicator.setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

const confidenceLevel = keyResult.assertAttribute("cf.cplace.solution.okr.confidenceLevel");
confidenceLevel.setType(Type.TEXTENUMERATION);
confidenceLevel.setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceLevel.setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

const gradingForecast = keyResult.assertAttribute("cf.cplace.solution.okr.gradingForecast");
gradingForecast.setType(Type.TEXTENUMERATION);
gradingForecast.setMultiplicity(Multiplicity.AT_MOST_ONE);
gradingForecast.setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

const smallSupport = keyResult.assertAttribute("cf.cplace.solution.okr.smallSupport");
smallSupport.setType(Type.LINK);
smallSupport.setMultiplicity(Multiplicity.ANY_NUMBER);
smallSupport.setLocalizedNames({"de": "Receive Small Support", "en": "Receive Small Support"});

const bigSupport = keyResult.assertAttribute("cf.cplace.solution.okr.bigSupport");
bigSupport.setType(Type.LINK);
bigSupport.setMultiplicity(Multiplicity.ANY_NUMBER);
bigSupport.setLocalizedNames({"de": "Big Support", "en": "Big Support"});

const giveBigSupport = keyResult.assertAttribute("cf.cplace.solution.okr.giveBigSupport");
giveBigSupport.setType(Type.LINK);
giveBigSupport.setMultiplicity(Multiplicity.ANY_NUMBER);
giveBigSupport.setLocalizedNames({"de": "Give Big Support", "en": "Give Big Support"});

const receiveBigSupport = keyResult.assertAttribute("cf.cplace.solution.okr.receiveBigSupport");
receiveBigSupport.setType(Type.LINK);
receiveBigSupport.setMultiplicity(Multiplicity.ANY_NUMBER);
receiveBigSupport.setLocalizedNames({"de": "Receive Big Support", "en": "Receive Big Support"});

const objective = keyResult.assertAttribute("cf.cplace.solution.okr.objective");
objective.setType(Type.LINK);
objective.setMultiplicity(Multiplicity.EXACTLY_ONE);
objective.setLocalizedNames({"de": "Objective", "en": "Objective"});

const progress = keyResult.assertAttribute("cf.cplace.solution.okr.progress");
progress.setType(Type.LINK);
progress.setMultiplicity(Multiplicity.AT_MOST_ONE);
progress.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});

const set = keyResult.assertAttribute("cf.cplace.solution.okr.set");
set.setType(Type.LINK);
set.setMultiplicity(Multiplicity.AT_MOST_ONE);
set.setLocalizedNames({"de": "Set", "en": "Set"});

const cycle = keyResult.assertAttribute("cf.cplace.solution.okr.cycle");
cycle.setType(Type.LINK);
cycle.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycle.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

const organizationalUnit = keyResult.assertAttribute("cf.cplace.solution.okr.organizationalUnit");
organizationalUnit.setType(Type.LINK);
organizationalUnit.setMultiplicity(Multiplicity.AT_MOST_ONE);
organizationalUnit.setLocalizedNames({"de": "Organsationseinheit", "en": "Organizational Unit"});

const lastUpdate = keyResult.assertAttribute("cf.cplace.solution.okr.lastUpdate");
lastUpdate.setType(Type.DATE);
lastUpdate.setMultiplicity(Multiplicity.AT_MOST_ONE);
lastUpdate.setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});

const progress = workspace.assertType("cf.cplace.solution.okr.progress");
progress.setLocalizedNames({"de": "Fortschritt", "en": "Progress"});

const result = progress.assertAttribute("cf.cplace.solution.okr.result");
result.setType(Type.TEXT);
result.setMultiplicity(Multiplicity.AT_MOST_ONE);
result.setLocalizedNames({"de": "Ergebnise", "en": "Results"});

const problem = progress.assertAttribute("cf.cplace.solution.okr.problem");
problem.setType(Type.TEXT);
problem.setMultiplicity(Multiplicity.AT_MOST_ONE);
problem.setLocalizedNames({"de": "Probleme", "en": "Problems"});

const lessonsLearned = progress.assertAttribute("cf.cplace.solution.okr.lessonsLearned");
lessonsLearned.setType(Type.TEXT);
lessonsLearned.setMultiplicity(Multiplicity.AT_MOST_ONE);
lessonsLearned.setLocalizedNames({"de": "Learnings", "en": "Learnings"});

const nextSteps = progress.assertAttribute("cf.cplace.solution.okr.nextSteps");
nextSteps.setType(Type.TEXT);
nextSteps.setMultiplicity(Multiplicity.AT_MOST_ONE);
nextSteps.setLocalizedNames({"de": "N\u00e4chste Schritte", "en": "Next Steps"});

const keyResult = progress.assertAttribute("cf.cplace.solution.okr.keyResult");
keyResult.setType(Type.LINK);
keyResult.setMultiplicity(Multiplicity.EXACTLY_ONE);
keyResult.setLocalizedNames({"de": "Key Result", "en": "Key Result"});

const cycle = progress.assertAttribute("cf.cplace.solution.okr.cycle");
cycle.setType(Type.LINK);
cycle.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycle.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

const objective = progress.assertAttribute("cf.cplace.solution.okr.objective");
objective.setType(Type.LINK);
objective.setMultiplicity(Multiplicity.AT_MOST_ONE);
objective.setLocalizedNames({"de": "Objective", "en": "Objective"});

const smallSupport = progress.assertAttribute("cf.cplace.solution.okr.smallSupport");
smallSupport.setType(Type.LINK);
smallSupport.setMultiplicity(Multiplicity.ANY_NUMBER);
smallSupport.setLocalizedNames({"de": "Small Support", "en": "Small Support"});

const bigSupport = progress.assertAttribute("cf.cplace.solution.okr.bigSupport");
bigSupport.setType(Type.LINK);
bigSupport.setMultiplicity(Multiplicity.ANY_NUMBER);
bigSupport.setLocalizedNames({"de": "Big Support", "en": "Big Support"});

const progressIndicator = progress.assertAttribute("cf.cplace.solution.okr.progressIndicator");
progressIndicator.setType(Type.TEXTENUMERATION);
progressIndicator.setMultiplicity(Multiplicity.AT_MOST_ONE);
progressIndicator.setLocalizedNames({"de": "Fortschrittsindikator", "en": "Progress Indicator"});

const confidenceLevel = progress.assertAttribute("cf.cplace.solution.okr.confidenceLevel");
confidenceLevel.setType(Type.TEXTENUMERATION);
confidenceLevel.setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceLevel.setLocalizedNames({"de": "Confidence Level", "en": "Confidence Level"});

const gradingForecast = progress.assertAttribute("cf.cplace.solution.okr.gradingForecast");
gradingForecast.setType(Type.TEXTENUMERATION);
gradingForecast.setMultiplicity(Multiplicity.AT_MOST_ONE);
gradingForecast.setLocalizedNames({"de": "Fortschritt Vorhersage", "en": "Grading Forecast"});

const lastUpdate = progress.assertAttribute("cf.cplace.solution.okr.lastUpdate");
lastUpdate.setType(Type.DATE);
lastUpdate.setMultiplicity(Multiplicity.AT_MOST_ONE);
lastUpdate.setLocalizedNames({"de": "Letztes Update", "en": "Last Update"});

const set = progress.assertAttribute("cf.cplace.solution.okr.set");
set.setType(Type.LINK);
set.setMultiplicity(Multiplicity.AT_MOST_ONE);
set.setLocalizedNames({"de": "Set", "en": "Set"});

const task = workspace.assertType("cf.cplace.solution.okr.task");
task.setLocalizedNames({"de": "Aufgabe", "en": "Task"});

const title = task.assertAttribute("cf.cplace.digitalBoard.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.AT_MOST_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const responsible = task.assertAttribute("cf.cplace.digitalBoard.responsible");
responsible.setType(Type.LINK);
responsible.setMultiplicity(Multiplicity.AT_MOST_ONE);
responsible.setLocalizedNames({"de": "Verantwortliche(r)", "en": "Responsible"});

const description = task.assertAttribute("cf.cplace.digitalBoard.description");
description.setType(Type.TEXT);
description.setMultiplicity(Multiplicity.AT_MOST_ONE);
description.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

const status = task.assertAttribute("cf.cplace.digitalBoard.status");
status.setType(Type.TEXTENUMERATION);
status.setMultiplicity(Multiplicity.EXACTLY_ONE);
status.setLocalizedNames({"de": "Status", "en": "Status"});

const dueDate = task.assertAttribute("cf.cplace.digitalBoard.dueDate");
dueDate.setType(Type.DATE);
dueDate.setMultiplicity(Multiplicity.AT_MOST_ONE);
dueDate.setLocalizedNames({"de": "F\u00e4lligkeitsdatum", "en": "Due Date"});

const keyResult = task.assertAttribute("cf.cplace.solution.okr.keyResult");
keyResult.setType(Type.LINK);
keyResult.setMultiplicity(Multiplicity.EXACTLY_ONE);
keyResult.setLocalizedNames({"de": "Key Result", "en": "Key Result"});

const escalationLevel = task.assertAttribute("cf.cplace.digitalBoard.escalationLevel");
escalationLevel.setType(Type.TEXTENUMERATION);
escalationLevel.setMultiplicity(Multiplicity.EXACTLY_ONE);
escalationLevel.setLocalizedNames({"de": "Eskalationslevel", "en": "Escalation Level"});

const selectNextCycle = workspace.assertType("cf.cplace.solution.okr.selectNextCycle");
selectNextCycle.setLocalizedNames({"de": "Select next Cycle", "en": "Select next Cycle"});

const nextCycle = selectNextCycle.assertAttribute("cf.cplace.solution.okr.nextCycle");
nextCycle.setType(Type.LINK);
nextCycle.setMultiplicity(Multiplicity.EXACTLY_ONE);
nextCycle.setLocalizedNames({"de": "N\u00e4chster Zyklus", "en": "Next Cycle"});