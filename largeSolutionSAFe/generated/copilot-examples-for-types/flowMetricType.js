let flowMetricType = workspace.assertType("cf.cplace.solution.safe.flowMetric");
flowMetricType.setLocalizedNames({"de": "Durchflussmetrik", "en": "Flow Metric"});

let artifactTypeAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.artifactType");
artifactTypeAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
artifactTypeAttribute.setLocalizedNames({"de": "Artefakttyp", "en": "Artifact type"});

let snapshotDateAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.snapshotDate");
snapshotDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
snapshotDateAttribute.setLocalizedNames({"de": "Schnappschuss-Datum", "en": "Snapshot date"});

let referenceAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference");
referenceAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
referenceAttribute.setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});
referenceAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let timeboxAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.timebox");
timeboxAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
timeboxAttribute.setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});
timeboxAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let jsonMetricDataAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.jsonMetricData");
jsonMetricDataAttribute.setType(Type.LONGTEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
jsonMetricDataAttribute.setLocalizedNames({"de": "JSON Metric Data", "en": "JSON Metric Data"});