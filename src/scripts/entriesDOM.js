/*
Author: Panya
Intent: responsible for modifying the DOM
*/

import makeJournalFormComponent from "./formComponent";
import makeEntries from "./entryComponent";

const renderDOM = {
    createEntries: entries => {
        let HTMLsquirt = "";
        // reverse the array so most recent is at top
        // add a sorting function in case the entries aren't in data order in database?
        entries.reverse().forEach(entry => {
            // run each entry through factory method
            HTMLsquirt += makeEntries.createSingleEntry(entry);
        });
        // add it to DOM
        document.querySelector("#displayEntries").innerHTML = HTMLsquirt;
    },
    renderFormElement: () => {
        document.querySelector("#displayForm").innerHTML = makeJournalFormComponent();
    }
};

export default renderDOM;