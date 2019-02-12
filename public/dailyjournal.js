(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
Author: Panya
Intent: all contacts with the json server
*/
const API = {
  get: () => {
    // this is a method defined on the API object
    return fetch("http://localhost:8081/entries") // fetch from the JSON
    .then(entries => entries.json()); // parse AS json
  },
  create: newJournalEntry => {
    return fetch("http://localhost:8081/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newJournalEntry)
    }).then(entries => entries.json()); // parse AS json
  },
  delete: itemId => {
    return fetch(`http://127.0.0.1:8081/entries/${itemId}`, {
      method: "DELETE"
    });
  },
  edit: (journalEntryObject, itemId) => {
    return fetch(`http://127.0.0.1:8088/contacts/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(journalEntryObject)
    }).then(entries => entries.json()); // parse AS json
  }
};
var _default = API;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formComponent = _interopRequireDefault(require("./formComponent"));

var _entryComponent = _interopRequireDefault(require("./entryComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Intent: responsible for modifying the DOM
*/
const renderDOM = {
  createEntries: entries => {
    let HTMLsquirt = ""; // reverse the array so most recent is at top
    // add a sorting function in case the entries aren't in data order in database?

    entries.reverse().forEach(entry => {
      // run each entry through factory method
      HTMLsquirt += _entryComponent.default.createSingleEntry(entry);
    }); // add it to DOM

    document.querySelector("#displayEntries").innerHTML = HTMLsquirt;
  },
  renderFormElement: () => {
    document.querySelector("#displayForm").innerHTML = (0, _formComponent.default)();
  }
};
var _default = renderDOM;
exports.default = _default;

},{"./entryComponent":3,"./formComponent":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
Author: Panya
Intent:  responsible for creating the journal entry HTML component
*/
const makeEntries = {
  createSingleEntry: journalEntry => {
    return `<header>${journalEntry.concepts}</header>
        <span class="date">${journalEntry.date}</span>
        <section class="entry">
            <p>${journalEntry.entry}</p>
            <p>Mood: ${journalEntry.mood}</p>
        </section>
        `;
  }
};
var _default = makeEntries;
exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var _default = createJournalEntry;
exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = _interopRequireDefault(require("./data"));

var _entriesDOM = _interopRequireDefault(require("./entriesDOM"));

var _entryFactory = _interopRequireDefault(require("./entryFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Intent: object with event listeners
*/
const listeners = {
  entryListener: () => {
    const journalForm = document.querySelector("#postEntry"); // what happens when we click the 'post' button?

    journalForm.addEventListener("click", () => {
      // collect entry data from the form
      const entryDate = document.querySelector("#journalDate").value;
      const entryHeader = document.querySelector("#journalLearn").value;
      const entryFull = document.querySelector("#journalEntry").value;
      const entryMood = document.querySelector("#journalMood").value; // construct entry object with factory function

      const newJournalEntry = (0, _entryFactory.default)(entryDate, entryHeader, entryFull, entryMood); // add the new object to the database

      _data.default.create(newJournalEntry);
    });
  },
  moodListener: () => {
    // get the list of all moods in an array
    const moodSwitchList = document.getElementsByName("moodSwitch"); // iterate over that array

    moodSwitchList.forEach(element => {
      // add an event listener to each radio button
      element.addEventListener("click", event => {
        // get the mood of the clicked button
        const mood = event.target.value; // grab all the entries from the database

        _data.default.get().then(journalEntries => {
          // match the clicked mood to the mood value of a given entry
          const moodEntries = journalEntries.filter(entries => entries.mood === mood); // if none match do this

          if (moodEntries.length === 0) {
            document.querySelector("#displayEntries").innerHTML = "no entries found with that mood";
          } else {
            // otherwise use the factory function to put them on the dom
            _entriesDOM.default.createEntries(moodEntries);
          }
        });
      });
    });
  },
  searchListener: () => {
    // listen for keypresses in the search field
    document.querySelector("#searchjournal").addEventListener("keypress", event => {
      // store the data in the search field
      const searchTerm = event.target.value; // create a blank array for entries

      let returnedEntries = []; // grab all the entries from the database

      _data.default.get().then(journalEntries => {
        // iterate over all the values from the database
        for (const value of Object.values(journalEntries)) {
          // find the search term in the entry values of the database
          if (value.entry.includes(searchTerm)) {
            // push those into that blank array
            returnedEntries.push(value);
          }
        } // use the factory function to put them on the dom


        _entriesDOM.default.createEntries(returnedEntries);
      });
    });
  }
};
var _default = listeners;
exports.default = _default;

},{"./data":1,"./entriesDOM":2,"./entryFactory":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
Author: Panya
Intent:  responsible for creating the entry form HTML component
*/
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
                <option value="happy">happy</option>
                <option value="not yet">not YET</option>
                <option value="frustrated">frustrated</option>
                <option value="sad">sad</option>
                <option value="anxious">anxious</option>
                <option value="furious">furious</option>
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

var _default = makeJournalFormComponent;
exports.default = _default;

},{}],7:[function(require,module,exports){
"use strict";

var _data = _interopRequireDefault(require("./data"));

var _entriesDOM = _interopRequireDefault(require("./entriesDOM"));

var _eventListeners = _interopRequireDefault(require("./eventListeners"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.
_data.default.get().then(journalEntries => _entriesDOM.default.createEntries(journalEntries));

_entriesDOM.default.renderFormElement();

_eventListeners.default.entryListener();

_eventListeners.default.moodListener();

_eventListeners.default.searchListener();

},{"./data":1,"./entriesDOM":2,"./eventListeners":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNET00uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9lbnRyeUZhY3RvcnkuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtQ29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOzs7O0FBS0EsTUFBTSxHQUFHLEdBQUc7QUFDUixFQUFBLEdBQUcsRUFBRSxNQUFNO0FBQUU7QUFDVCxXQUFPLEtBQUssQ0FBQywrQkFBRCxDQUFMLENBQXVDO0FBQXZDLEtBQ0YsSUFERSxDQUNHLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBUixFQURkLENBQVAsQ0FETyxDQUUrQjtBQUN6QyxHQUpPO0FBS1IsRUFBQSxNQUFNLEVBQUUsZUFBZSxJQUFJO0FBQ3ZCLFdBQU8sS0FBSyxDQUFDLCtCQUFELEVBQWlDO0FBQ3pDLE1BQUEsTUFBTSxFQUFFLE1BRGlDO0FBRXpDLE1BQUEsT0FBTyxFQUFFO0FBQ0wsd0JBQWdCO0FBRFgsT0FGZ0M7QUFLekMsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxlQUFmO0FBTG1DLEtBQWpDLENBQUwsQ0FPRixJQVBFLENBT0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBUGQsQ0FBUCxDQUR1QixDQVFlO0FBQ3pDLEdBZE87QUFlUixFQUFBLE1BQU0sRUFBRSxNQUFNLElBQUk7QUFDZCxXQUFPLEtBQUssQ0FBRSxpQ0FBZ0MsTUFBTyxFQUF6QyxFQUE0QztBQUNwRCxNQUFBLE1BQU0sRUFBRTtBQUQ0QyxLQUE1QyxDQUFaO0FBR0gsR0FuQk87QUFvQlIsRUFBQSxJQUFJLEVBQUUsQ0FBQyxrQkFBRCxFQUFxQixNQUFyQixLQUFnQztBQUNsQyxXQUFPLEtBQUssQ0FBRSxrQ0FBaUMsTUFBTyxFQUExQyxFQUE2QztBQUNyRCxNQUFBLE1BQU0sRUFBRSxLQUQ2QztBQUVyRCxNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRjRDO0FBS3JELE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsa0JBQWY7QUFMK0MsS0FBN0MsQ0FBTCxDQU9GLElBUEUsQ0FPRyxPQUFPLElBQUksT0FBTyxDQUFDLElBQVIsRUFQZCxDQUFQLENBRGtDLENBUUk7QUFDekM7QUE3Qk8sQ0FBWjtlQWdDZSxHOzs7Ozs7Ozs7OztBQ2hDZjs7QUFDQTs7OztBQU5BOzs7O0FBUUEsTUFBTSxTQUFTLEdBQUc7QUFDZCxFQUFBLGFBQWEsRUFBRSxPQUFPLElBQUk7QUFDdEIsUUFBSSxVQUFVLEdBQUcsRUFBakIsQ0FEc0IsQ0FFdEI7QUFDQTs7QUFDQSxJQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQWxCLENBQTBCLEtBQUssSUFBSTtBQUMvQjtBQUNBLE1BQUEsVUFBVSxJQUFJLHdCQUFZLGlCQUFaLENBQThCLEtBQTlCLENBQWQ7QUFDSCxLQUhELEVBSnNCLENBUXRCOztBQUNBLElBQUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsaUJBQXZCLEVBQTBDLFNBQTFDLEdBQXNELFVBQXREO0FBQ0gsR0FYYTtBQVlkLEVBQUEsaUJBQWlCLEVBQUUsTUFBTTtBQUNyQixJQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLGNBQXZCLEVBQXVDLFNBQXZDLEdBQW1ELDZCQUFuRDtBQUNIO0FBZGEsQ0FBbEI7ZUFpQmUsUzs7Ozs7Ozs7Ozs7QUN6QmY7Ozs7QUFLQSxNQUFNLFdBQVcsR0FBRztBQUNoQixFQUFBLGlCQUFpQixFQUFFLFlBQVksSUFBSTtBQUMvQixXQUFRLFdBQVUsWUFBWSxDQUFDLFFBQVM7NkJBQ25CLFlBQVksQ0FBQyxJQUFLOztpQkFFOUIsWUFBWSxDQUFDLEtBQU07dUJBQ2IsWUFBWSxDQUFDLElBQUs7O1NBSmpDO0FBT0g7QUFUZSxDQUFwQjtlQVllLFc7Ozs7Ozs7Ozs7O0FDakJmOzs7O0FBS0EsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQUQsRUFBWSxXQUFaLEVBQXlCLFNBQXpCLEVBQW9DLFNBQXBDLEtBQWtEO0FBQ3pFLFNBQU87QUFDSCxJQUFBLElBQUksRUFBRSxTQURIO0FBRUgsSUFBQSxRQUFRLEVBQUUsV0FGUDtBQUdILElBQUEsS0FBSyxFQUFFLFNBSEo7QUFJSCxJQUFBLElBQUksRUFBRTtBQUpILEdBQVA7QUFNSCxDQVBEOztlQVNlLGtCOzs7Ozs7Ozs7OztBQ1RmOztBQUNBOztBQUNBOzs7O0FBUEE7Ozs7QUFTQSxNQUFNLFNBQVMsR0FBRztBQUNkLEVBQUEsYUFBYSxFQUFFLE1BQU07QUFDakIsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBcEIsQ0FEaUIsQ0FFakI7O0FBQ0EsSUFBQSxXQUFXLENBQUMsZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsTUFBTTtBQUN4QztBQUNBLFlBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGNBQXZCLEVBQXVDLEtBQXpEO0FBQ0EsWUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0MsS0FBNUQ7QUFDQSxZQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixlQUF2QixFQUF3QyxLQUExRDtBQUNBLFlBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGNBQXZCLEVBQXVDLEtBQXpELENBTHdDLENBTXhDOztBQUNBLFlBQU0sZUFBZSxHQUFHLDJCQUFtQixTQUFuQixFQUE4QixXQUE5QixFQUEyQyxTQUEzQyxFQUFzRCxTQUF0RCxDQUF4QixDQVB3QyxDQVF4Qzs7QUFDQSxvQkFBSSxNQUFKLENBQVcsZUFBWDtBQUNILEtBVkQ7QUFXSCxHQWZhO0FBZ0JkLEVBQUEsWUFBWSxFQUFFLE1BQU07QUFDaEI7QUFDQSxVQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsaUJBQVQsQ0FBMkIsWUFBM0IsQ0FBdkIsQ0FGZ0IsQ0FHaEI7O0FBQ0EsSUFBQSxjQUFjLENBQUMsT0FBZixDQUF1QixPQUFPLElBQUk7QUFDOUI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxLQUFLLElBQUk7QUFDdkM7QUFDQSxjQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQTFCLENBRnVDLENBR3ZDOztBQUNBLHNCQUFJLEdBQUosR0FBVSxJQUFWLENBQ0ksY0FBYyxJQUFJO0FBQ2Q7QUFDQSxnQkFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEtBQWlCLElBQWxELENBQXBCLENBRmMsQ0FHZDs7QUFDQSxjQUFJLFdBQVcsQ0FBQyxNQUFaLEtBQXVCLENBQTNCLEVBQThCO0FBQzFCLFlBQUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsaUJBQXZCLEVBQTBDLFNBQTFDLEdBQXNELGlDQUF0RDtBQUNILFdBRkQsTUFFTztBQUNIO0FBQ0EsZ0NBQVUsYUFBVixDQUF3QixXQUF4QjtBQUNIO0FBQ0osU0FYTDtBQWFILE9BakJEO0FBa0JILEtBcEJEO0FBcUJILEdBekNhO0FBMENkLEVBQUEsY0FBYyxFQUFFLE1BQU07QUFDbEI7QUFDQSxJQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixFQUF5QyxnQkFBekMsQ0FBMEQsVUFBMUQsRUFBc0UsS0FBSyxJQUFJO0FBQzNFO0FBQ0EsWUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFoQyxDQUYyRSxDQUczRTs7QUFDQSxVQUFJLGVBQWUsR0FBRyxFQUF0QixDQUoyRSxDQUszRTs7QUFDQSxvQkFBSSxHQUFKLEdBQVUsSUFBVixDQUNJLGNBQWMsSUFBSTtBQUNkO0FBQ0EsYUFBSyxNQUFNLEtBQVgsSUFBb0IsTUFBTSxDQUFDLE1BQVAsQ0FBYyxjQUFkLENBQXBCLEVBQW1EO0FBQy9DO0FBQ0EsY0FBSSxLQUFLLENBQUMsS0FBTixDQUFZLFFBQVosQ0FBcUIsVUFBckIsQ0FBSixFQUFzQztBQUNsQztBQUNBLFlBQUEsZUFBZSxDQUFDLElBQWhCLENBQXFCLEtBQXJCO0FBQ0g7QUFDSixTQVJhLENBU2Q7OztBQUNBLDRCQUFVLGFBQVYsQ0FBd0IsZUFBeEI7QUFDSCxPQVpMO0FBY0gsS0FwQkQ7QUFxQkg7QUFqRWEsQ0FBbEI7ZUFvRWUsUzs7Ozs7Ozs7Ozs7QUM3RWY7Ozs7QUFJQSxNQUFNLHdCQUF3QixHQUFHLE1BQU07QUFDbkM7QUFDQSxTQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBQVI7QUE0Q0gsQ0E5Q0Q7O2VBZ0RlLHdCOzs7Ozs7QUNqRGY7O0FBQ0E7O0FBQ0E7Ozs7QUFMQTtBQUNBO0FBTUEsY0FBSSxHQUFKLEdBQVUsSUFBVixDQUFlLGNBQWMsSUFBSSxvQkFBVSxhQUFWLENBQXdCLGNBQXhCLENBQWpDOztBQUVBLG9CQUFVLGlCQUFWOztBQUNBLHdCQUFVLGFBQVY7O0FBQ0Esd0JBQVUsWUFBVjs7QUFDQSx3QkFBVSxjQUFWIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogYWxsIGNvbnRhY3RzIHdpdGggdGhlIGpzb24gc2VydmVyXG4qL1xuXG5jb25zdCBBUEkgPSB7XG4gICAgZ2V0OiAoKSA9PiB7IC8vIHRoaXMgaXMgYSBtZXRob2QgZGVmaW5lZCBvbiB0aGUgQVBJIG9iamVjdFxuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODEvZW50cmllc1wiKSAvLyBmZXRjaCBmcm9tIHRoZSBKU09OXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTsgLy8gcGFyc2UgQVMganNvblxuICAgIH0sXG4gICAgY3JlYXRlOiBuZXdKb3VybmFsRW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODEvZW50cmllc1wiLHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShuZXdKb3VybmFsRW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTsgLy8gcGFyc2UgQVMganNvblxuICAgIH0sXG4gICAgZGVsZXRlOiBpdGVtSWQgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4MS9lbnRyaWVzLyR7aXRlbUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGVkaXQ6IChqb3VybmFsRW50cnlPYmplY3QsIGl0ZW1JZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC9jb250YWN0cy8ke2l0ZW1JZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqb3VybmFsRW50cnlPYmplY3QpXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTsgLy8gcGFyc2UgQVMganNvblxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFQSTsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiByZXNwb25zaWJsZSBmb3IgbW9kaWZ5aW5nIHRoZSBET01cbiovXG5cbmltcG9ydCBtYWtlSm91cm5hbEZvcm1Db21wb25lbnQgZnJvbSBcIi4vZm9ybUNvbXBvbmVudFwiO1xuaW1wb3J0IG1ha2VFbnRyaWVzIGZyb20gXCIuL2VudHJ5Q29tcG9uZW50XCI7XG5cbmNvbnN0IHJlbmRlckRPTSA9IHtcbiAgICBjcmVhdGVFbnRyaWVzOiBlbnRyaWVzID0+IHtcbiAgICAgICAgbGV0IEhUTUxzcXVpcnQgPSBcIlwiO1xuICAgICAgICAvLyByZXZlcnNlIHRoZSBhcnJheSBzbyBtb3N0IHJlY2VudCBpcyBhdCB0b3BcbiAgICAgICAgLy8gYWRkIGEgc29ydGluZyBmdW5jdGlvbiBpbiBjYXNlIHRoZSBlbnRyaWVzIGFyZW4ndCBpbiBkYXRhIG9yZGVyIGluIGRhdGFiYXNlP1xuICAgICAgICBlbnRyaWVzLnJldmVyc2UoKS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgIC8vIHJ1biBlYWNoIGVudHJ5IHRocm91Z2ggZmFjdG9yeSBtZXRob2RcbiAgICAgICAgICAgIEhUTUxzcXVpcnQgKz0gbWFrZUVudHJpZXMuY3JlYXRlU2luZ2xlRW50cnkoZW50cnkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gYWRkIGl0IHRvIERPTVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rpc3BsYXlFbnRyaWVzXCIpLmlubmVySFRNTCA9IEhUTUxzcXVpcnQ7XG4gICAgfSxcbiAgICByZW5kZXJGb3JtRWxlbWVudDogKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rpc3BsYXlGb3JtXCIpLmlubmVySFRNTCA9IG1ha2VKb3VybmFsRm9ybUNvbXBvbmVudCgpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlbmRlckRPTTsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiAgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBqb3VybmFsIGVudHJ5IEhUTUwgY29tcG9uZW50XG4qL1xuXG5jb25zdCBtYWtlRW50cmllcyA9IHtcbiAgICBjcmVhdGVTaW5nbGVFbnRyeTogam91cm5hbEVudHJ5ID0+IHtcbiAgICAgICAgcmV0dXJuIGA8aGVhZGVyPiR7am91cm5hbEVudHJ5LmNvbmNlcHRzfTwvaGVhZGVyPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImRhdGVcIj4ke2pvdXJuYWxFbnRyeS5kYXRlfTwvc3Bhbj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJlbnRyeVwiPlxuICAgICAgICAgICAgPHA+JHtqb3VybmFsRW50cnkuZW50cnl9PC9wPlxuICAgICAgICAgICAgPHA+TW9vZDogJHtqb3VybmFsRW50cnkubW9vZH08L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgYDtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYWtlRW50cmllczsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBlbnRyeSBvYmplY3RcbiovXG5cbmNvbnN0IGNyZWF0ZUpvdXJuYWxFbnRyeSA9IChlbnRyeURhdGUsIGVudHJ5SGVhZGVyLCBlbnRyeUZ1bGwsIGVudHJ5TW9vZCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGRhdGU6IGVudHJ5RGF0ZSxcbiAgICAgICAgY29uY2VwdHM6IGVudHJ5SGVhZGVyLFxuICAgICAgICBlbnRyeTogZW50cnlGdWxsLFxuICAgICAgICBtb29kOiBlbnRyeU1vb2RcbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSm91cm5hbEVudHJ5OyIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6IG9iamVjdCB3aXRoIGV2ZW50IGxpc3RlbmVyc1xuKi9cblxuaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCI7XG5pbXBvcnQgcmVuZGVyRE9NIGZyb20gXCIuL2VudHJpZXNET01cIjtcbmltcG9ydCBjcmVhdGVKb3VybmFsRW50cnkgZnJvbSBcIi4vZW50cnlGYWN0b3J5XCI7XG5cbmNvbnN0IGxpc3RlbmVycyA9IHtcbiAgICBlbnRyeUxpc3RlbmVyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGpvdXJuYWxGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3N0RW50cnlcIik7XG4gICAgICAgIC8vIHdoYXQgaGFwcGVucyB3aGVuIHdlIGNsaWNrIHRoZSAncG9zdCcgYnV0dG9uP1xuICAgICAgICBqb3VybmFsRm9ybS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gY29sbGVjdCBlbnRyeSBkYXRhIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgIGNvbnN0IGVudHJ5RGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbERhdGVcIikudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBlbnRyeUhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbExlYXJuXCIpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW50cnlGdWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRW50cnlcIikudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBlbnRyeU1vb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxNb29kXCIpLnZhbHVlO1xuICAgICAgICAgICAgLy8gY29uc3RydWN0IGVudHJ5IG9iamVjdCB3aXRoIGZhY3RvcnkgZnVuY3Rpb25cbiAgICAgICAgICAgIGNvbnN0IG5ld0pvdXJuYWxFbnRyeSA9IGNyZWF0ZUpvdXJuYWxFbnRyeShlbnRyeURhdGUsIGVudHJ5SGVhZGVyLCBlbnRyeUZ1bGwsIGVudHJ5TW9vZCk7XG4gICAgICAgICAgICAvLyBhZGQgdGhlIG5ldyBvYmplY3QgdG8gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICBBUEkuY3JlYXRlKG5ld0pvdXJuYWxFbnRyeSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbW9vZExpc3RlbmVyOiAoKSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgbGlzdCBvZiBhbGwgbW9vZHMgaW4gYW4gYXJyYXlcbiAgICAgICAgY29uc3QgbW9vZFN3aXRjaExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcIm1vb2RTd2l0Y2hcIik7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGF0IGFycmF5XG4gICAgICAgIG1vb2RTd2l0Y2hMaXN0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCByYWRpbyBidXR0b25cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIG1vb2Qgb2YgdGhlIGNsaWNrZWQgYnV0dG9uXG4gICAgICAgICAgICAgICAgY29uc3QgbW9vZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBncmFiIGFsbCB0aGUgZW50cmllcyBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgIEFQSS5nZXQoKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICBqb3VybmFsRW50cmllcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCB0aGUgY2xpY2tlZCBtb29kIHRvIHRoZSBtb29kIHZhbHVlIG9mIGEgZ2l2ZW4gZW50cnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vb2RFbnRyaWVzID0gam91cm5hbEVudHJpZXMuZmlsdGVyKGVudHJpZXMgPT4gZW50cmllcy5tb29kID09PSBtb29kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vbmUgbWF0Y2ggZG8gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vb2RFbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlzcGxheUVudHJpZXNcIikuaW5uZXJIVE1MID0gXCJubyBlbnRyaWVzIGZvdW5kIHdpdGggdGhhdCBtb29kXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSB1c2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gdG8gcHV0IHRoZW0gb24gdGhlIGRvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckRPTS5jcmVhdGVFbnRyaWVzKG1vb2RFbnRyaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZWFyY2hMaXN0ZW5lcjogKCkgPT4ge1xuICAgICAgICAvLyBsaXN0ZW4gZm9yIGtleXByZXNzZXMgaW4gdGhlIHNlYXJjaCBmaWVsZFxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlYXJjaGpvdXJuYWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBkYXRhIGluIHRoZSBzZWFyY2ggZmllbGRcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBibGFuayBhcnJheSBmb3IgZW50cmllc1xuICAgICAgICAgICAgbGV0IHJldHVybmVkRW50cmllcyA9IFtdO1xuICAgICAgICAgICAgLy8gZ3JhYiBhbGwgdGhlIGVudHJpZXMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgIEFQSS5nZXQoKS50aGVuKFxuICAgICAgICAgICAgICAgIGpvdXJuYWxFbnRyaWVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCB0aGUgdmFsdWVzIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgT2JqZWN0LnZhbHVlcyhqb3VybmFsRW50cmllcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIHNlYXJjaCB0ZXJtIGluIHRoZSBlbnRyeSB2YWx1ZXMgb2YgdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZW50cnkuaW5jbHVkZXMoc2VhcmNoVGVybSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIHRob3NlIGludG8gdGhhdCBibGFuayBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybmVkRW50cmllcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gdG8gcHV0IHRoZW0gb24gdGhlIGRvbVxuICAgICAgICAgICAgICAgICAgICByZW5kZXJET00uY3JlYXRlRW50cmllcyhyZXR1cm5lZEVudHJpZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RlbmVyczsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiAgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBlbnRyeSBmb3JtIEhUTUwgY29tcG9uZW50XG4qL1xuY29uc3QgbWFrZUpvdXJuYWxGb3JtQ29tcG9uZW50ID0gKCkgPT4ge1xuICAgIC8vIENyZWF0ZSBIVE1MIHN0cnVjdHVyZSBmb3IgdGhlIGVudHJ5IGZvcm1cbiAgICByZXR1cm4gYDxmb3JtIGFjdGlvbj1cIlwiIGlkPVwiam91cm5hbEZvcm1cIj5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxEYXRlXCI+RGF0ZSBvZiBFbnRyeTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBuYW1lPVwiam91cm5hbERhdGVcIiBpZD1cImpvdXJuYWxEYXRlXCIgcmVxdWlyZWQgLz5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxMZWFyblwiPkNvbmNlcHRzIGNvdmVyZWQ8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImpvdXJuYWxMZWFyblwiIGlkPVwiam91cm5hbExlYXJuXCIgcmVxdWlyZWQgLz5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxFbnRyeVwiPkpvdXJuYWwgRW50cnk8L2xhYmVsPlxuICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJqb3VybmFsRW50cnlcIiBpZD1cImpvdXJuYWxFbnRyeVwiIGNvbHM9XCIzMFwiIHJvd3M9XCI1XCIgcmVxdWlyZWQ+PC90ZXh0YXJlYT5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxNb29kXCI+TW9vZCBmb3IgdGhlIGRheTwvbGFiZWw+XG4gICAgICAgICAgICA8c2VsZWN0IG5hbWU9XCJqb3VybmFsTW9vZFwiIGlkPVwiam91cm5hbE1vb2RcIiByZXF1aXJlZD5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+Q2hvb3NlIGEgbW9vZCAuLi4gPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImhhcHB5XCI+aGFwcHk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibm90IHlldFwiPm5vdCBZRVQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZnJ1c3RyYXRlZFwiPmZydXN0cmF0ZWQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2FkXCI+c2FkPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImFueGlvdXNcIj5hbnhpb3VzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImZ1cmlvdXNcIj5mdXJpb3VzPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInBvc3RFbnRyeVwiPlJlY29yZCBKb3VybmFsIEVudHJ5PC9idXR0b24+XG4gICAgICAgIDxkaXYgaWQ9XCJleHRyYXNcIj5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGVnZW5kPkZpbHRlciBqb3VybmFsIGVudHJpZXMgYnkgbW9vZDwvbGVnZW5kPlxuICAgICAgICAgICAgPGRpdiBpZD1cInJhZGlvQnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJoYXBweVwiPmhhcHB5PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kU3dpdGNoXCIgdmFsdWU9XCJoYXBweVwiIC8+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibm90IHlldFwiPm5vdCB5ZXQ8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RTd2l0Y2hcIiB2YWx1ZT1cIm5vdCB5ZXRcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZydXN0cmF0ZWRcIj5mcnVzdHJhdGVkPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kU3dpdGNoXCIgdmFsdWU9XCJmcnVzdHJhdGVkXCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzYWRcIj5zYWQ8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RTd2l0Y2hcIiB2YWx1ZT1cInNhZFwiIC8+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYW54aW91c1wiPmFueGlvdXM8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RTd2l0Y2hcIiB2YWx1ZT1cImFueGlvdXNcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZ1cmlvdXNcIj5mdXJpb3VzPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kU3dpdGNoXCIgdmFsdWU9XCJmdXJpb3VzXCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JcInNlYXJjaGpvdXJuYWxcIj5zZWFyY2g6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2VhcmNoam91cm5hbFwiIGlkPVwic2VhcmNoam91cm5hbFwiIC8+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZGl2PlxuICAgIDwvZm9ybT5gO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFrZUpvdXJuYWxGb3JtQ29tcG9uZW50OyIsIi8vICBNYWluIGFwcGxpY2F0aW9uIGxvZ2ljIHRoYXQgdXNlcyB0aGUgZnVuY3Rpb25zIGFuZCBvYmplY3RzXG4vLyAgZGVmaW5lZCBpbiB0aGUgb3RoZXIgSmF2YVNjcmlwdCBmaWxlcy5cblxuaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCI7XG5pbXBvcnQgcmVuZGVyRE9NIGZyb20gXCIuL2VudHJpZXNET01cIjtcbmltcG9ydCBsaXN0ZW5lcnMgZnJvbSBcIi4vZXZlbnRMaXN0ZW5lcnNcIjtcblxuQVBJLmdldCgpLnRoZW4oam91cm5hbEVudHJpZXMgPT4gcmVuZGVyRE9NLmNyZWF0ZUVudHJpZXMoam91cm5hbEVudHJpZXMpKTtcblxucmVuZGVyRE9NLnJlbmRlckZvcm1FbGVtZW50KCk7XG5saXN0ZW5lcnMuZW50cnlMaXN0ZW5lcigpO1xubGlzdGVuZXJzLm1vb2RMaXN0ZW5lcigpO1xubGlzdGVuZXJzLnNlYXJjaExpc3RlbmVyKCk7Il19
