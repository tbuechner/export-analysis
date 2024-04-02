/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.programIncrement
 * @attribute cf.cplace.solution.safe.title
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Automatically creates a Confidence Vote page upon creation of a Programm Increment
 */

cplace.setLogName("listener_createConfidenceVote")

const CONFIDENCE_VOTE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.confidenceVote",
    ATTR: {
        PROGRAMM_INCREMENT: "cf.cplace.solution.safe.confidenceVote.PI",
        SOLUTION: "cf.cplace.solution.safe.confidenceVote.solution",
    },
});

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
    },
});

function main() {
    if (!changeEvent.isNew()) {
        return;
    }
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
    const programmIncrement = changeEvent.getEntity();
    const solution = programmIncrement.get(PROGRAMM_INCREMENT.ATTR.SOLUTION);

    const confidenceVote = cplace.actions().createPage(
        {
            space: programmIncrement.getSpaceId(),
            customType: CONFIDENCE_VOTE.TYPE,
            customAttributes: {
                [CONFIDENCE_VOTE.ATTR.PROGRAMM_INCREMENT]: programmIncrement,
                [CONFIDENCE_VOTE.ATTR.SOLUTION]: solution,
            },
        },
        { setGeneratedName: true }
    );
    cplace.log(`${confidenceVote.getName()} created`);
}

main()