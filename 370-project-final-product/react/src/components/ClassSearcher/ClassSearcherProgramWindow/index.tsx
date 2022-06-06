// React imports
import React, {ReactElement, RefObject} from "react";

// Stylesheet
import "./index.scss";

// Component imports
import Schedule from "../../ScheduleEntryContainer/ScheduleEntry/Schedule";
import Term from "../../ScheduleEntryContainer/ScheduleEntry/Schedule/Term";
import {TimeBlockRequirements} from "../../ScheduleEntryContainer/ScheduleEntry/Schedule/Term/TimeBlock";

interface ClassSearcherProgramWindowProps {
    classToAdd: TimeBlockRequirements;      // Class selected
    displayTitle: string;                   // Title of the schedule
    RefBackToSchedule: RefObject<Schedule>  // Ref to the schedule entry
}

interface ClassSearcherProgramWindowState {
    eligibleTerms: ReactElement[];  // All the non-deleted terms in the schedule
    showingTerms: boolean;          // Whether or not to show terms
}

class ClassSearcherProgramWindow extends React.Component<ClassSearcherProgramWindowProps, ClassSearcherProgramWindowState> {

    constructor(props: ClassSearcherProgramWindowProps) {
        super(props);
        this.state = {
            eligibleTerms: [],
            showingTerms: false
        };

        this.toggleAccepting = this.toggleAccepting.bind(this);
        this.addTermsToWindow = this.addTermsToWindow.bind(this);
    }

    /**
     * Determine all the terms that can be shown and present each as an option to the user
     */
    private addTermsToWindow(): void {
        let schedule = this.props.RefBackToSchedule.current;
        if (schedule) {
            let termRefs: RefObject<Term>[] = schedule.getTermRefs();
            let terms = [];
            for (let termRef of termRefs) {
                let term = termRef.current;

                // if (term && term.canAccept(this.props.classToAdd)) {
                if (term) {
                    terms.push(
                        <button
                            className={"addToTermButton"}
                            // TODO - Change this a little, but it's obviously not null, we just checked that.
                            // @ts-ignore
                            onClick={() => term.searcherAttemptReceive(this.props.classToAdd)}
                        >{term.getTitle()}</button>
                    )
                }
            }

            this.setState({eligibleTerms: terms});
        }
    }

    componentDidMount(): void {
        setInterval(this.addTermsToWindow, 100);
    }

    /**
     * Switch whether or not to show terms
     */
    public toggleAccepting() {
        this.setState({showingTerms: !this.state.showingTerms})
    }

    render() {
        return (
            <div className={"mainToProgramWindowContainer"}>
                {this.state.showingTerms ?
                    <div className={"cancelAndTermContainer"}>
                        <button
                            className={"cancelAddToSchedule"}
                            onClick={this.toggleAccepting}
                        >Cancel Add</button>
                        {this.state.eligibleTerms}
                    </div> :
                    <button
                        className={"scheduleTitleButton"}
                        onClick={this.toggleAccepting}
                    >{this.props.displayTitle}</button>
                }
            </div>
        )
    }
}

export default ClassSearcherProgramWindow;