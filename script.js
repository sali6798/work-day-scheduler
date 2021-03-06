$(document).ready(function () {
    var schedule = {};
    var currentRow;

    // display the schedule for the day
    function displaySchedule() {
        $("textarea").each(function (i, element) {
            // gets the data-rowtime attr value (which is the time for that block)  
            // for the textarea
            var row = $(element).data("rowtime");
            // get the event for that time
            var event = schedule[row];
            // set the textarea value
            $(element).val(event);
            // remove all classes
            $(element).removeClass();
            // if the current hour is the same as 
            // the row (block time), add 'present' class
            if (moment().hour() === parseInt(row)) {
                $(element).addClass("present");
                currentRow = parseInt(row);
            }
            // if the current hour is greater (later) than the
            // row (block time), add 'past' class
            else if (moment().hour() > parseInt(row)) {
                $(element).addClass("past");
            }
            // all other time blocks add 'future' class
            else {
                $(element).addClass("future");
            }
        });
    }

    // add and save event to schedule when user clicks save
    function addEvent() {
        // gets the previous sibling element of the save button (the textarea)
        var textarea = $(this).prev();
        // gets data-rowtime attr, the time associated with the block
        var row = textarea.data("rowtime");
        // add user input (event) to schedule
        schedule[row] = textarea.val();

        // save schedule in localStorage
        localStorage.setItem("schedule", JSON.stringify(schedule));
        displaySchedule();
    }

    function clearSchedule() {
        localStorage.removeItem("schedule");
        schedule = {};
        displaySchedule();
    }

    // updates the present time block on the hour and clears the schedule
    // at the start of a new day (midnight)
    function updateTime() {
        if (moment().minute() === 0 && moment().second() === 0) {
            var currentHour = moment().hour();
            // only need to update timeblock classes (past, present, future)
            // from 9am to 5pm but needs to check at 6pm, so the 5pm
            // block will be changed to past
            if (currentHour >= 9 && currentHour <= 18) {
                displaySchedule();
            }
            // clear the schedule at midnight for the new day 
            // and update date at the top of the page
            if (currentHour === 0) {
                $("#currentDay").text(moment().format("dddd, MMMM Do"));
                clearSchedule();
            }
        }
    }

    // load schedule from local storage
    function init() {
        var savedSchedule = JSON.parse(localStorage.getItem("schedule"));
        if (savedSchedule !== null) {
            schedule = savedSchedule;
        }

        // displays current date at top of the page in format (Monday, March 16th)
        $("#currentDay").text(moment().format("dddd, MMMM Do"));

        // checks the time every second to see if
        // time block needs to be updated
        setInterval(updateTime, 1000);
        displaySchedule();

    }

    $(".saveBtn").click(addEvent);
    $("#clearBtn").click(clearSchedule);

    init();
});



