// React imports
import React, {RefObject} from "react";
import InputRange from "react-input-range";

// Stylesheets
import './index.scss';
import "react-input-range/lib/css/index.css";

// Component imports
import ClassSearcherProgramWindow from "./ClassSearcherProgramWindow";
import ClassSearchResultContainer from "./ClassSearchResults";
import ScheduleEntryContainer from "../ScheduleEntryContainer";
import {TimeBlockRequirements} from "../ScheduleEntryContainer/ScheduleEntry/Schedule/Term/TimeBlock";

interface SearchFieldAttributes {
    searchLabel: string;
    placeHolder: string;
    name: any,
}

interface ClassSearcherProps {
    scheduleEntryContainerRef: RefObject<ScheduleEntryContainer>
}

interface ClassSearcherState {
    Subject: string;
    ClassNum: string;
    Days: string;
    ProfName: string;
    Term: string;
}

// First argument: Props Second argument: State
class ClassSearcher extends React.Component<ClassSearcherProps, any>{

    // Ref to connect us to the SearchResult area more cleanly.
    private readonly classSearchResultRef: React.RefObject<ClassSearchResultContainer>;

    constructor(props: any) {
        super(props);

        this.state = {
            Subject: "",
            ClassNum: "",
            Days: "",
            ProfName: "",
            Term: "",
            SelectedClass: "",
            showEntries: false,
            cleanedSearchResults: [],
            value: {
                min: 100,
                max: 899
            },
            nightClassesOnly: false,
            showingEligibleEntries: false,
            scheduleEntries: []
        };

        this.classSearchResultRef = React.createRef();

        this.onChange = this.onChange.bind(this);
        this.classSearch = this.classSearch.bind(this);
        this.selectClass = this.selectClass.bind(this);
        this.filterResults = this.filterResults.bind(this);
        this.toggleNightClasses = this.toggleNightClasses.bind(this);
        this.updateDisplayedSchedules = this.updateDisplayedSchedules.bind(this);
        this.toggleShowScheduleEntries = this.toggleShowScheduleEntries.bind(this);
    }

    componentDidMount(): void {
        setInterval(this.updateDisplayedSchedules, 100);
    }

    /**
     * Handle any update on the search fields
     * @param event
     */
    onChange(event: any) {
        //event.preventDefault();
        this.setState({[event.target.name]: [event.target.value]});
    }

    private toggleShowScheduleEntries(): void {
        this.setState({showingEligibleEntries: !this.state.showingEligibleEntries});
    }

    public static fixTerm(term: string): string {
        let first = term.match(/[a-zA-Z]+/g) || [];
        let second = term.match(/[0-9]+/g);
        return [second, first.join("").toLowerCase()].join("");
    }

    /**
     * Execute a search for classes, clean the results, filter them, and send them to the result window.
     */
    public async classSearch() {

        // Construct the search URL
        let apiURL: string = "http://localhost:8000/api/class/?";
        let queryOptions = ["Subject", "ClassNum", "Days", "ProfName"];
        let queryDetails = queryOptions.map((option) => (option + "=" + this.state[option])).join("&");
        let url = apiURL + queryDetails + "&Term=" + ClassSearcher.fixTerm(this.state["Term"] + "");

        url += (this.state.nightClassesOnly || this.state.Subject != "" ? "&Max=" : "&Max=1000");

        console.log(url);

        // Query and json-ify the results
        let results = await fetch(url).then(response => (response.json()));

        // Connect to the result window, clean, and filter the results
        let searchDisplay = this.classSearchResultRef.current;
        if (searchDisplay && results) {
            searchDisplay.receiveResults(this.filterResults(ClassSearcher.cleanup(results)))
        }
    }

    /**
     * Helper function to split a class name into the format expected for Schedule use
     * @param name the name as subjCODE, (i.e., CMPT141, PHIL232)
     */
    public static splitName(name: string): string {
        let first = name.match(/[a-zA-Z]+/g);
        let second = name.match(/[0-9]+/g);
        return [first, second].join(" ");
    }

    /**
     * Helper function to split a term name into the format expected for Schedule use
     * @param term to split, in format yearSeason (i.e., 2020winter)
     */
    public static splitTerm(term: string): string {
        let first = term.match(/[0-9]+/g);
        let second = term.match(/[a-zA-Z]+/g);

        let preCapitalized = [first, second].join(" ");
        let capitalized = "";
        let found = false;
        for (let character of preCapitalized) {
          if (character != character.toUpperCase() && !found) {
              capitalized += character.toUpperCase();
              found = true;
          } else
              capitalized += character;
        } return capitalized;
    }

    /**
     * Helper function to clean the JSON returned from the Class Search query
     * @param data the data to cleanup
     */
    public static cleanup(data: any): TimeBlockRequirements[] {
        let cleanedData = [];
        let resultTotal: number = data["result"].length;
        for (let resultIndex = 0; resultIndex < resultTotal; resultIndex++) {
            cleanedData.push({
                title: this.splitName(data["result"][resultIndex].class),
                days: data["result"][resultIndex].days,
                startTime: data["result"][resultIndex].start_time.split(":").join("") / 100,
                endTime: data["result"][resultIndex].end_time.split(":").join("") / 100,
                term: this.splitTerm(data["result"][resultIndex].term),
                location: data["result"][resultIndex].location
            })
        }
        return cleanedData;
    }

    /**
     * Return a functional component, since it doesn't need to be a class.
     * @param attributes the label, placeholder value, and field names
     * @constructor
     */
    public ClassSearchField(attributes: SearchFieldAttributes) {
        return (
            <div className={"classSearchField"}>
                <label>{attributes.searchLabel}</label>
                <input
                    placeholder={attributes.placeHolder}
                    type={"text"}
                    name={attributes.name}
                    onChange={this.onChange}
                />
            </div>
        )
    }

    /**
     * Save a class selected from the results window, present schedule options to add to
     * @param classToAdd the class selected
     */
    public async selectClass(classToAdd: TimeBlockRequirements) {

        // Get the schedules and fix the days into the format required
        let fixedClass = ClassSearcher.fixDays(classToAdd);

        // Update state accordingly, with the class to add and to show entries
        await this.setState({
            showEntries: true,
            SelectedClass: fixedClass,
            showingEligibleEntries: true
        });
    }

    /**
     * Update all the schedules to show in the Class Searcher
     */
    public updateDisplayedSchedules() {

        try {
            let x = this.state.SelectedClass;
            if (!x) return;
        } catch {
            return;
        }

        // Get the schedules and fix the days into the format required
        let scheduleEntryContainer = this.props.scheduleEntryContainerRef.current;
        if (scheduleEntryContainer) {

            // Get every schedule entry
            let entries = scheduleEntryContainer.getScheduleEntries();
            let currents = entries.map((entry) => (entry.current));

            // Get every non-null, non-deleted scheduleEntry
            let scheduleEntries = [];
            for (let current of currents) {
                if (current && !current.isDeleted()) {
                    let schedule = current.getScheduleRef();

                    // Create a component that will allow the user to add this class to that scheduleEntry
                    scheduleEntries.push(
                        <ClassSearcherProgramWindow
                            classToAdd={this.state.SelectedClass}
                            displayTitle={current.getTitle()}
                            RefBackToSchedule={schedule}
                        />
                    )
                }
            }

            // Update the schedules to show
            this.setState({scheduleEntries: scheduleEntries});
        }
    }

    /**
     * Helper function to convert the days "MWF"-style into the style used in the Schedule
     * @param className the class to fix the day attribute of
     */
    public static fixDays(className: TimeBlockRequirements): TimeBlockRequirements {
        let mapped: {[key: string]: string} = {
            "M": "Monday",
            "T": "Tuesday",
            "W": "Wednesday",
            "R": "Thursday",
            "F": "Friday"
        };

        let fixedDays: string[] = [];
        for (let day of className.days)
            fixedDays.push(mapped[day]);

        return {
            title: className.title,
            startTime: className.startTime,
            endTime: className.endTime,
            location: className.location,
            instructor: className.instructor,
            term: className.term,
            days: fixedDays
        }
    }

    /**
     * Filter out classes to the number-range specified, as well as night classes (if toggled)
     * @param unfiltered the unfiltered timeBlocks
     */
    public filterResults(unfiltered: TimeBlockRequirements[]): TimeBlockRequirements[] {
        return unfiltered.filter(result => (
            result.title.split(" ")[1] > this.state.value["min"] &&
            result.title.split(" ")[1] < this.state.value["max"] &&
            (!this.state.nightClassesOnly || result.startTime > 1700)
        ))
            .sort((a, b) => (a.title.localeCompare(b.title)));
    }

    /**
     * Swap whether or not to filter to night-classes-only
     */
    public toggleNightClasses(): void {
        this.setState({nightClassesOnly: !this.state.nightClassesOnly});
    }

    render() {

        let searchFields = [
            {
                searchLabel: "Search by Subject: ",
                placeHolder: "Subject",
                name: "Subject",
            },
            {
                searchLabel: "Search by Class: ",
                placeHolder: "Class Name",
                name: "ClassNum",
            },
            {
                searchLabel: "Search by Days: ",
                placeHolder: "Days (ex. MWF)",
                name: "Days",
            },
            {
                searchLabel: "Search by Professor: ",
                placeHolder: "Professor Name",
                name: "ProfName",
            },
            {
                searchLabel: "Search by Term: ",
                placeHolder: "ex. (Winter 2020)",
                name: "Term",
            }
        ];


        return (
            <div className={"classSearcherContainer"}>
                
                <div className={"mainClassSearcherContent"}>
                    <div className={"searchContainer"}>

                        {/* Basic Search Form */}
                        <div className={"searchAreaContent fields"}>
                            <h2>Search Field</h2>
                            <form
                                className={"searchFields"}
                                onSubmit={this.classSearch}
                            >
                                {searchFields.map((field) => this.ClassSearchField(field))}
                            </form>
                        </div>


                        {/* Filtering Panel */}
                        <div className={"searchAreaContent filter"}>

                            <h2>Filter Results</h2>
                            <form
                                onSubmit={this.classSearch}
                            >
                                <label>Night Classes Only:
                                    <input
                                        type={"checkbox"}
                                        onClick={this.toggleNightClasses}
                                    />
                                </label>
                                <div className={"boundFilterContainer"}>
                                    <p>Set class number bounds (i.e., 200-300, 100-300, etc.)</p>

                                    <div className={"inputRangeWrapper"}>
                                        <InputRange
                                            minValue={100}
                                            maxValue={899}

                                            value={this.state.value}
                                            onChange={value => this.setState({value})}
                                        />
                                    </div>
                                </div>

                            </form>
                        </div>


                        {/* Execute the search */}
                        <button
                            className={"classSearchButton"}
                            onClick={this.classSearch}
                        >Search</button>

                    </div>

                    <ClassSearchResultContainer
                        ref={this.classSearchResultRef}
                        proceedToAdd={this.selectClass}
                    />
                </div>

                {this.state.showingEligibleEntries ?
                    <div className={"eligibleScheduleEntryContainer"}>
                        {this.state.scheduleEntries.length ?
                            this.state.scheduleEntries :
                            <div className={"notFound"}>
                                <p>No Schedules Found</p>
                            </div>}
                        <button
                            className={"quitButton"}
                            onClick={this.toggleShowScheduleEntries}
                        >Quit</button>
                    </div> : null }
            </div>
        )
    }
}

export default ClassSearcher;
