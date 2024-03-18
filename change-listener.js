function handleProgramIncrementChange(programIncrement) {
    // Check if this is a new Program Increment creation
    if (!programIncrement.getId()) {
        const solution = programIncrement.get('cf.cplace.solution.safe.solution');
        const startDate = programIncrement.get('cf.cplace.solution.safe.startDate');

        existingProgramIncrements = solution.getIncomingPages('cf.cplace.solution.safe.programIncrement', 'cf.cplace.solution.safe.solution');

        let closestPredecessor = null;
        let minDiff = Infinity;

        // Find the closest predecessor Program Increment
        for (const existingPI of existingProgramIncrements) {
            const existingStartDate = existingPI.get('cf.cplace.solution.safe.startDate');
            const diff = Math.abs(startDate.getTime() - existingStartDate.getTime());

            if (diff < minDiff && existingStartDate < startDate) {
                minDiff = diff;
                closestPredecessor = existingPI;
            }
        }

        // Set the closest predecessor Program Increment
        if (closestPredecessor) {
            programIncrement.set('cf.cplace.solution.safe.predecessor', closestPredecessor);
        }
    }
}
