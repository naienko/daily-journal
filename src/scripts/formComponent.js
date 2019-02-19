/*
Author: Panya
Intent:  responsible for creating the entry form HTML component
*/

import API from "./data";

const showAllMoods = () => {
    let HTMLcode = "";
    API.get("moods")
    .then(moodArray => {
        moodArray.forEach(element => {
            HTMLcode += `<option value=${element.id}>${element.mood}</option>
            `
        });
    })
    return HTMLcode;
}

const makeJournalFormComponent = () => {
    // Create HTML structure for the entry form
    let formCode = showAllMoods();
    return formCode;
};

export default makeJournalFormComponent;