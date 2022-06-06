// React imports
import React, {ReactElement, RefObject} from "react";

// Stylesheet
import "./index.scss";

// Component imports
import Program from "./Program";
import {TimeBlockRequirements} from "../Schedule/Term/TimeBlock";
import ProgramSearchResults from "./ProgramSearchResults";

interface ProgramContainerState {
    classes: TimeBlockRequirements[];
    programs: string[];
    showProgramSearcher: boolean;
    search: string;
    ReactPrograms: ReactElement[];
}

let C1 = {
    "title": "C1: Science (15 CU)",
    "requirementGroup": [
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "CMPT 141", "CMPT 145"
            ]
        },
        {
            "totalRequired": 3,
            "eligibleCourses": [
                "BIOL 120",
                "BIOL 121",
                "CHEM 112",
                "CHEM 115",
                "CHEM 250",
                "GEOG 120",
                "GEOG 121",
                "GEOL 122",
                "ASTR 113",
                "PHYS 115",
                "PHYS 117"
            ],
            "description": "Basic Sciences."
        }
    ]
};
let C2 = {
    "title": "C2: Humanities Writing (6 CU)",
    "requirementGroup": [
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "BIOL 101",
                "CMRS 110",
                "HIST 115",
                "PHIL 120",
                "PHIL 133"
            ]
        }
    ]
};
let C3 = {
    "title": "C3: Social Science (6 CU)",
    "requirementGroup": [
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112",
                "ARCH 111",
                "IS 110",
                "LING 111",
                "SOC 112"
            ],
            "description": "Basic Social Sciences."
        }
    ]
};
let C4 = {
    "title": "C4: Mathematics and Statistics (6 CU)",
    "requirementGroup": [
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "MATH 110",
                "MATH 266"
            ]
        }
    ]
};
let C5 = {
    "title": "C5: General (6 CU)",
    "requirementGroup": [
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "Humanities",
                "Humanities",
                "Social Science",
                "Fine Arts",
                "Courses with No Program Type",
                "Humanities",
                "Social Science",
                "Fine Arts",
                "Courses with No Program Type",
                "Humanities",
                "Social Science",
                "Fine Arts",
                "Courses with No Program Type"
            ],
            "description": "General Requirement."
        }
    ]
};
let C6 = {
    "title": "C6: Major (45 CU)",
    "requirementGroup": [
        {
            "totalRequired": 6,
            "eligibleCourses": [
                "CMPT 214",
                "CMPT 215",
                "CMPT 260",
                "CMPT 270",
                "CMPT 280",
                "PHIL 232"
            ],
            "description": "Second-year CS"
        },
        {
            "totalRequired": 6,
            "eligibleCourses": [
                "CMPT 317",
                "CMPT 332",
                "CMPT 340",
                "CMPT 353",
                "CMPT 360",
                "CMPT 370",
                "CMPT 381"
            ]
        },
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "CMPT 410",
                "CMPT 411",
                "CMPT 412",
                "CMPT 410",
                "CMPT 411",
                "CMPT 412",
                "CMPT 410",
                "CMPT 411",
                "CMPT 412",
                "CMPT 410",
                "CMPT 411",
                "CMPT 412",
                "CMPT 410",
                "CMPT 411",
                "CMPT 412"
            ],
            "description": "Any CMPT 410+"
        },
        {
            "totalRequired": 1,
            "eligibleCourses": [
                "BINF 300",
                "CME 332",
                "CME 341",
                "CME 342",
                "CME 433",
                "CME 435",
                "CME 451",
                "CMPT 300+"
            ]
        }
    ]
};
let C7 = {
    "title": "C7: Elective (36 CU)",
    "requirementGroup": [
        {
            "totalRequired": 1,
            "eligibleCourses": [
                "EE 216",
                "ME 251",
                "STAT 242",
                "STAT 245"
            ]
        },
        {
            "totalRequired": 2,
            "eligibleCourses": [
                "MATH 112 or MATH 116",
                "MATH 211",
                "MATH 223",
                "MATH 225",
                "MATH 276",
                "MATH 327",
                "MATH 328",
                "MATH 363",
                "MATH 364",
                "PHIL 243",
                "STAT 241",
                "STAT 344",
                "STAT 345",
                "STAT 348"
            ],
            "description": "High-Level Math/Stats"
        },
        {
            "totalRequired": 1,
            "eligibleCourses": [
                "AREC 230",
                "COMM 204"
            ]
        },
        {
            "totalRequired": 6,
            "eligibleCourses": [
                "ANY"
            ],
            "description": "Electives",
            "electives": true
        }
    ]
};

let testData = [C1, C2, C3, C4, C5, C6, C7];

class ProgramContainer extends React.Component<any, ProgramContainerState> {

    // Ref for the search results for programs to be displayed in
    private readonly programSearchResultRef: RefObject<ProgramSearchResults>;

    constructor(props: any) {
        super(props);
        this.state = {
            classes: [],
            showProgramSearcher: true,
            programs: [],
            search: "",
            ReactPrograms: []
        };

        this.programSearchResultRef = React.createRef();

        // Function binding
        this.addProgram = this.addProgram.bind(this);
        this.removeProgram = this.removeProgram.bind(this);
        this.containsClass = this.containsClass.bind(this);
        this.programSearch = this.programSearch.bind(this);
        this.selectProgram = this.selectProgram.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    public selectProgram(program: string) {
        this.addProgram(program);
        console.log("Adding", program);
    }



    /**
     * Execute a search for programs, clean the data and send it to a result displayer.
     */
    public async programSearch() {

        let search: string = this.state.search;
        // Construct the search URL
        let apiURL: string = "http://localhost:8000/api/program/?";
        let searchDetails = search.replace(" ", "-");
        let url = apiURL; // + searchDetails;

        console.log(url);

        // Query and json-ify the results
        let results = await fetch(url).then(response => (response.json()));
        //let results = {"result": ["Bioinformatics_Professional_Internship_Option", "Classical,_Medieval_and_Renaissance_Studies_Bachelor_of_Arts_Four-year_(B.A._Four-year)", "Mathematics_Minor", "German_Minor", "Geology_Minor", "Aboriginal_Public_Administration_Bachelor_of_Arts_Four-year_(B.A._Four-year)", "Biology_Bachelor_of_Science_Honours_(B.Sc._Honours)", "French_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_French_-_Major_2", "French_Recognition_in_French", "Philosophy_Bachelor_of_Arts_Three-year_(B.A._Three-year)", "French_Bachelor_of_Arts_Honours_(B.A._Honours)", "History_Minor", "Geophysics_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Applied_Mathematics_Bachelor_of_Science_Three-year_(B.Sc._Three-year)", "Computer_Science_Bachelor_of_Science_Honours_Software_Engineering_Option_(B.Sc._Honours_SE)", "Mathematics_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Astronomy_Minor", "Applied_Mathematics_Minor", "Studio_Art_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Studio_Art_and_Art_History_-_Majors_1_and_2", "Art_History_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Art_History_-_Major_2", "Economics_Minor_-_Statistics", "Classical,_Medieval_and_Renaissance_Studies_Minor", "Computer_Science_Bachelor_of_Science_Three-year_(B.Sc._Three-year)", "Bioinformatics_Bachelor_of_Science_Honours_(B.Sc._Honours)", "Biology_Bachelor_of_Science_Three-year_(B.Sc._Three-year)", "English_Minor", "Computer_Science_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Music_Education_Bachelor_of_Music_(Music_Education)_(B.Mus.(Mus.Ed.))_-_Secondary", "Business_Economics_Minor_-_Statistics", "Computer_Science_Bachelor_of_Science_Honours_(B.Sc._Honours)", "Philosophy_Minor", "Biology_Bachelor_of_Science_Double_Honours_(B.Sc._Honours)_-_Biology_-_Major_1", "Philosophy_Bachelor_of_Arts_Four-year_(B.A._Four-year)", "Archaeology_Bachelor_of_Science_Honours_(B.Sc._Honours)", "Spanish_Minor", "French_Minor", "Interactive_Systems_Design_Professional_Internship_Option", "Geology_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Political_Studies_Minor", "Geology_Bachelor_of_Science_Three-year_(B.Sc._Three-year)", "Economics_Post-Degree_Specialization_Certificate", "Biology_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Indigenous_Studies_Minor", "Biology_Minor", "Interactive_Systems_Design_Bachelor_of_Arts_and_Science_Four-year_(B.A._and_Sc._Four-year)", "Statistics_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Geophysics_Bachelor_of_Science_Honours_(B.Sc._Honours)", "Psychology_Minor", "Indigenous_Studies_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Indigenous_Studies_-_Major_2", "Computer_Science_Professional_Internship_Option", "Economics_Minor", "French_Bachelor_of_Arts_Three-year_(B.A._Three-year)", "Religion_and_Culture_Bachelor_of_Arts_Three-year_(B.A._Three-year)", "Classical,_Medieval_and_Renaissance_Studies_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Classical,_Medieval_and_Renaissance_Studies_-_Major_2", "Toxicology_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Business_Economics_Bachelor_of_Arts_Four-year_(B.A._Four-year)", "French_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_French_-_Major_1", "Sociology_Minor", "Philosophy_Bachelor_of_Arts_Honours_(B.A._Honours)", "Archaeology_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Religion_and_Culture_Bachelor_of_Arts_Four-year_(B.A._Four-year)", "Classical,_Medieval_and_Renaissance_Studies_Bachelor_of_Arts_Honours_(B.A._Honours)", "Applied_Mathematics_Bachelor_of_Science_Honours_(B.Sc._Honours)", "Physics_Minor", "German_German_-_Recognition", "Chemistry_Minor", "Studio_Art_Minor", "French_Bachelor_of_Arts_Four-year_(B.A._Four-year)", "Philosophy_Bachelor_of_Arts_Double_Honours_-_Philosophy_-_Major_1", "Sociology_Double_Honours_-_Sociology_-_Major_2", "Classical,_Medieval_and_Renaissance_Studies_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Classical,_Medieval_and_Renaissance_Studies_-_Major_1", "Mathematics_Bachelor_of_Science_Double_Honours_-_Mathematics_-_Major_1", "Economics_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Economics_-_Major_2", "Religion_and_Culture_Minor", "Palaeobiology_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Religion_and_Culture_Bachelor_of_Arts_Honours_(B.A._Honours)", "Studio_Art_Bachelor_of_Arts_Double_Honours_(B.A._Honours)_-_Studio_Art_-_Major_2", "Mathematics_Bachelor_of_Science_Three-year_(B.Sc._Three-year)", "Religion_and_Culture_Double_Honours", "Applied_Mathematics_Bachelor_of_Science_Four-year_(B.Sc._Four-year)", "Geology_Bachelor_of_Science_Honours_(B.Sc._Honours)", "Aboriginal_Public_Administration_Bachelor_of_Arts_Honours_(B.A._Honours)", "Archaeology_Bachelor_of_Science_Double_Honours_(B.Sc._Honours)_-_Archaeology_-_Major_1", "Chemistry_Bachelor_of_Science_Three-year_(B.Sc._Three-year)", "Physics_Physics_Professional_Internship_Option", "Music_Bachelor_of_Music_Individualized_(B.Mus._Individualized)", "Music_Education_Bachelor_of_Music_Honours_(Music_Education)_(B.Mus.(Mus.Ed.))_-_Secondary", "Environment_and_Society_Co-operative_Education_Option", "Spanish_Recognition"]};

        console.log(results);
        let programResultDisplay = this.programSearchResultRef.current;
        if (programResultDisplay && results) {
            let filteredResults = ProgramContainer.cleanup(results)
                .filter(program => (ProgramContainer.allIn(search, program)));
            programResultDisplay.receiveResults(filteredResults);
        }
    }

    /**
     * Determine if every word in a space-separated string is in a different string
     * @param words
     * @param container
     */
    public static allIn(words: string, container: string) {
        for (let word of words.split(" ")) {
            if (!container.toLowerCase().includes(word.toLowerCase()))
                return false;
        } return true;
    }

    /**
     * Clean JSON from the Program Searcher
     * @param data
     */
    public static cleanup(data: any) {
        let cleanedData = [];
        let resultTotal: number = data["result"].length;
        for (let resultIndex = 0; resultIndex < resultTotal; resultIndex++) {
            cleanedData.push(data["result"][resultIndex])
        }
        return cleanedData.filter(i => i !== "index");
    }

    /**
     * Add a Program Title to the ScheduleEntry
     */
    public addProgram(program: string): void {
        if (!this.state.programs.includes(program)) {
            let newPrograms = this.state.programs.concat(program);
            this.setState({programs: newPrograms});
        }
    }

    public generatePrograms() {
        return this.state.programs.map((program) => (
            <Program
                title={program}
                currentCourses={this.state.classes.map((course) => (course.title))}
                deleteProgramCallback={this.removeProgram}
            />));
    }

    /**
     * Remove a particular program from the Program Container
     */
    public removeProgram(programTitle: string): void {
        let newPrograms = this.state.programs.filter(i => i !== programTitle);
        this.setState({programs: newPrograms})
        this.forceUpdate();
    }

    /**
     * Used for validation of programs; determine if a Program has a
     * @param className
     */
    public containsClass(className: string): boolean {
        for (let timeBlock of this.state.classes)
            if (timeBlock.title === className) return true;
        return false;
    }

    /**
     * "Accept" a class for the Program Container to validate requirements
     * @param className the title of the class, i.e. "CMPT 141", "PHIL 433", etc.
     */
    public acceptClass(className: TimeBlockRequirements): void {
        // This currently is a way of preventing duplicates but we might want that for class reattempts
        if (this.state.classes.includes(className))
            return;

        // Add the class and update state accordingly
        let newLabels = this.state.classes;
        newLabels.push(className);
        console.log("Now holding", newLabels);
        this.setState({classes: newLabels});
    }

    /**
     * Remove a class so that the Program validation does not depend on it
     * @param className the title of the class, i.e., "CMPT 141", "PHIL 433", etc.
     */
    public removeClass(className: TimeBlockRequirements): void {
        // The class was not found
        if (!this.state.classes.includes(className)) {
            console.log("Did not find " + className);
            return;
        }

        // Filter out the class and update state accordingly
        let newLabels = this.state.classes;
        newLabels = newLabels.filter((x) => (x !== className));
        this.setState({classes: newLabels});
    }

    /**
     * Remove a list of classes to no longer be used
     * @param classNames the list of classes to remove: ["CMPT 141", "PHIL 433"]
     */
    public removeClassList(classNames: TimeBlockRequirements[]): void {
        // Filter out any classes and update state accordingly
        let newClassList = this.state.classes;
        newClassList = newClassList.filter((i) => !classNames.includes(i));
        this.setState({classes: newClassList});
    }

    /**
     * Toggle displaying the Program Searcher
     */
    private toggleDisplaySearcher(): void {
        this.setState({showProgramSearcher: !this.state.showProgramSearcher});
    }

    /**
     * Handle any update on the search fields
     * @param event
     */
    onChange(event: any) {
        //event.preventDefault();
        let newValue = event.target.value || "";
        this.setState({search: newValue.trim()});
    }

    render() {

        return (
            <div className={"mainProgramContainer"}>

                {/* A button to toggle the Program Searcher */}
                <div className={"programSearcherNavbar"}>
                    <button
                        onClick={() => this.toggleDisplaySearcher()}
                        className={"toggleButton"}
                    >Toggle Program Searcher</button>

                    <div className={"programLinks"}>
                        <a
                            href={"https://admissions.usask.ca/programs/find-a-program.php#Programs"}
                            target={"_blank"}
                            rel="noopener noreferrer"
                            type={"button"}
                        >Browse Programs</a>
                    </div>
                </div>

                {/* The Program Searcher */}
                {this.state.showProgramSearcher ?

                    <div className={"programSearcherContainer"}>

                        <div className={"mainProgramSearcherContent"}>

                            <div className={"searchContainer"}>

                                {/* Basic Search Form */}
                                <div className={"searchAreaContent fields"}>
                                    <p className={"searchAreaTitle"}>Search by Name</p>
                                    <div className={"searchFields"}>
                                        <label>
                                            Name
                                            <input type={"text"} placeholder={"Computer Science"}
                                                   name={"search"} onChange={this.onChange}/>
                                        </label>
                                        <button
                                            onClick={this.programSearch}
                                            className={"searchBtn"}
                                        >Search</button>
                                    </div>
                                </div>

                                {/* Execute the search */}
                                {/*<button*/}
                                {/*    className={"classSearchButton"}*/}
                                {/*    onClick={this.programSearch}*/}
                                {/*>Search</button>*/}

                            </div>
                        </div>

                        <ProgramSearchResults
                            ref={this.programSearchResultRef}
                            proceedToAdd={this.selectProgram}
                        />
                    </div>
                : null}



                {/* this.state.classTitles.map((i) => (<p>{i}<br /></p>)) */}

                {this.generatePrograms()}
            </div>
        )
    }
}

export default ProgramContainer;