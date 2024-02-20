const alternativeLayout = {
    layout: [
        {
            columns: [
                {
                    size: 9,
                    widget: {
                        type: "EMBEDDED_SEARCH_AS_TABLE",
                        configuration: {
                            groupOrder: "asc",
                            showNewButton: "No",
                            columns: [
                                {name: "cf.cplace.solution.okr.year", visible: true},
                                {name: "cf.cplace.solution.okr.quarter", visible: true},
                                {name: "cf.cplace.solution.okr.status", visible: true},
                                {name: "cf.cplace.solution.okr.start", visible: true},
                                {name: "cf.cplace.solution.okr.end", visible: true},
                                // Other columns omitted for brevity
                            ],
                            hideTableLinks: false,
                            singleSpaced: true,
                            hideNames: false,
                            title: {de: "Alle Zyklen", en: "All Cycles"},
                            search: {/* search configuration omitted for brevity */},
                            showTableHeader: true,
                            showTableActions: true,
                            showTableFooter: true,
                            height: 330 // Assuming height is a simple number value
                        }
                    }
                },
                {
                    size: 3,
                    widget: {
                        type: "ATTRIBUTES_GROUP",
                        configuration: {
                            enableMultiEdit: true,
                            localizedTitle: {de: "Cycle Template", en: "Cycle Template"},
                            layout: {/* nested layout omitted for simplicity */},
                            pageSelection: "relative",
                            relativeSelection: "cf.cplace.solution.okr.settings",
                            showFrame: true,
                            height: 100
                        }
                    }
                }
            ]
        },
        {
            columns: [
                {
                    size: 9,
                    widget: {/* widget configuration */} // Omitted for brevity
                },
                {
                    size: 3,
                    widget: {
                        type: "LOW_CODE_BUTTON",
                        configuration: {
                            dataSource: "search",
                            script: "JavaScript function or script here",
                            buttonLabel: {de: "Change Cycle", en: "Change Cycle"},
                            sortOrder: "Aufsteigend",
                            showConfirmationDialog: false,
                            showFrame: false
                        }
                    }
                }
            ]
        },
        // Additional rows and columns omitted for brevity
    ]
};

console.log(alternativeLayout);
