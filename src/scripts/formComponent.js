// responsible for creating the entry form HTML component
const makeJournalFormComponent = () => {
    // Create HTML structure for the entry form
    return `<form action="" id="journalForm">
        <fieldset>
            <label for="journalDate">Date of Entry</label>
            <input type="date" name="journalDate" id="journalDate" />
        </fieldset>
        <fieldset>
            <label for="journalLearn">Concepts covered</label>
            <input type="text" name="journalLearn" id="journalLearn" />
        </fieldset>
        <fieldset>
            <label for="journalEntry">Journal Entry</label>
            <textarea name="journalEntry" id="journalEntry" cols="30" rows="5"></textarea>
        </fieldset>
        <fieldset>
            <label for="journalMood">Mood for the day</label>
            <select name="journalMood" id="journalMood">
                <option value="frustrated">frustrated</option>
                <option value="sad">sad</option>
                <option value="happy">happy</option>
                <option value="anxious">anxious</option>
                <option value="furious">furious</option>
            </select>
        </fieldset>
        <button id="postEntry">Record Journal Entry</button>
    </form>`;
};