// React imports
import React from "react";

// Stylesheet
import "./index.scss";

// Component imports
import TimeBlock, {TimeBlockRequirements} from "../TimeBlock";

interface DayProps {
    day: string;    // Which day of the week
    dayStart: number;   // What time the day starts at
    timeEvents: TimeBlockRequirements[];
}

class Day extends React.Component<DayProps> {

    /**
     * Determine the number of units between two arbitrary times
     * @param end The ending time of the first event
     * @param start The start time of the second event
     */
    protected static unitsBetween(end: number, start: number) : number {
        //console.log(end);
        //console.log(start);
        let endMinutes = 60 * Math.floor(end/100) + end%100;
        let startMinutes = 60 * Math.floor(start/100) + start%100;
        return (startMinutes - endMinutes) / 30
    }

    /**
     * Calculate the amount of offset a given item is from the time block before it, if one exists.
     * @param current
     */
    private calculateTimeOffset(current: number) : number {
        if (current === 0)  // First Event, compare with dayStart
            return Day.unitsBetween(this.props.dayStart, this.props.timeEvents[current].startTime);
        else        // Compare with prior event
            return Day.unitsBetween(this.props.timeEvents[current-1].endTime, this.props.timeEvents[current].startTime)
    }

    render() {

        let colors = ["#C1E7E3", "#FFDCF4", "#DABFDE"];

        // Generate all the time blocks from the events stored
        let timeBlocks = this.props.timeEvents.map((timeEvent, index) => (
           <TimeBlock
               heightOffset={this.calculateTimeOffset(index)}
               blockHeight={Day.unitsBetween(timeEvent.startTime, timeEvent.endTime)-1}
               colorHexCode={colors[index % colors.length]}
               eventData={{
                   title: timeEvent.title,
                   startTime: timeEvent.startTime,
                   endTime: timeEvent.endTime,
                   location: timeEvent.location,
                   days: timeEvent.days
               }}
           />
        ));

        return (
            <div className={"dayContainer"}>
                <div className={"day"}>
                    <p>{this.props.day}</p>
                </div>

                <div className={"timeBlockContainer"}>
                    {timeBlocks}
                </div>
            </div>
        )
    }
}

export default Day;