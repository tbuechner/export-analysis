let periodStatusType = workspace.assertType("cf.cplace.solution.safe.periodStatus");
periodStatusType.setLocalizedNames({"en": "Period Status", "de": "Period Status"});

let orderAttribute = periodStatusType.assertAttribute("cf.cplace.solution.safe.order").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"en": "Order"});