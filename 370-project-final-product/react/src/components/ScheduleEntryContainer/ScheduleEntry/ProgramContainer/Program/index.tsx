// React imports
import React, {ReactElement} from "react";

// Stylesheet
import "./index.scss";

// Component imports
import Requirement, {Emphasis, RequirementData} from "./Requirement";

interface ProgramProps {
    title: string;
    currentCourses: string[];
    deleteProgramCallback: any;
}

interface ProgramState {
    emphasis: Emphasis;
    requirements: RequirementData[];
}

/**
 * The title of the Program and collection of its requirements
 */
class Program extends React.Component<ProgramProps, ProgramState> {

    constructor(props: ProgramProps) {
        super(props);

        this.state = {
            emphasis: Emphasis.Neither,
            requirements: []
        };
    }

    /**
     * Used to toggle the emphasis of requirements
     */
    public cycleEmphasis(): void {
        if (this.state.emphasis === Emphasis.Neither)
            this.setState({emphasis: Emphasis.Fulfilled});
        else if (this.state.emphasis === Emphasis.Fulfilled)
            this.setState({emphasis: Emphasis.Unfulfilled});
        else
            this.setState({emphasis: Emphasis.Neither});
    }

    /**
     * Determine the text to show on the button to cycle emphasis
     */
    public getEmphasisText(): string {
        if (this.state.emphasis === Emphasis.Neither)
            return "Show Completed Courses";
        else if (this.state.emphasis === Emphasis.Fulfilled)
            return "Show Remaining Courses";
        else
            return "Show No Emphasis";
    }

    async componentDidMount() {

        console.log("Adding with", this.props.currentCourses)
        let apiURL: string = "http://localhost:8000/api/program/?program=";
        let url = apiURL + this.props.title;

        console.log(url);

        // Query and json-ify the results

        let results = await fetch(url).then(response => (response.json()));
        //let results = {"result": [{"Section Type": "C1 College Requirement (15 credit units)", "Option List": [{"numberOf": 2, "classes": ["ANTH 302.3", "ANTH 310.3", "ANTH 405.3", "ANTH 421.3", "ENG 110.6", "ENG 111.3", "ENG 112.3", "ENG 113.3", "ENG 114.3", "ENG 120.3", "ENG 202.6", "ENG 203.3", "ENG 204.3", "ENG 290.6", "ESL 116.3", "HIST 115.3", "HIST 125.3", "HIST 135.3", "HIST 145.3", "HIST 155.3", "HIST 165.3", "HIST 175.3", "HIST 185.3", "HIST 193.3", "HIST 194.3", "INTS 203.3", "MUS 155.3", "PHIL 115.3", "PHIL 120.3", "PHIL 121.3", "PHIL 133.3", "PHIL 208.3", "PHIL 233.3", "POLS 245.3", "POLS 323.3", "POLS 328.3", "POLS 333.3", "POLS 336.3", "POLS 422.3", "POLS 461.3", "PSY 323.3", "PSY 355.3", "RLST 280.3", "RLST 362.3"], "info": []}, {"numberOf": 1, "classes": ["ANTH 202.3", "ANTH 480.3", "ARCH 350.3", "DRAM 111.3", "ENG 242.3", "ENG 243.3", "ENG 335.3", "HIST 195.3", "HIST 266.3", "INDG 107.3", "LING 253.3", "PLAN 445.3", "POLS 222.3", "INDG \u2014 200-Level, 300-Level, 400-Level"], "info": []}, {"numberOf": 1, "classes": ["MATH 110.3", "MATH 176.3"], "info": []}]}, {"Section Type": "other", "Option List": [{"numberOf": 3, "classes": ["ART 110.3", "ART 111.6", "ART 112.6", "ART 136.3", "ART 141.3", "ART 151.3", "ART 152.3", "ART 161.3", "ARTH 120.3", "ARTH 121.3", "DRAM 101.3", "DRAM 104.6", "DRAM 108.3", "DRAM 110.3", "DRAM 111.3", "DRAM 113.3", "DRAM 118.3", "DRAM 119.3", "DRAM 121.3", "MUS 101.3", "MUS 105.3", "MUS 111.3", "MUS 120.2", "MUS 121.2", "MUS 125.1", "MUS 133.3", "MUS 134.3", "MUS 155.3", "MUS 156.3", "MUS 175.3", "MUS 184.3", "Any senior-level fine arts course provided that the prerequisite is met.", "ARBC 114.3", "ARBC 117.3", "CHIN 114.3", "CHIN 117.3", "CLAS 105.3", "CLAS 110.3", "CLAS 111.3", "CMRS 110.3", "CMRS 111.3", "CREE 101.6", "CREE 110.3", "ENG 110.6", "ENG 111.3", "ENG 112.3", "ENG 113.3", "ENG 114.3", "ENG 120.3", "ESL 115.3", "ESL 116.3", "FREN 103.3", "FREN 106.3", "FREN 122.3", "FREN 125.3", "FREN 218.3", "GERM 114.3", "GERM 117.3", "GRK 112.3", "GRK 113.3", "HEB 114.3", "HEB 117.3", "HIST 115.3", "HIST 125.3", "HIST 135.3", "HIST 145.3", "HIST 155.3", "HIST 165.3", "HIST 175.3", "HIST 185.3", "HIST 193.3", "HIST 194.3", "HNDI 114.3", "HNDI 117.3", "JPNS 114.3", "JPNS 117.3", "LATN 112.3", "LATN 113.3", "LING 110.3", "LING 113.3", "LIT 110.3", "LIT 111.3", "MUS 111.3", "PHIL 110.6", "PHIL 115.3", "PHIL 120.3", "PHIL 121.3", "PHIL 133.3", "PHIL 140.3", "RLST 111.3", "RLST 112.3", "RLST 113.3", "RUSS 114.3", "RUSS 117.3", "SNSK 114.3", "SNSK 117.3", "SPAN 114.3", "SPAN 117.3", "UKR 114.3", "UKR 117.3", "WGST 112.3", "Any senior-level humanities course provided that the prerequisite is met and not more than 6 credit units in one subject are used for the Humanities or Languages Requirements.", "Certain WGST courses may be considered a Humanities and/or Social Science. Refer to the course descriptions.", "CLAS 101, CLAS 103, CLAS 104, CLAS 107 and CLAS 203 may not be used to fulfill the Humanities requirement.", "ANTH 111.3", "ARCH 112.3", "ARCH 116.3", "ECON 111.3", "ECON 114.3", "GEOG 130.3", "GEOG 150.3", "HLST 110.3", "INDG 107.3", "IS 110.3", "LING 111.3", "LING 112.3", "LING 113.3", "POLS 111.3", "POLS 112.3", "PSY 120.3", "PSY 121.3", "SOC 111.3", "SOC 112.3", "WGST 112.3", "Any senior-level social science course provided that the prerequisite is met.", "Statistics courses in social sciences are not\u00a0eligible for use in this requirement (e.g. PSY 233,\u00a0PSY 234,\u00a0SOC 225 and\u00a0SOC 325).", "INTS 110.3", "INTS 111.3", "INTS 112.3", "INTS 201.3", "INTS 203.3", "INTS 380.3"], "info": ""}]}, {"Section Type": "other", "Option List": [{"numberOf": 3, "classes": ["BIOL 120.3", "BIOL 121.3", "CHEM 112.3", "CHEM 115.3", "CHEM 250.3", "GEOG 120.3", "GEOL 121.3", "GEOL 122.3", "ASTR 113.3", "PHYS 115.3", "PHYS 117.3 or PHYS 125.3", "STAT 242.3", "STAT 245.3", "EE 216.3 (EE 216.3 is only for students in the College of Engineering)", "ME 251.3 (ME 251.3 is only for students in the College of Engineering)", "MATH 112.3 or MATH 116.3", "MATH 211.3", "MATH 223.3", "MATH 225.3", "MATH 276.3", "MATH 327.3", "MATH 328.3", "MATH 361.3 and MATH 362.3", "MATH 364.3", "STAT 241.3", "STAT 344.3", "STAT 345.3", "STAT 348.3", "PHIL 243.3", "AREC 230.3", "COMM 102.3", "COMM 105.3", "COMM 201.3", "COMM 203.3", "COMM 204.3", "COMM 205.3", "COMM 210.3", "COMM 304.3", "ECON 111.3", "ECON 114.3", "ENT 210.3", "ENT 220.3", "ENT 230.3"], "info": ""}]}, {"Section Type": "other", "Option List": [{"numberOf": 16, "classes": ["CMPT 116.3 or CMPT 141.3", "CMPT 117.3 or CMPT 145.3", "CMPT 214.3", "CMPT 215.3 or CME 331.3", "CMPT 260.3", "CMPT 270.3", "CMPT 280.3", "CMPT 332.3", "CMPT 340.3", "CMPT 353.3", "CMPT 360.3", "CMPT 370.3", "CMPT 371.3", "CMPT 470.3", "CMPT 481.3", "PHIL 232.3"], "info": []}, {"numberOf": 2.0, "classes": ["CMPT \u2014 300-Level, 400-Level"], "info": [" BINF 300.3", " up to 2 courses from CME 332.3, CME 341.3, CME 342.3, CME 433.3, CME 435.3, CME 451.3"]}]}, {"Section Type": "other", "Option List": [{"numberOf": 0.0, "classes": "any", "info": []}]}]};

        //console.log(results);

        //let programResultDisplay = this.programSearchResultRef.current;
        //if (programResultDisplay && results) {
        //    let filteredResults = ProgramContainer.cleanup(results)
        //        .filter(program => (ProgramContainer.allIn(search, program)));
        //    programResultDisplay.receiveResults(filteredResults);
        //}

        let cleaned = Program.cleanup(results);
        //console.log(cleaned);


        this.setState({requirements: cleaned})
    }

    /**
     * Determine if a class given is contained in the list of classes provided
     * @param className
     */
    public hasClass(className: string): boolean {
        for (let cl of this.props.currentCourses) {
            if (className.includes(cl.toUpperCase()))
                return true;
            if (cl.slice(-2)[0] === "." && className.includes(cl.substr(0, cl.length-2).toUpperCase()))
                return true;
        } return false;
    }

    /**
     * Determine the styling class a string should have, depending on emphasis and validation
     * @param className
     */
    public getClass(className: string) {
        let emphasis = this.state.emphasis;
        //console.log(className);
        if (this.hasClass(className)) {

            if (emphasis === Emphasis.Neither)
                return "strikethrough";
            else if (emphasis === Emphasis.Fulfilled)
                return "fadeout";
            else
                return "";


        } else {
            if (emphasis === Emphasis.Neither)
                return "";
            else if (emphasis === Emphasis.Fulfilled)
                return "";
            else
                return "fadeout";
        }
    }

    /**
     * Helper function to clean the JSON returned from the Program Search query
     * @param data the data to cleanup
     */
    public static cleanup(data: any): RequirementData[] {
        let cleanedData: RequirementData[] = [];
        let resultTotal: number = data["result"].length;
        for (let resultIndex = 0; resultIndex < resultTotal; resultIndex++) {

            let section = data["result"][resultIndex];

            //console.log(section);

            let title = section["Section Type"];
            let sectionLength = section["Option List"].length;

            let subSections = [];
            for (let subSectionIndex = 0; subSectionIndex < sectionLength; subSectionIndex++) {
                let subSection = section["Option List"][subSectionIndex];


                //console.log(subSection);
                subSections.push(
                    {
                        totalRequired: subSection.numberOf,
                        eligibleCourses: subSection.classes,
                        description: subSection.classes,
                        electives: title.toLocaleString().includes("Elective")
                    }
                );
            }

            cleanedData.push({
                title: title,
                requirementGroup: subSections
            });

        }
        return cleanedData;
    }

    /**
     * Clean a title and remove _
     * @param title
     */
    public static cleanTitle(title: string): string {
        let cleaned = "";
        for (let char of title) {
            if (char == "_")
                cleaned = cleaned.concat(" ");
            else
                cleaned = cleaned.concat(char);
        } return cleaned;
    }

    render() {

        let toHTML: ReactElement[] = [];

        for (let group of this.state.requirements) {

            let classGroups: ReactElement[] = [];
            for (let x of group.requirementGroup) {
                let classes = [];
                //console.log(x.eligibleCourses);
                if (x.eligibleCourses[0] === "a")
                    classes.push(<li>{x.description}</li>);
                else
                    for (let c of x.eligibleCourses) {
                        classes.push(<li className={this.getClass(c)}>{c}</li>)
                    }
                if (classes.length != x.totalRequired && x.totalRequired > 0)
                    classGroups.push(
                        <label><span className={"theLabel"}>{x.totalRequired} of the following:</span>
                            <ul className={"colOfClasses"}>{classes}</ul>
                        </label>) ;
                else
                    classGroups.push(
                        <label>
                            &nbsp;
                            <ul className={"colOfClasses"}>{classes}</ul>
                        </label>)
            }
            toHTML.push(
                <div className={"classGroup"}>
                    <p className={"title"}>{group.title}</p>
                    {classGroups}
                </div>)
        }

        return (
            <div className={"programContainer"}>
                <div className={"programHeaderContent"}>
                    <p className={"programTitle"}>{Program.cleanTitle(this.props.title)}</p>

                    <div className={"programButtons"}>
                        <button
                            onClick={() => this.cycleEmphasis()}
                            className={"emphasisChange"}
                        >{this.getEmphasisText()}</button>
                        <button
                            onClick={() => this.props.deleteProgramCallback(this.props.title)}
                            className={"deleteProgramButton"}
                        >Delete</button>
                    </div>
                </div>
                <div className={"mainRequirementContainer"}>
                    {toHTML}
                </div>
            </div>
        )

    }
}

export default Program;