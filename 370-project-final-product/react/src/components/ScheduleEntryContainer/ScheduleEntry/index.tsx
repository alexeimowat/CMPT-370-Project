// React imports
import React, {ReactElement, Ref, RefObject} from "react";

// Stylesheet
import "./index.scss";

// Component Imports
import ProgramContainer from "./ProgramContainer";
import Schedule from "./Schedule";
import {TimeBlockRequirements} from "./Schedule/Term/TimeBlock";
import ClassSearcher from "../../ClassSearcher";

// Wrapper-like interface that can act as a "master container" of *all* the information
//  in a Schedule, making it suitable for export/duplication.
export interface HigherOrderScheduleData {
    deleted: boolean[]; // [False, True, ... ] on whether to show a given term
    terms: TimeBlockRequirements[][];
    termNames: string[];
    starterID: number;  // 0 = Blank, 1-3 = Starter/Pre-made
}

interface ScheduleEntryProps {
    starterID: number;  // 0 = Blank, 1-3 = Starter/Pre-made
    displayAddButton: any;  // Toggle whether or not to show the "add" button
    starterData?: HigherOrderScheduleData;  // An optional starter-set of data
    duplicate: any; // A callback to the ScheduleEntryContainer to "duplicate" this schedule
    classSearcherRef: RefObject<ClassSearcher>
}

interface ScheduleEntryState {
    programs: ReactElement[];   // Array of Programs
    scheduleName: string;       // Name of the ScheduleEntry; given by user
    editing: boolean;           // A 'status' indicating whether the name is being edited
    temporaryName: string;      // Temporary name so that it can be updated *or* cancelled
    receivedName: boolean;      // Used to force the user to enter a name to begin
    deleted: boolean;           // Status: Deleted/Not Deleted
    currentScheduleData: HigherOrderScheduleData;   // A running copy of all data in the Schedule
    passDownData: HigherOrderScheduleData;          // The data the Entry is initialized with
}

/**
 * One single Schedule Entry; that is, the collection of "Terms" *and* the Programs
 * the user is tracking against their class choices.
 */
class ScheduleEntry extends React.Component<ScheduleEntryProps, ScheduleEntryState> {

    // Ref to pass down to the Schedule in this Entry, which lets us access it later
    private readonly scheduleRef: React.RefObject<Schedule>;

    // Ref to connect us to the ProgramContainer; used for us to call a function from this child component
    private readonly programRef: React.RefObject<ProgramContainer>;

    /**
     * None expected; React Component standards.
     * @param props
     */
    constructor(props: ScheduleEntryProps) {
        super(props);

        this.state = {
            programs: [],
            scheduleName: (this.props.starterID ? "Starter Schedule" : "Unnamed Schedule"),
            temporaryName: "Placeholder Schedule Name",
            editing: !this.props.starterID,         // If this was a template, it will have a name, and no need to edit
            receivedName: !!this.props.starterID,   // Non-zero = given a name
            deleted: false,

            // Initialize the data depending on whether it is given any or will be blank
            currentScheduleData: this.props.starterData || {
                deleted: ScheduleEntry.getStarterData(this.props.starterID).map((term) => false),
                terms: ScheduleEntry.getStarterData(this.props.starterID),
                termNames: ["Fall Term (#" + this.props.starterID + ")", "Winter Term (#" + this.props.starterID + ")"],
                starterID: this.props.starterID
            },


            /**
             * You're just copying the data into *two* state variables??
             *
             * Yep! This is a byproduct to the component-lifecycle-hierarchy-THING of React.
             * We need a running copy of everything in the Schedule, but since data is passed
             * as a prop to those components, if any props were based on this component's state,
             * when we update it, it would cause those components to refresh/re-render and massively
             * disrupt the UX. We want to give the components their starting data, but then also
             * edit the copy we had at the start, *without* triggering a re-render, so we give those
             * components one copy, and have a separate copy that is updated/changed/exported.
             */
            passDownData: this.props.starterData || {
                deleted:  ScheduleEntry.getStarterData(this.props.starterID).map((term) => false),
                terms: ScheduleEntry.getStarterData(this.props.starterID),
                termNames: ["Fall Term (#" + this.props.starterID + ")", "Winter Term (#" + this.props.starterID + ")"],
                starterID: this.props.starterID
            },
        };

        if (this.state.receivedName)
            this.props.displayAddButton();

        // Create refs that let us access these components later
        this.scheduleRef = React.createRef();
        this.programRef = React.createRef();

        // Function binding
        this.handleChange = this.handleChange.bind(this);
        this.editChange = this.editChange.bind(this);

        this.HOSD_acceptTimeEvent = this.HOSD_acceptTimeEvent.bind(this);
        this.HOSD_removeTimeEvent = this.HOSD_removeTimeEvent.bind(this);
        this.HOSD_deleteTerm = this.HOSD_deleteTerm.bind(this);
        this.HOSD_addTerm = this.HOSD_addTerm.bind(this);
        this.HOSD_renameTerm = this.HOSD_renameTerm.bind(this);

    }

    /**
     * Access the ref of the "Schedule"
     */
    public getScheduleRef(): RefObject<Schedule> {
        return this.scheduleRef;
    }

    /**
     * Get the title of the ScheduleEntry
     */
    public getTitle(): string {
        return this.state.scheduleName;
    }

    /**
     * Some debug info that runs on a ScheduleEntry mount (i.e., when instantiated and inserted
     * into the ReactDOM.
     */
    componentDidMount(): void {
        console.log(this.state.currentScheduleData)
    }
    /**
     * Some debug info that runs on a ScheduleEntry update (when the "state" of this component updates
     */
    componentDidUpdate(): void {
        console.log(this.state.currentScheduleData);
    }

    /**
     * Check if this entry was deleted
     */
    public isDeleted(): boolean {
        return this.state.deleted;
    }

    // Delete self
    private deleteSchedule(): void {
        this.setState({deleted: true});
    }

    /**
     * Updating the ScheduleEntry Name from user input
     * @param event
     */
    private handleChange(event: any): void {

        event.preventDefault();

        const target = event.target;
        const value = target.value.trim();

        if (value !== "")    // User entered non-whitespace as a new name
            this.setState({
                temporaryName: value
            });
        else    // Only whitespace - reset and do not update
            this.setState({
                temporaryName: this.state.scheduleName
            });

        console.log("Schedule " + this.state.scheduleName + " rename triggered with name " + this.state.temporaryName);
    }

    /**
     * Toggle the editing "state" of the ScheduleEntry
     * @param event
     */
    private editChange(event: any): void {
        event.preventDefault();
        if (this.state.editing) // Save the name stored (which would be reset if only whitespace)
            this.setState( {scheduleName: this.state.temporaryName});

        if (!this.state.receivedName)
            this.props.displayAddButton();
        this.setState({editing: !this.state.editing, receivedName: true});
    }

    /**
     * Helper function that can be used to give data for starter/pre-made schedules
     * @param starterID internal ID used to denote a particular template
     */
    private static getStarterData(starterID: number): TimeBlockRequirements[][] {
        let starterData: TimeBlockRequirements[][][] = [
            // Starter 1
            [
                // Fall
                [
                    {
                        startTime: 830,
                        endTime: 920,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "MATH 110",
                        location: "PHYS 107",
                        instructor: "John Walters"
                    },
                    {
                        startTime: 930,
                        endTime: 1020,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "CMPT 141",
                        location: "ARTS 134",
                        instructor: "Mark Eramian"
                    },
                    {
                        startTime: 1430,
                        endTime: 1520,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "PHYS 115",
                        location: "PHYS 107",
                        instructor: "Brian Zulcowski"
                    },
                    {
                        startTime: 1130,
                        endTime: 1250,
                        days: ["Tuesday", "Thursday"],
                        title: "PHIL 120",
                        location: "ARTS 113",
                        instructor: "Dwayne Moore"
                    },
                    {
                        startTime: 1430,
                        endTime: 1550,
                        days: ["Tuesday", "Thursday"],
                        title: "SOC 111",
                        location: "ARTS 110",
                        instructor: "Susan Robertson"
                    },
                ],

                // Winter
                [
                    {
                        startTime: 1330,
                        endTime: 1420,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "CMPT 145",
                        location: "PHYS 140",
                        instructor: "Cyril Coupal"
                    },
                    {
                        startTime: 1430,
                        endTime: 1520,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "ARCH 112",
                        location: "ARTS 134",
                        instructor: "Glenn Stuart"
                    },
                    {
                        startTime: 1000,
                        endTime: 1120,
                        days: ["Tuesday", "Thursday"],
                        title: "ENG 110",
                        location: "ARTS 263",
                        instructor: "David Parkinson"
                    },
                    {
                        startTime: 1300,
                        endTime: 1420,
                        days: ["Tuesday", "Thursday"],
                        title: "GEOL 108",
                        location: "ARTS 241",
                        instructor: "Melvyn Stauffer"
                    },
                    {
                        startTime: 1430,
                        endTime: 1600,
                        days: ["Tuesday", "Thursday"],
                        title: "NUTR 120",
                        location: "HLTH 1150",
                        instructor: "Melanie Rozwadowski"
                    },
                ]
            ],

            // Starter 2
            [
                // Fall
                [
                    {
                        startTime: 1030,
                        endTime: 1120,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "MATH 164",
                        location: "ARTS 263",
                        instructor: "Murray Bremner"
                    },
                    {
                        startTime: 1330,
                        endTime: 1420,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "PHIL 133",
                        location: "ARTS 207",
                        instructor: "Emer O'Hagan"
                    },
                    {
                        startTime: 1430,
                        endTime: 1520,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "PHYS 115",
                        location: "PHYS 107",
                        instructor: "Adam Zulcowski"
                    },
                    {
                        startTime: 1130,
                        endTime: 1250,
                        days: ["Tuesday", "Thursday"],
                        title: "PHIL 120",
                        location: "ARTS 113",
                        instructor: "Dwayne Moore"
                    },
                    {
                        startTime: 1430,
                        endTime: 1550,
                        days: ["Tuesday", "Thursday"],
                        title: "LING 111",
                        location: "ARTS 110",
                        instructor: "Jeffrey Klassen"
                    },
                ],

                // Winter
                [
                    {
                        startTime: 1430,
                        endTime: 1520,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "ENG 112",
                        location: "PHYS 140",
                        instructor: "David York"
                    },
                    {
                        startTime: 1630,
                        endTime: 1720,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "ENG 110",
                        location: "ARTS 241",
                        instructor: "David Parkinson"
                    },
                    {
                        startTime: 1000,
                        endTime: 1120,
                        days: ["Tuesday", "Thursday"],
                        title: "CMPT 140",
                        location: "ARTS 134",
                        instructor: "Mark Eramian"
                    },
                    {
                        startTime: 1430,
                        endTime: 1550,
                        days: ["Tuesday", "Thursday"],
                        title: "ASTR 104",
                        location: "PHYS 107",
                        instructor: "Daryl Janzen"
                    },
                    {
                        startTime: 1430,
                        endTime: 1600,
                        days: ["Tuesday", "Thursday"],
                        title: "NUTR 120",
                        location: "HLTH 1150",
                        instructor: "Melanie Rozwadowski"
                    },
                ]
            ],

            // Starter 3
            [
                // Fall
                [
                    {
                        startTime: 930,
                        endTime: 1020,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "POLS 111",
                        location: "ARTS 102",
                        instructor: "David York"
                    },
                    {
                        startTime: 1130,
                        endTime: 1220,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "AGRC 112",
                        location: "AGR 2E17",
                        instructor: "Colin Peterson"
                    },
                    {
                        startTime: 1300,
                        endTime: 1420,
                        days: ["Tuesday", "Thursday"],
                        title: "HIST 115",
                        location: "STM 1001",
                        instructor: "Sharon Wright"
                    },
                    {
                        startTime: 1130,
                        endTime: 1250,
                        days: ["Tuesday", "Thursday"],
                        title: "PHIL 120",
                        location: "ARTS 113",
                        instructor: "Dwayne Moore"
                    },
                    {
                        startTime: 1430,
                        endTime: 1550,
                        days: ["Tuesday", "Thursday"],
                        title: "SOC 111",
                        location: "ARTS 110",
                        instructor: "Susan Robertson"
                    },
                ],

                // Winter
                [
                    {
                        startTime: 1030,
                        endTime: 1120,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "MATH 116",
                        location: "ARTS 263",
                        instructor: "Amos Lee"
                    },
                    {
                        startTime: 1430,
                        endTime: 1520,
                        days: ["Monday", "Wednesday", "Friday"],
                        title: "ARCH 112",
                        location: "ARTS 134",
                        instructor: "Glenn Stuart"
                    },
                    {
                        startTime: 1000,
                        endTime: 1120,
                        days: ["Tuesday", "Thursday"],
                        title: "CMPT 140",
                        location: "ARTS 134",
                        instructor: "Mark Eramian"
                    },
                    {
                        startTime: 1300,
                        endTime: 1420,
                        days: ["Tuesday", "Thursday"],
                        title: "GEOL 108",
                        location: "ARTS 241",
                        instructor: "Melvyn Stauffer"
                    },
                    {
                        startTime: 1430,
                        endTime: 1600,
                        days: ["Tuesday", "Thursday"],
                        title: "NUTR 120",
                        location: "HLTH 1150",
                        instructor: "Melanie Rozwadowski"
                    },
                ]
            ],
        ];

        if (starterID)
            return starterData[starterID-1];
        else
            return [];
    }


    /**
     * Accept a time block into the higher order data container
     * @param timeEvent the event to add
     * @param termID the id of the term from which the event originates
     */
    public HOSD_acceptTimeEvent(timeEvent: TimeBlockRequirements, termID: number): void {
        let updatedCurrent = this.state.currentScheduleData;
        console.log(termID);
        console.log(updatedCurrent.terms.length);
        if (!updatedCurrent.terms[termID].includes(timeEvent)) {
            updatedCurrent.terms[termID] = updatedCurrent.terms[termID].concat(timeEvent);
            this.setState({currentScheduleData: updatedCurrent});
        }
    }

    /**
     * Remove a time block from the higher order data container
     * @param timeEvent the event to remove
     * @param termID the id of the term from which the event originates
     */
    public HOSD_removeTimeEvent(timeEvent: TimeBlockRequirements, termID: number): void {
        let updatedCurrent = this.state.currentScheduleData;

        /** Debug info; "Days" are tricky to compare
        console.log("DEBUG")
        console.log(updatedCurrent.terms[termID])
        console.log(timeEvent)

        //console.log(updatedCurrent.terms[termID][0].days === timeEvent.days)
        console.log("DEBUG")
         */


        if (this.containsEvent(timeEvent, updatedCurrent.terms[termID])) {
            updatedCurrent.terms[termID] = updatedCurrent.terms[termID].filter((curTimeEvent) => (
                !this.timeEventMatch(curTimeEvent, timeEvent)
            ));
            this.setState({currentScheduleData: updatedCurrent});
        } else console.log("Not found")
    }

    /**
     * Determine if a set of time blocks contains a particular time block
     * @param timeEvent the event to search for
     * @param term the term to search in
     */
    public containsEvent(timeEvent: TimeBlockRequirements, term: TimeBlockRequirements[]): boolean {
        for (let event of term) {
            if (timeEvent.startTime === event.startTime &&
                timeEvent.days.join() === event.days.join() &&
                timeEvent.endTime === event.endTime &&
                timeEvent.title === event.title)
                return true;
        } return false
    }

    /**
     * Determine if two time events are "Close enough" that they are likely the same
     */
    public timeEventMatch(first: TimeBlockRequirements, second: TimeBlockRequirements): boolean {
        return first.startTime === second.startTime &&
            first.days.join() === second.days.join() &&
            first.endTime === second.endTime &&
            first.title === second.title
    }

    /**
     * Delete a given term
     * @param termID the ID of the term
     */
    public HOSD_deleteTerm(termID: number): void {
        let updatedCurrent = this.state.currentScheduleData;
        updatedCurrent.deleted[termID] = true;
        this.setState({currentScheduleData: updatedCurrent})
    }

    /**
     * Add a term into the HigherOrder data
     */
    public HOSD_addTerm(): void {
        let updatedCurrent = this.state.currentScheduleData;
        updatedCurrent.terms.push([]);
        updatedCurrent.deleted.push(false);
        this.setState({currentScheduleData: updatedCurrent})
    }

    /**
     * Rename a given term
     * @param termID the index in the HigherOrder data to modify
     * @param newName the new name of the term
     */
    public HOSD_renameTerm(termID: number, newName: string): void {
        let updatedCurrent = this.state.currentScheduleData;
        updatedCurrent.termNames[termID] = newName;
        this.setState({currentScheduleData: updatedCurrent})
    }

    render() {

        return (

            !this.state.deleted ?
            <div className={"scheduleEntryContainer"}>

                <div className={"scheduleContentContainer"}>
                    <div className={"scheduleHeaderContainer"}>
                        <form>
                            {this.state.editing || !this.state.receivedName ?
                                <input
                                    type={"text"}
                                    placeholder={this.state.scheduleName}
                                    onChange={this.handleChange}
                                /> :
                                <p className={"scheduleName"}>
                                    {this.state.scheduleName}
                                </p>
                            }
                            <button onClick={this.editChange}>
                                {this.state.editing ? "Save Schedule Name" : "Edit Schedule Name"}</button>
                            {this.state.editing ? null :
                                <button
                                    className={"duplicate"}
                                    onClick={(event) => this.props.duplicate(event, this.state.currentScheduleData)}
                                >Duplicate Schedule</button>
                            }
                            {this.state.editing ? null :
                                <button
                                    className={"delete"}
                                    onClick={() => this.deleteSchedule()}
                                >Delete Schedule</button>
                            }
                        </form>
                    </div>

                    {/* Show the actual content of the page once a name is entered */}
                    {this.state.receivedName ?
                        <span>
                            <div className={"mainContentContainer"}>
                                <Schedule
                                    programContainerRef={this.programRef}
                                    starterData={this.state.passDownData}
                                    HOSD_acceptTimeEvent={this.HOSD_acceptTimeEvent}
                                    HOSD_removeTimeEvent={this.HOSD_removeTimeEvent}
                                    HOSD_deleteTerm={this.HOSD_deleteTerm}
                                    HOSD_addTerm={this.HOSD_addTerm}
                                    HOSD_renameTerm={this.HOSD_renameTerm}
                                    ref={this.scheduleRef}
                                />

                                <hr />

                                <ProgramContainer
                                    ref={this.programRef}
                                />
                            </div>
                        </span> : null}
                </div>
            </div> : null
        )
    }
}

export default ScheduleEntry;