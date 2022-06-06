// React imports
import React from "react";

// Stylesheet
import "./index.scss";

// The specific data required to represent a requirement
export interface RequirementData {
    title: string;
    requirementGroup: {
        totalRequired: number;
        eligibleCourses: string[];
        description ?: string;
        electives ?: boolean;
    }[];
}

export enum Emphasis {
    Neither = 0,
    Fulfilled = 1,
    Unfulfilled = 2
}

export interface RequirementProps {
    data: RequirementData;
    currentCourses: string[];
    emphasis: Emphasis;
}

/**
 * A single Requirement Group, C1, C2, etc.
 */
class Requirement extends React.Component<RequirementProps> {

    /**
     * Validate whether or not a given class is in a list
     * @param className the class to check
     */
    private validate(className: string): boolean {
        return this.props.currentCourses.includes(className);
    }

    /**
     * Validate whether or not to show a strikethrough on a given class, depending on
     *  validation and emphasis
     * @param className the class to check
     */
    private getClass(className: string): string {
        if (this.validate(className)) {
            if (this.props.emphasis === Emphasis.Neither)
                return "strikethrough";
            else if (this.props.emphasis === Emphasis.Fulfilled)
                return "fadeout";
            else
                return "";
        } else {
            if ((this.props.emphasis === Emphasis.Neither) || (this.props.emphasis === Emphasis.Fulfilled))
                return "";
            else
                return "fadeout";
        }
    }

    render() {

        return (
            <div className={"requirementContainer"}>
                <p className={"categoryTitle"}>{this.props.data.title}</p>
                {this.props.data.requirementGroup.map((group) => (
                    <div className={"requirementGroup"}>
                        <p className={"subsetTitle"}>{group.totalRequired} of the following:</p>
                        <ul>
                            {
                                (!group.electives) && (group.totalRequired === group.eligibleCourses.length || group.eligibleCourses.length <= 12) ?
                                    (group.eligibleCourses.map((req) => (
                                        <li className={this.getClass(req)}>{req}</li>
                                ))) : <li className={"requirementDescription"}>{group.description}</li>}
                        </ul>
                    </div>))
                }
            </div>
        )
    }

}

export default Requirement;