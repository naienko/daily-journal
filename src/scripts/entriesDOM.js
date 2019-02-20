/*
Author: Panya
Intent: responsible for modifying the DOM
*/

import makeEntries from "./entryComponent";
import API from "./data";
import listeners from "./eventListeners";

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
        API.get("moods")
            .then(moodArray => {
                let insertHTML = "";
                insertHTML = `<article id="journalForm">
        <fieldset>
            <label for="journalDate">Date of Entry</label>
            <input type="date" name="journalDate" id="journalDate" required />
        </fieldset>
        <fieldset>
            <label for="journalLearn">Concepts covered</label>
            <input type="text" name="journalLearn" id="journalLearn" required />
        </fieldset>
        <fieldset>
            <label for="journalEntry">Journal Entry</label>
            <textarea name="journalEntry" id="journalEntry" cols="30" rows="5" required></textarea>
        </fieldset>
        <fieldset>
            <label for="journalMood">Mood for the day</label>
            <select name="journalMood" id="journalMood" required>
                <option value="">Choose a mood ... </option>`;
                moodArray.forEach(element => {
                    insertHTML += `<option value="${element.id}">${element.mood}</option>`;
                });
                insertHTML += `</select>
                </fieldset>
                <button id="postEntry">Record Journal Entry</button>
                <div id="extras">
                    <fieldset>
                        <legend>Filter journal entries by mood</legend>
                    <div id="radioButtons">`;
                moodArray.forEach(element => {
                    insertHTML += `<label for="${element.mood}">${element.mood}<input type="radio" name="moodSwitch" value="${element.id}" /></label>`;
                });
                insertHTML += `</div>
                    </fieldset>
                    <fieldset>
                        <label for"searchjournal">search:</label>
                        <input type="text" name="searchjournal" id="searchjournal" />
                    </fieldset>
                <div>
            </article>`;
                document.querySelector("#displayForm").innerHTML = insertHTML;
                listeners.entryListener();
                listeners.moodListener();
                listeners.searchListener();
            });
    }
};

export default renderDOM;