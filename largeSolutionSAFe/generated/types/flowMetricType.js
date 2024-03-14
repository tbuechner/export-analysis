let flowMetricType = workspace.assertType("cf.cplace.solution.safe.flowMetric");
flowMetricType.setLocalizedNames({"de": "Durchflussmetrik", "en": "Flow Metric"});

let artifactTypeAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.artifactType").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Artefakttyp", "en": "Artifact type"});

let snapshotDateAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.snapshotDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Schnappschuss-Datum", "en": "Snapshot date"});

let referenceAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let timeboxAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.timebox").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let jsonMetricDataAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.jsonMetricData").setType(Type.LONGTEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "JSON Metric Data", "en": "JSON Metric Data"});