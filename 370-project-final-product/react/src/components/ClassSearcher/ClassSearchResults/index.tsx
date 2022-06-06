// React imports
import React from "react";

// Stylesheet
import "./index.scss";

// Component imports
import {TimeBlockRequirements} from "../../ScheduleEntryContainer/ScheduleEntry/Schedule/Term/TimeBlock";

interface ClassSearchResultsProps {
    proceedToAdd: any;  // Callback used when selecting a class
}

interface ClassSearchResultsState {
    resultData: TimeBlockRequirements[];
}

class ClassSearchResults extends React.Component<ClassSearchResultsProps, ClassSearchResultsState> {

    constructor(props: ClassSearchResultsProps) {
        super(props);

        this.state = {
            resultData: []
        }
    }

    /**
     * Used to receive the cleaned and filtered search results
     * @param data
     */
    public receiveResults(data: TimeBlockRequirements[]) {
        this.setState({resultData: data})
    }

    render() {
        return (
            <div className={"resultContainer"}>
                <div className={"results"}>
                    <p className={"col"}>Course Name</p> <p className={"col"}>Days</p>
                    <p className={"col"}>Start Time</p> <p className={"col"}>End Time</p>
                    <p className={"col"}>Location</p>
                    <p className={"col"}>Term</p>
                    <p className={"col"} />

                    {this.state.resultData.map((result) => (
                        <div className={"SearchResultsRow"}>
                            <p>{result.title}</p>
                            <p>{result.days}</p>
                            <p>{(result.startTime > 1700 ? "\u{1F319}": "") + result.startTime}</p>
                            <p>{result.endTime}</p>
                            <p>{result.location}</p>
                            <p>{result.term}</p>
                            <button
                                onClick={() => this.props.proceedToAdd(result)}
                            >Add</button>

                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ClassSearchResults;