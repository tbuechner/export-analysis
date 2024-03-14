let capabilityType = workspace.assertType("cf.cplace.solution.safe.capability");
capabilityType.setLocalizedNames({"de": "Capability", "en": "Capability"});

let titleAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let referenceAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.solution.reference");
referenceAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
referenceAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
referenceAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let descriptionAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.description");
descriptionAttribute.setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let capabilityTypeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.capabilityType");
capabilityTypeAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
capabilityTypeAttribute.setLocalizedNames({"de": "Capability Type", "en": "Capability Type"});

let stateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.state");
stateAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
stateAttribute.setLocalizedNames({"de": "Status", "en": "State"});

let wsjfAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.wsjf");
wsjfAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
wsjfAttribute.setLocalizedNames({"de": "WSJF", "en": "WSJF"});

let businessValueAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.businessValue");
businessValueAttribute.setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
businessValueAttribute.setLocalizedNames({"de": "User Business Value", "en": "User Business Value"});

let timeCriticalityAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.timeCriticality");
timeCriticalityAttribute.setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
timeCriticalityAttribute.setLocalizedNames({"de": "Zeitliche Kritikalit\u00e4t", "en": "Time Criticality"});

let riskReductionAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.riskReduction");
riskReductionAttribute.setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
riskReductionAttribute.setLocalizedNames({"de": "Risk Reduction", "en": "Risk Reduction"});

let jobSizeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.jobSize");
jobSizeAttribute.setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
jobSizeAttribute.setLocalizedNames({"de": "Job Size", "en": "Job Size"});

let programIncrementAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.programIncrement");
programIncrementAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
programIncrementAttribute.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});
programIncrementAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let actualStartDateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.actualStartDate");
actualStartDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
actualStartDateAttribute.setLocalizedNames({"de": "Actual Start Date", "en": "Actual Start Date"});

let actualEndDateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.actualEndDate");
actualEndDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
actualEndDateAttribute.setLocalizedNames({"de": "Actual End Date", "en": "Actual End Date"});

let flowTimeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.flowTime");
flowTimeAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
flowTimeAttribute.setLocalizedNames({"de": "Flow time", "en": "Flow time"});

let programAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.program");
programAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
programAttribute.setLocalizedNames({"de": "Program", "en": "Program"});
programAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let capabilityownerAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.capabilityowner");
capabilityownerAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
capabilityownerAttribute.setLocalizedNames({"de": "Capability Owner", "en": "Capability Owner"});
capabilityownerAttribute.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let portfolioEpicAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.portfolioEpic");
portfolioEpicAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
portfolioEpicAttribute.setLocalizedNames({"en": "Portfolio Epic"});
portfolioEpicAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let solutionShortNameAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.solutionShortName");
solutionShortNameAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionShortNameAttribute.setLocalizedNames({"de": "Solution K\u00fcrzel", "en": "Solution Short Name"});
solutionShortNameAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.solution.reference").setDerivableReferencedAttributeName("cf.cplace.solution.safe.shortName");

let plannedStartAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.plannedStart");
plannedStartAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedStartAttribute.setLocalizedNames({"de": "Geplanter Start", "en": "Planned Start"});
plannedStartAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.programIncrement").setDerivableReferencedAttributeName("cf.cplace.solution.safe.startDate");

let plannedEndAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.plannedEnd");
plannedEndAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedEndAttribute.setLocalizedNames({"de": "Geplantes Ende", "en": "Planned End"});
plannedEndAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.programIncrement").setDerivableReferencedAttributeName("cf.cplace.solution.safe.endDate");

let iterationAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.iteration");
iterationAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
iterationAttribute.setLocalizedNames({"de": "Iterations", "en": "Iterations"});
iterationAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let definitionOfReadyAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.definitionOfReady");
definitionOfReadyAttribute.setType(Type.BOOLEAN).setMultiplicity(Multiplicity.EXACTLY_ONE);
definitionOfReadyAttribute.setLocalizedNames({"de": "Definition of Ready", "en": "Definition of Ready"});

let definitionOfDoneAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.definitionOfDone");
definitionOfDoneAttribute.setType(Type.BOOLEAN).setMultiplicity(Multiplicity.EXACTLY_ONE);
definitionOfDoneAttribute.setLocalizedNames({"de": "Definition of Done", "en": "Definition of Done"});

let acceptanceCriteriaAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.acceptanceCriteria");
acceptanceCriteriaAttribute.setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE);
acceptanceCriteriaAttribute.setLocalizedNames({"de": "Akzeptanzkriterien", "en": "Acceptance Criteria"});

let benefitHypothesisAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.benefitHypothesis");
benefitHypothesisAttribute.setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE);
benefitHypothesisAttribute.setLocalizedNames({"de": "Benefit Hypothesis", "en": "Benefit Hypothesis"});

let conflictStateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.conflictState");
conflictStateAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
conflictStateAttribute.setLocalizedNames({"de": "Datumskonflikt", "en": "Conflict State"});

let featuresAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.features");
featuresAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER);
featuresAttribute.setLocalizedNames({"de": "Features", "en": "Features"});
featuresAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);