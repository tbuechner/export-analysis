let confidenceVoteType = workspace.assertType("cf.cplace.solution.safe.confidenceVote");
confidenceVoteType.setLocalizedNames({"de": "Confidence Vote", "en": "Confidence Vote"});

let pIAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.PI");
pIAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
pIAttribute.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});
pIAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let resultAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.result");
resultAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
resultAttribute.setLocalizedNames({"de": "Ergebnis", "en": "Result"});

let oneFingerAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.oneFinger");
oneFingerAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
oneFingerAttribute.setLocalizedNames({"de": "One Finger", "en": "One Finger"});

let twoFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.twoFingers");
twoFingersAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
twoFingersAttribute.setLocalizedNames({"de": "Two Fingers", "en": "Two Fingers"});

let threeFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.threeFingers");
threeFingersAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
threeFingersAttribute.setLocalizedNames({"de": "Three Fingers", "en": "Three Fingers"});

let fourFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.fourFingers");
fourFingersAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
fourFingersAttribute.setLocalizedNames({"de": "Four Fingers", "en": "Four Fingers"});

let fiveFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.fiveFingers");
fiveFingersAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
fiveFingersAttribute.setLocalizedNames({"de": "Five Fingers", "en": "Five Fingers"});

let solutionAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.solution");
solutionAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
solutionAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);