/*
Author: Panya
Intent: responsible for modifying the DOM
*/

import makeEntries from "./entryComponent";
import API from "./API";
import listeners from "./lesserListeners";
import entrylistener from "./entrylistener";
import entryListener from "./entrylistener";

const renderDOM = {
    createEntries: entries => {
        let newCode = "";
        entries.forEach(entry => {
            // run each entry through factory method
            newCode += makeEntries.createSingleEntry(entry);
        });
        // add it to DOM
        document.querySelector("#displayEntries").innerHTML = newCode;
    },
    renderFormElement: () => {
        API.get("moods","")
            .then(moodArray => {
                let insertHTML = "";
                insertHTML = `<article id="journalForm">
        <input type="hidden" id="journalId" value="" />
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
                listeners.moodListener();
                listeners.searchListener();
                entryListener();
            });
    }
};

export default renderDOM;