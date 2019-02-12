/*
Author: Panya
Intent: factory function that creates a new entry object
*/

const createJournalEntry = (entryDate, entryHeader, entryFull, entryMood) => {
    return {
        date: entryDate,
        concepts: entryHeader,
        entry: entryFull,
        mood: entryMood
    };
};

export default createJournalEntry;