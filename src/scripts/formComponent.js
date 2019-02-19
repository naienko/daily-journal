/*
Author: Panya
Intent:  responsible for creating the entry form HTML component
*/

import API from "./data";

const showAllMoods = () => {
    API.get("moods")
    .then(moodArray => {
        let HTMLcode = "";
        moodArray.forEach(element => {
            HTMLcode += `<option value=${element.id}>${element.mood}</option>
            `
        });
            return HTMLcode;
    })
}

const makeJournalFormComponent = () => {
    // Create HTML structure for the entry form
    return `<form action="" id="journalForm">
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
                <option value="">Choose a mood ... </option>
            </select>
        </fieldset>
        <button id="postEntry">Record Journal Entry</button>
        <div id="extras">
            <fieldset>
                <legend>Filter journal entries by mood</legend>
            <div id="radioButtons">
                <label for="happy">happy<input type="radio" name="moodSwitch" value="happy" /></label>
                <label for="not yet">not yet<input type="radio" name="moodSwitch" value="not yet" /></label>
                <label for="frustrated">frustrated<input type="radio" name="moodSwitch" value="frustrated" /></label>
                <label for="sad">sad<input type="radio" name="moodSwitch" value="sad" /></label>
                <label for="anxious">anxious<input type="radio" name="moodSwitch" value="anxious" /></label>
                <label for="furious">furious<input type="radio" name="moodSwitch" value="furious" /></label>
            </div>
            </fieldset>
            <fieldset>
                <label for"searchjournal">search:</label>
                <input type="text" name="searchjournal" id="searchjournal" />
            </fieldset>
        <div>
    </form>`;
};

export default makeJournalFormComponent;