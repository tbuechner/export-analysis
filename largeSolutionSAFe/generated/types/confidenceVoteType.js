let confidenceVoteType = workspace.assertType("cf.cplace.solution.safe.confidenceVote");
confidenceVoteType.setLocalizedNames({"de": "Confidence Vote", "en": "Confidence Vote"});

let pIAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.PI").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let resultAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.result").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Ergebnis", "en": "Result"});

let oneFingerAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.oneFinger").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "One Finger", "en": "One Finger"});

let twoFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.twoFingers").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Two Fingers", "en": "Two Fingers"});

let threeFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.threeFingers").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Three Fingers", "en": "Three Fingers"});

let fourFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.fourFingers").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Four Fingers", "en": "Four Fingers"});

let fiveFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.fiveFingers").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Five Fingers", "en": "Five Fingers"});

let solutionAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.solution").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Solution", "en": "Solution"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);