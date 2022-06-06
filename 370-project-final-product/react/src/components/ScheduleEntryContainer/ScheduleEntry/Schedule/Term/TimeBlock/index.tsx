// React imports
import React from "react";

// Interface for the parameters a TimeBlock requires
export interface TimeBlockRequirements {

    // Time - Necessary
    startTime: number;
    endTime: number;
    days: string[]; // ["Sunday", "Monday" ...

    // Title - Courses have title "SUBJ NUMB"
    title: string;
    location?: string;
    instructor?: string;
    term?: string;
}

// Wrapper to make the actual Time Block not need to know about the unitHeight for time offsets
interface TimeBlockProps {
    eventData: TimeBlockRequirements;
    heightOffset: number;
    blockHeight: number;

    colorHexCode: string;
}

class TimeBlock extends React.Component<TimeBlockProps> {

    render () {

        let unitHeight = 20;
        let offset = {
            // Generated - the number of units to offset by times the space per unit
            marginTop: (this.props.heightOffset * unitHeight) + "px",
            //outline: "1px solid " + this.props.colorHexCode,
            border: " #85b293 solid 1px",
            borderRadius: "3px",
            height: (unitHeight * this.props.blockHeight + unitHeight) + "px",
            fontSize: "10pt",
            boxShadow: "gray 1px 1px 1px",
            backgroundColor: " #85b293 ",
            overflow: "hidden"
        };

        return (
            <div className={"timeBlock"} style={offset}>
                <p className={"title"}>{this.props.eventData.title}</p>
                <p>
                    <span className={"time"}>
                        {this.props.eventData.startTime}
                    </span>-<span className={"time"}>
                        {this.props.eventData.endTime}
                    </span>
                </p>
                {this.props.eventData.location ? <p className={"location"}>{this.props.eventData.location}</p> : null}
                {this.props.eventData.instructor ? <p className={"instructor"}>{this.props.eventData.instructor}</p> : null}
            </div>
        )
    }
}

export default TimeBlock;