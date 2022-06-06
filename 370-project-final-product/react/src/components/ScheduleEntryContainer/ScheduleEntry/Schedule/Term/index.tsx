// React imports
import React from "react";
import TimeField from "react-simple-timefield";

// Stylesheet import
import "./index.scss";

// Component imports
import Day from "./Day";
import ProgramContainer from "../../ProgramContainer";
import TimeScale from "./TimeScale"
import {TimeBlockRequirements} from "./TimeBlock";

interface TermProps {
    termTitle?: string;     // Title the term is given from the user

    // TODO - Currently not used; would detect what term the class is, but might not make it in.
    //  It's not as "essential" to any user story as expected, and would involve a lot of work
    //  to make it work. It *might* be in for the final product but no guarantee.
    termSeason?: string;
    programContainerRef: React.RefObject<ProgramContainer>; // The Ref of the ProgramContainer to add to
    toggleDisplayAddTermButton: any;        // Function callback to show the addTerm button
    starterData?: TimeBlockRequirements[];  // Optional starter data
    termID: number;              // ID of this term (0, 1, -> in order)
    HOSD_acceptTimeEvent: any;   // HigherOrder callback to add an event to the ScheduleEntryContainer
    HOSD_removeTimeEvent: any;   // HigherOrder callback to remove an event from the ScheduleEntryContainer
    HOSD_deleteTerm: any;        // HigherOrder callback to delete this term from the ScheduleEntryContainer
    HOSD_renameTerm: any;        // HigherOrder callback to rename this term
    deleted: boolean;  // Deleted self (in the Schedule)
}

interface TermState {
    currentTermTitle: string;    // User-modifiable term name
    editingLabel: boolean;       // Whether or not the user is editing the term name
    addingBlock: boolean;        // Whether or not the user is adding a custom time block
    temporaryName: string;       // A hidden buffer of sorts for the term name to be reset to
    receivedLabel: boolean;      // Whether or not the Term was given a name
    deleted: boolean;            // Whether or not the term is deleted

    // ["Fall", "Winter", "Spring", "Summer"], etc.
    termSeason: string;

    // In-progress information for a time-block that may be added.
    newBlockStartTime: string;
    newBlockEndTime: string;
    newBlockTitle: string;
    newBlockLocation: string;
    newBlockDays: {
        [key: string]: boolean;
    };

    // All the individual TimeBlocks in this Term
    timeBlocks: TimeBlockRequirements[];
}

class Term extends React.Component<TermProps, TermState> {

    /**
     * Constructor for a Term
     * @param props
     */
    constructor(props: TermProps) {
        super(props);

        this.state = {

            // NOTE. x = foo || bar is used to assign x to foo (IF IT IS NOT NULL), with bar as a default.

            currentTermTitle: this.props.termTitle || "Unlabelled Term",  // Arbitrary label
            temporaryName: this.props.termTitle || "Unlabelled Term",     // The name the user *might* relabel the term to
            editingLabel: !this.props.termTitle,    // Is the user editing the Term Label?

            // TODO - Should maybe switch this to a sort of Toggle/Select-from-list of terms
            termSeason: this.props.termSeason || "Unknown Term",

            timeBlocks: this.props.starterData || [],   // Was any starter data given?
            addingBlock: false,     // Is the user adding a Time Block?
            receivedLabel: !!this.props.termTitle,   // Has the user given a proper name yet?
            deleted: this.props.deleted,         // Has the user deleted the term?

            // Just assuming some default values to show the user what to enter
            newBlockStartTime: "12:00",
            newBlockEndTime: "12:50",
            newBlockTitle: "Event Title",
            newBlockLocation: "Event Location",
            newBlockDays: {
                "Sunday": false,
                "Monday": false,
                "Tuesday": false,
                "Wednesday": false,
                "Thursday": false,
                "Friday": false,
                "Saturday": false
            }
        };

        // If starter data was given, register it with the Program Container
        if (this.props.starterData)
            for (let i of this.state.timeBlocks) {
                this.programContainerAccept(i);
            }

        // Function bindings - Label Change
        this.handleTermLabelChange = this.handleTermLabelChange.bind(this);
        this.editLabelChange = this.editLabelChange.bind(this);


        // Function bindings - TimeBlock Adding
        this.resetNewTimeBlockData = this.resetNewTimeBlockData.bind(this);
        this.processAddBlock = this.processAddBlock.bind(this);

        // Receiving TimeBlock data. It's gross but this is where I learned how to do that.
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateDays = this.updateDays.bind(this);

        this.processCustomBlock = this.processCustomBlock.bind(this);
        this.toggleCustomAddingStatus = this.toggleCustomAddingStatus.bind(this);
        this.resetNewTimeBlockData();

        this.searcherAttemptReceive = this.searcherAttemptReceive.bind(this);
    }


    public isDeleted(): boolean {
        return this.state.deleted;
    }
    // Update the start time of an event that may be added
    private updateStartTime(event: any): void {
        event.preventDefault();
        this.setState({newBlockStartTime: event.target.value})
    }

    // Update the end time of an event that may be added
    private updateEndTime(event: any): void {
        event.preventDefault();
        this.setState({newBlockEndTime: event.target.value})
    }

    // Update the title of an event that may be added
    private updateTitle(event: any): void {
        event.preventDefault();
        this.setState({newBlockTitle: event.target.value})
    }

    // Update the location of an event that may be added
    private updateLocation(event: any): void {
        event.preventDefault();
        this.setState({newBlockLocation: event.target.value})
    }

    // Update the day selected/unselected
    private updateDays(event: any): void {

        let oldDays = this.state.newBlockDays;
        let name: string = event.target.name;
        oldDays[name] = event.target.checked;

        this.setState({newBlockDays: oldDays});
        // console.log(this.state.newBlockDays);
        // this.setState({newBlockDays: this.state.newBlockDays})
    }

    // Cancel adding the time block
    private resetNewTimeBlockData(): void {

        // Reset to some default placeholder values
        this.setState({
            addingBlock: false,

            newBlockStartTime: "12:00",
            newBlockEndTime: "12:50",
            newBlockTitle: "",
            newBlockLocation: "",

            newBlockDays: {
                "Sunday": false,
                "Monday": false,
                "Tuesday": false,
                "Wednesday": false,
                "Thursday": false,
                "Friday": false,
                "Saturday": false
            }
        })
    }

    /**
     * Determine whether or not a given TimeBlock can be added to this Term with conflict
     * @param timeBlock The timeBlock to validate
     */
    public canAccept(timeBlock: TimeBlockRequirements): boolean {
        // Ensure at least one day has been selected
        let found: boolean = false;
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (let day of daysOfWeek) {
            if (timeBlock.days.includes(day)) found = true;
        }

        // No days selected
        if (!found) {
            console.log("Cannot accept a new Time Block: there are no days selected!");
            return false
        }

        // Ensure there is a title
        if (timeBlock.title.trim() === "") {
            console.log("No title, cannot add!");
            return false;
        }

        // Ensure the time is forward-sequential
        if (timeBlock.startTime > timeBlock.endTime) {
            console.log("Start time is after end time! Can't accept new time block");
            return false;
        }

        let modifiedEvents: TimeBlockRequirements[] = this.state.timeBlocks;
        let newBlockDays = timeBlock.days;

        // Ensure there is no overlap
        // TODO - Possibly support overlapping times. Unlikely.
        // Check every stored event
        for (let event of modifiedEvents) {
            // Check every day of this event
            for (let eventDay of event.days) {
                //console.log(this.state.newBlockDays);
                // If this event is on that day
                if (newBlockDays.includes(eventDay)) {

                    //console.log("Event on this day");
                    //console.log(event.startTime);
                    //console.log(this.state.newBlockStartTime);

                    if ((event.startTime <= timeBlock.startTime && timeBlock.startTime <= event.endTime)
                        ||
                        ((event.startTime <= timeBlock.endTime && timeBlock.endTime <= event.endTime))
                         ||
                        ((timeBlock.startTime <= event.startTime && event.endTime <= timeBlock.endTime)))
                    {
                        console.log("Failed to accept new time event due to overlapping times.");
                        // TODO - Add an error message window and update this here
                        return false;
                    }
                }
            }
        } return true;
    }

    /**
     * Add the the TimeBlock to all the relevant areas: ProgramContainer, Term, HigherOrder container
     * @param timeBlock the TimeBlock to add
     */
    private processAddBlock(timeBlock: TimeBlockRequirements): void {

        // (Re)-Validate here, just in case it wasn't before calling this
        if (this.canAccept(timeBlock)) {
            this.termAccept(timeBlock);
            this.programContainerAccept(timeBlock);
            this.props.HOSD_acceptTimeEvent(timeBlock, this.props.termID);
        }
    }

    /**
     * Accept a (assumed valid) timeBlock into the Term
     * @param newTimeBlock
     */
    public termAccept(newTimeBlock: TimeBlockRequirements) {

        let modifiedEvents: TimeBlockRequirements[] = this.state.timeBlocks;
        modifiedEvents.push(newTimeBlock);

        // Sort so that the times in the list are all sequential
        modifiedEvents.sort((a, b) => a.startTime - b.startTime);
        this.setState({timeBlocks : modifiedEvents, addingBlock: false});
        this.resetNewTimeBlockData();
    }

    /**
     * Get the title of the current Term
     */
    public getTitle(): string {
        return this.state.currentTermTitle;
    }

    /**
     * Handle the label change of a term
     * @param event
     */
    private handleTermLabelChange(event: any): void {
        event.preventDefault();
        let value = event.target.value.trim();

        // Real text currently entered, maintain the temporary name
        if (value !== "")
            this.setState({
                temporaryName: value
            });
        // Only whitespace currently, reset temporary
        else
            this.setState({
                temporaryName: this.state.currentTermTitle
            });
    }

    /**
     * Change the editing state of the Term
     * @param event
     */
    private editLabelChange(event: any): void {
        event.preventDefault();
        if (this.state.editingLabel) {
            this.setState({currentTermTitle: this.state.temporaryName});
            this.props.HOSD_renameTerm(this.props.termID, this.state.temporaryName);
        }

        if (!this.state.receivedLabel)
            this.props.toggleDisplayAddTermButton();
        this.setState({editingLabel: !this.state.editingLabel, receivedLabel: true});
    }

    /**
     * Delete a TimeBlock from this term
     * @param id the ID of the timeBlock
     */
    private deleteTimeBlock(id: number): void {
        this.programContainerRemove(this.state.timeBlocks[id]);
        this.props.HOSD_removeTimeEvent(this.state.timeBlocks[id], this.props.termID);
        this.setState({timeBlocks: this.state.timeBlocks.filter((t, idx) => (idx !== id))})
    }

    /**
     * Send the given class to the Program Container for validation
     * @param className the Class to add
     */
    private programContainerAccept(className: TimeBlockRequirements): void {
        let container = this.props.programContainerRef.current;
        if (container)
            container.acceptClass(className);
    }

    /**
     * Remove the given class from the Program Container to invalidate it
     * @param className the Class to remove
     */
    private programContainerRemove(className: TimeBlockRequirements): void {
        let container = this.props.programContainerRef.current;
        if (container)
            container.removeClass(className);
    }

    /**
     * Toggle whether or not to display the panel for adding a custom time block
     */
    public toggleCustomAddingStatus(): void {
        this.setState({addingBlock: !this.state.addingBlock})
    }
    /**
     * Delete the Term from which this is called
     */
    private deleteSelf(): void {
        this.setState({deleted: true});
        this.props.HOSD_deleteTerm(this.props.termID);

        // Delete all classes in this term
        let container = this.props.programContainerRef.current;
        if (container)
            container.removeClassList(this.state.timeBlocks);
    }


    /**
     * Convert an array of days to a more minimal format
     * @param days ["Monday", "Wednesday", ...]
     */
    private toMinimalDayFormat(days: string[]): string {
        let dayMap: {[key: string]: string} = {
            "Sunday": "Su",
            "Monday": "M",
            "Tuesday": "T",
            "Wednesday": "W",
            "Thursday": "R",
            "Friday": "F",
            "Saturday": "Sa"
        };

        return days.map((day) => (dayMap[day])).join("");
    }

    /**
     * Called from the Class Searcher, it adds a class *from* the searcher to the term.
     * @param className the class to add.
     */
    public searcherAttemptReceive(className: TimeBlockRequirements) {
        if (this.canAccept(className))
            this.processAddBlock(className);
    }

    /**
     * Try to process and accept a custom timeBlock from user input.
     */
    public processCustomBlock(event: any): void {
        event.preventDefault();

        // Now we can add the timeBlock
        let newTimeBlock = {
            startTime: parseInt(this.state.newBlockStartTime.split(":").join("")),
            endTime: parseInt(this.state.newBlockEndTime.split(":").join("")),
            days: Object.keys(this.state.newBlockDays).filter((day) => (this.state.newBlockDays[day])),
            title: this.state.newBlockTitle,
            location: this.state.newBlockLocation,
        };

        if (this.canAccept(newTimeBlock))
            this.processAddBlock(newTimeBlock);
    }

    render() {

        // Generate days for Term from list
        let dayStart: number = 730;
        let twentyFourHour: boolean = false;


        let daysOfWeek : string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let days = daysOfWeek.map((day) => (
            <Day
                timeEvents={this.state.timeBlocks.filter((event) => (event.days.includes(day)))}
                day={day}
                dayStart={dayStart}
            />)
        );

        return (

            !this.state.deleted ?
            <div className={"termContainer"}>

                <div className={"termModifier"}>

                    {/** The form to change the name of the term. **/}
                    {this.state.editingLabel || !this.state.receivedLabel ?
                        <form
                            className={"termLabelForm"}
                            onSubmit={(e) => this.editLabelChange(e)}
                        >
                            <label className={"newTermTitle"}>Term Name:&nbsp;
                                <input
                                    type={"text"}
                                    placeholder={this.state.currentTermTitle}
                                    maxLength={32}
                                    onChange={(e) => this.handleTermLabelChange(e)}
                                />
                            </label>
                        </form>: <p className={"termTitle"}>{this.state.currentTermTitle}</p>
                    }

                    {/** The button to toggle renaming the term **/}
                    {this.state.addingBlock ? null : // Don't show if adding a block
                        <button
                            onClick={this.editLabelChange}
                            className={"editLabelButton"}
                        >
                            {this.state.editingLabel || !this.state.receivedLabel ? "Save New Label" : "Edit Label"}
                        </button>
                    }

                    {/** The form to add a Time Block **/}
                    {this.state.addingBlock ?

                        <form className={"addingBlockForm"}>

                            {/* The Title */}
                            <label className={"newTitle"}>Event Title:&nbsp;
                                <input
                                    type={"text"}
                                    placeholder={this.state.newBlockTitle}
                                    maxLength={32}
                                    onChange={this.updateTitle}
                                />
                            </label>

                            {/* The start time */}
                            <label className={"newStart"}>Start Time:&nbsp;
                                <TimeField
                                    value={this.state.newBlockStartTime}
                                    onChange={this.updateStartTime}
                                />
                            </label>

                            {/* The end time */}
                            <label className={"newEnd"}>End Time:&nbsp;
                                <TimeField
                                    value={this.state.newBlockEndTime}
                                    onChange={this.updateEndTime}
                                />
                            </label>

                            {/* The location */}
                            <label className={"newLocation"}>Location:&nbsp;
                                <input
                                    type={"text"}
                                    placeholder={this.state.newBlockLocation}
                                    maxLength={32}
                                    onChange={this.updateLocation}
                                />
                            </label>

                            {/*  Days */}
                            <label className={"days"}>Days:&nbsp;
                                {
                                    daysOfWeek.map((day: string) => (
                                        <label>
                                            <input
                                                type={"checkbox"}
                                                value={day}
                                                name={day}
                                                checked={this.state.newBlockDays[day]}
                                                onChange={this.updateDays}
                                            />{day.substr(0, 3)}&nbsp;
                                        </label>
                                    ))
                                }
                            </label>


                            {/* Cancel Button */}
                            <button onClick={event => this.processCustomBlock(event)}>Submit Block</button>
                        </form> : null
                    }

                    {/* Submit TimeBlock, Cancel, or Delete Term Buttons */}
                    { this.state.editingLabel ? null :

                        // Show the Add Time Block / Delete Term Buttons if not editing anything
                        <div className={"rightHandButtons"}>

                            {this.state.receivedLabel ?
                            <button
                                className={this.state.addingBlock ? "submit" : ""}
                                onClick={this.state.addingBlock ? this.resetNewTimeBlockData : this.toggleCustomAddingStatus}
                            >
                                {this.state.addingBlock ? "Cancel" : "Add Time Block" }
                            </button> : null }

                            {/* Show the Delete Term button if not adding anything */}
                            { this.state.addingBlock ? null :
                                <button
                                    className={"delete"}
                                    onClick={() => this.deleteSelf()}
                                >Delete Term</button>
                            }
                        </div>
                    }
                </div>


                {/* Days in the term */}
                {this.state.receivedLabel ?
                    <div className={"mainTermContent"}>
                        {/* Times on left-hand side of screen */}
                        <TimeScale
                            dayStart={dayStart}
                            twentyFourHour={twentyFourHour}
                        />
                        <div className={"mainDayContainer"}>
                            {days}
                        </div>

                        <div className={"timeBlocks"}>
                        {this.state.timeBlocks.length ? <p className={"timeBlockList"}>Time Blocks</p> : null}
                    {this.state.timeBlocks.map((timeBlock, index) => (
                        <div className={"minimalTimeBlock"}>
                            <hr />
                            <p className={"minimalTitle"}>{timeBlock.title}</p>
                            <div className={"extraDetails"}>
                                <p className={"minimalDays"}>Days: {this.toMinimalDayFormat(timeBlock.days)}</p>
                                <p>Time: {timeBlock.startTime}-{timeBlock.endTime}</p>
                                <p className={"minimalLocation"}>{timeBlock.location}</p>
                                <button className={"delete"} onClick={() => this.deleteTimeBlock(index)}>Delete</button>
                            </div>
                        </div>
                    ))}

                </div>
                    </div> : null }

            </div> : null
        )
    }

}

export default Term;