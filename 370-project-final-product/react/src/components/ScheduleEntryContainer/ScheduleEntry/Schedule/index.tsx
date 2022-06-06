// React imports
import React, {ReactElement, Ref, RefObject} from "react";

// Stylesheet
import "./index.scss";

// Component imports
import Term from "./Term";
import {HigherOrderScheduleData} from "../index";

interface ScheduleProps {
    programContainerRef: React.RefObject<any>   // Ref to the ProgramContainer of this schedule
    starterData: HigherOrderScheduleData;       // Any starting data: can be empty
    HOSD_acceptTimeEvent: any;   // Callback to add a TimeEvent into the HigherOrder data of the Entry
    HOSD_removeTimeEvent: any;   // Callback to remove a TimeEvent from the HigherOrder data of the Entry
    HOSD_deleteTerm: any;        // Callback to delete a Term from the HigherOrder data of the Entry
    HOSD_addTerm: any;           // Callback to add a term into the HigherOrder data
    HOSD_renameTerm: any;        // HigherOrder callback to rename this term
}

interface ScheduleState {
    terms: ReactElement[];  // Schedule will have an array of Terms
    displayAddTermButton: boolean;
    counter: number;
    refArray: RefObject<Term>[];    // A ref for every Term in the Schedule
}

class Schedule extends React.Component<ScheduleProps, ScheduleState> {

    /**
     * Constructor for the schedule. No props expected.
     * @param props
     */
    constructor(props: ScheduleProps) {
        super(props);

        // Initialize the state with one Term.
        this.state = {
            terms: [],
            displayAddTermButton: !!this.props.starterData,
            counter: 0,
            refArray: []
        };


        // Function binding
        this.addTerm = this.addTerm.bind(this);
        this.toggleDisplayAddTermButton = this.toggleDisplayAddTermButton.bind(this);
    }

    /**
     * Add one Term when the Schedule is mounted
     */
    componentDidMount(): void {
        if (!this.props.starterData)
            this.addTerm();
        else {

            let refArray: RefObject<Term>[] = [];
            for (let i = 0; i < this.props.starterData.terms.length; i++) {
                refArray.push(React.createRef());
            }

            let TermList = this.props.starterData.terms.map((term, idx) => (
                <Term
                    termTitle={this.props.starterData.termNames[idx]}
                    programContainerRef={this.props.programContainerRef}
                    toggleDisplayAddTermButton={this.toggleDisplayAddTermButton}
                    starterData={term}
                    termID={idx}
                    HOSD_acceptTimeEvent={this.props.HOSD_acceptTimeEvent}
                    HOSD_removeTimeEvent={this.props.HOSD_removeTimeEvent}
                    HOSD_deleteTerm={this.props.HOSD_deleteTerm}
                    HOSD_renameTerm={this.props.HOSD_renameTerm}
                    deleted={this.props.starterData.deleted[idx]}
                    ref={refArray[idx]}
                />
            ));
            this.setState({terms: TermList, counter: TermList.length, refArray: refArray});
        }
    }

    /**
     * Get all the (non-deleted) refs of terms from a Schedule
     */
    public getTermRefs(): RefObject<Term>[] {
        let pre_filter = this.state.refArray;
        let filtered: RefObject<Term>[] = [];
        for (let termRef of pre_filter) {
            let current = termRef.current;
            if (current) {
                if (!current.isDeleted()) {
                    filtered.push(termRef);
                }
            }
        }
        return filtered;
    }

    /**
     * Add a Term to the schedule.
     */
    private addTerm(): void {
        let refArr = this.state.refArray;
        let newRef: RefObject<Term> = React.createRef();
        refArr.push(newRef);
        this.setState({terms: this.state.terms.concat(
            <Term
                programContainerRef={this.props.programContainerRef}
                toggleDisplayAddTermButton={this.toggleDisplayAddTermButton}
                termID={this.count()}
                HOSD_acceptTimeEvent={this.props.HOSD_acceptTimeEvent}
                HOSD_removeTimeEvent={this.props.HOSD_removeTimeEvent}
                HOSD_deleteTerm={this.props.HOSD_deleteTerm}
                HOSD_renameTerm={this.props.HOSD_renameTerm}
                deleted={false}
                ref={newRef}
            />),
            displayAddTermButton: false,
            refArray: refArr
        });
        this.props.HOSD_addTerm();
    }

    /**
     * Get a unique number each time this is called
     */
    private count(): number {
        let x = this.state.counter;
        this.setState({counter: x+1});
        return x;
    }

    /**
     * Get a button that, upon clicking, triggers addTerm()
     * It's like a Factory, but for buttons that actually do something.
     */
    private termAddButton(): ReactElement {
        return (
            <button
                onClick={this.addTerm}
                className={"addTermButton"}
            >Add Term</button>
        )
    }

    /**
     * Show the "Add Term" button
     */
    public toggleDisplayAddTermButton(): void {
        this.setState({displayAddTermButton: true});
    }

    render() {

        // At present, just add the button to the end of the terms.
        // TODO - Arbitrary between-term insertions
        //let terms = this.state.terms.concat(this.termAddButton());

        return (

            <div className={"scheduleContainer"}>
                <div className={"mainTermContainer"}>
                    {this.state.terms}
                    {this.state.displayAddTermButton ? this.termAddButton() : null}
                </div>
            </div>
        )
    }
}

export default Schedule;