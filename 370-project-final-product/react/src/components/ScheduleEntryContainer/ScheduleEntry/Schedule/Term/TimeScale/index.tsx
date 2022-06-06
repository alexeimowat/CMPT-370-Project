// React import
import React from "react";

// Stylesheet
import "./index.scss";

interface TimeScaleProps {
    dayStart: number;
    twentyFourHour: boolean;
}

class TimeScale extends React.Component<TimeScaleProps> {

    render() {

        // This is used as a way of hard-coding the height of a unit of time. I know, it's dirty but it works.
        const timeUnit = { height: "20px" };

        // Push a "Label" for the column
        let times = [];
        times.push(
            <div style={timeUnit}>
                <p>Time</p>
            </div>
        );

        // TODO - Controlled start/end renderings
        let cur: number = this.props.dayStart;
        // Generate all the units of time
        while (cur < 2200) {

            // Generate the hour and minute sections from 'cur'
            let hour = Math.floor(cur / 100);
            let minutes = cur % 100; //start % 100 === 0 ? 0 : null}
            let suffix = hour >= 12 ? "p.m." : "a.m.";
            if (!this.props.twentyFourHour && hour > 12) hour %= 12;

            times.push(
                <div style={timeUnit} className={"time"}>
                    <p>{hour}:{minutes}{minutes === 0 ? 0 : null}{this.props.twentyFourHour ? "h" : suffix}</p>
                </div>
            );

            cur += 30;
            if (cur % 100 === 60) cur += 40;
        }

        return (
            <div className={"timeScale"}>
                {times}
            </div>
        )
    }
}

export default TimeScale;