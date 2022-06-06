// React imports
import React from "react";

// Stylesheet
import "./index.scss";

// Component imports;

interface ProgramSearchResultsProps {
    proceedToAdd: any;  // Callback used when selecting a program
}

interface ProgramSearchResultsState {
    resultData: string[];
}

class ProgramSearchResults extends React.Component<ProgramSearchResultsProps, ProgramSearchResultsState> {

    constructor(props: ProgramSearchResultsProps) {
        super(props);

        this.state = {
            resultData: []
        }
    }


    /**
     * Used to receive the cleaned and filtered search results
     * @param data
     */
    public receiveResults(data: any) {
        this.setState({resultData: data})
    }

    /**
     * Remove the _ from a program name to display it nicely
     * @param result the title to clean
     */
    public static fancy(result: string): string {
        let cleaned = "";
        for (let char of result) {
            if (char == "_")
                cleaned += " ";
            else
                cleaned += char;
        } return cleaned;
    }

    render() {
        return (
            <div className={"programSearchResultContainer"}>
                <div className={"programResults"}>
                    <p className={"col"}>Program Name</p>
                    {this.state.resultData.map((result) => (
                        <div className={"SearchResultsRow"}>
                            <p>{ProgramSearchResults.fancy(result)}</p>
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

export default ProgramSearchResults;