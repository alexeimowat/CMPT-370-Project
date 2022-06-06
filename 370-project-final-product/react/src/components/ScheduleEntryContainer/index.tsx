// React imports
import React, {ReactElement, RefObject} from "react";

// Stylesheet
import "./index.scss";

// Component imports
import ScheduleEntry, {HigherOrderScheduleData} from "./ScheduleEntry";
import ClassSearcher from "../ClassSearcher";

interface ScheduleEntryContainerProps {
    classSearcherRef: RefObject<ClassSearcher>;
}

interface ScheduleEntryContainerState {
    scheduleEntries: ReactElement[];    // An array of all the ScheduleEntries
    showAddButton: boolean;             // Flip whether or not to show the buttons to add Schedule Entries
    scheduleEntryRefArray: RefObject<ScheduleEntry>[];  // Array of refs to access ScheduleEntries later
}

/**
 * A Container for every ScheduleEntry. Holds *most* of the content of the entire page
 */
class ScheduleEntryContainer extends React.Component<ScheduleEntryContainerProps, ScheduleEntryContainerState> {

    /**
     * No props necessary, but adhering to the structure of React Components
     * @param props
     */
    constructor(props: any) {
        super(props);
        this.state = {
            scheduleEntries: [],        // Start empty
            showAddButton: true,        // Show
            scheduleEntryRefArray: []   // Start empty
        };

        // Function binding
        this.addScheduleEntry = this.addScheduleEntry.bind(this);
        this.displayAddButton = this.displayAddButton.bind(this);
        this.duplicate = this.duplicate.bind(this);
    }

    /**
     * Get a list of all the ScheduleEntry's being stored
     */
    public getScheduleEntries(): RefObject<ScheduleEntry>[] {
        return this.state.scheduleEntryRefArray;
    }

    /**
     * Add a ScheduleEntry to the main container
     */
    private addScheduleEntry(starterID: number): void {
        // Create a ref to access the entry later
        let newRef: RefObject<ScheduleEntry> = React.createRef();
        this.setState({scheduleEntries: this.state.scheduleEntries.concat(
            <ScheduleEntry
                displayAddButton={this.displayAddButton}
                starterID={starterID}
                duplicate={this.duplicate}
                ref={newRef}
                classSearcherRef={this.props.classSearcherRef}
            />),
            showAddButton: false,
            scheduleEntryRefArray: this.state.scheduleEntryRefArray.concat(newRef)
        });
    }

    /**
     * Call from within a Schedule Entry: Duplicate the schedule entry
     * @param event triggered
     * @param scheduleExportData the data to duplicate
     */
    public duplicate(event: any, scheduleExportData: HigherOrderScheduleData): void {
        event.preventDefault();

        // Create a ref to access the entry later
        let newRef: RefObject<ScheduleEntry> = React.createRef();


        // DEBUG info
        // console.log("Given");
        // console.log(scheduleExportData);

        this.setState({scheduleEntries: this.state.scheduleEntries.concat(
            <ScheduleEntry
                starterID={scheduleExportData.starterID}
                displayAddButton={this.displayAddButton}
                starterData={scheduleExportData}
                duplicate={this.duplicate}
                ref={newRef}
                classSearcherRef={this.props.classSearcherRef}
            />
            ),
            scheduleEntryRefArray: this.state.scheduleEntryRefArray.concat(newRef)})
    }

    /**
     * Show the "Add Schedule Entry" button
     */
    public displayAddButton(): void {
        this.setState({showAddButton: true});
    }

    render() {

        return (
            <div id={"ScheduleEntryContainer"} className={"container"}>
                {this.state.scheduleEntries}
                {this.state.showAddButton ?
                    <form className={"scheduleEntryButtons"}>
                        <button
                            onClick={() => this.addScheduleEntry(0)}
                            className={"blank newScheduleEntryButton"}
                        >Begin a new Schedule Entry
                        </button>

                        <button
                            onClick={() => this.addScheduleEntry(1)}
                            className={"newScheduleEntryButton"}
                        >Add a 1st Year Computer Science Starter
                        </button>

                        <button
                            onClick={() => this.addScheduleEntry(2)}
                            className={"newScheduleEntryButton"}
                        >Add a General 1st Year Arts Starter
                        </button>

                        <button
                            onClick={() => this.addScheduleEntry(3)}
                            className={"newScheduleEntryButton"}
                        >Add a Generalized, 1st Year Starter
                        </button>
                    </form> : null}
            </div>
        )
    }
}

export default ScheduleEntryContainer;