let capabilityType = workspace.assertType("cf.cplace.solution.safe.capability");
capabilityType.setLocalizedNames({"de": "Capability", "en": "Capability"});

let titleAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.title").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let referenceAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.solution.reference").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Solution", "en": "Solution"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let descriptionAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.description").setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let capabilityTypeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.capabilityType").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Capability Type", "en": "Capability Type"});

let stateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.state").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Status", "en": "State"});

let wsjfAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.wsjf").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "WSJF", "en": "WSJF"});

let businessValueAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.businessValue").setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "User Business Value", "en": "User Business Value"});

let timeCriticalityAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.timeCriticality").setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Zeitliche Kritikalit\u00e4t", "en": "Time Criticality"});

let riskReductionAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.riskReduction").setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Risk Reduction", "en": "Risk Reduction"});

let jobSizeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.jobSize").setType(Type.NUMBERENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Job Size", "en": "Job Size"});

let programIncrementAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.programIncrement").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let actualStartDateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.actualStartDate").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Actual Start Date", "en": "Actual Start Date"});

let actualEndDateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.actualEndDate").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Actual End Date", "en": "Actual End Date"});

let flowTimeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.flowTime").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Flow time", "en": "Flow time"});

let programAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.program").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Program", "en": "Program"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let capabilityownerAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.capabilityowner").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Capability Owner", "en": "Capability Owner"});.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let portfolioEpicAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.portfolioEpic").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"en": "Portfolio Epic"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let solutionShortNameAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.solutionShortName").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Solution K\u00fcrzel", "en": "Solution Short Name"});.setDerivableReferencingAttributeName("cf.cplace.solution.safe.solution.reference").setDerivableReferencedAttributeName("cf.cplace.solution.safe.shortName");

let plannedStartAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.plannedStart").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Geplanter Start", "en": "Planned Start"});.setDerivableReferencingAttributeName("cf.cplace.solution.safe.programIncrement").setDerivableReferencedAttributeName("cf.cplace.solution.safe.startDate");

let plannedEndAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.plannedEnd").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Geplantes Ende", "en": "Planned End"});.setDerivableReferencingAttributeName("cf.cplace.solution.safe.programIncrement").setDerivableReferencedAttributeName("cf.cplace.solution.safe.endDate");

let iterationAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.iteration").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Iterations", "en": "Iterations"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let definitionOfReadyAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.definitionOfReady").setType(Type.BOOLEAN).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Definition of Ready", "en": "Definition of Ready"});

let definitionOfDoneAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.definitionOfDone").setType(Type.BOOLEAN).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Definition of Done", "en": "Definition of Done"});

let acceptanceCriteriaAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.acceptanceCriteria").setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Akzeptanzkriterien", "en": "Acceptance Criteria"});

let benefitHypothesisAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.benefitHypothesis").setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Benefit Hypothesis", "en": "Benefit Hypothesis"});

let conflictStateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.conflictState").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Datumskonflikt", "en": "Conflict State"});

let featuresAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.features").setType(Type.LINK).setMultiplicity(Multiplicity.ANY_NUMBER).setLocalizedNames({"de": "Features", "en": "Features"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);