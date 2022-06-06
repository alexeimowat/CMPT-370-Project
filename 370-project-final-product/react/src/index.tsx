// React library imports
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';

// Stylesheet import
import './index.scss';

// Component imports
import Header from "./components/Header";
import ClassSearcher from "./components/ClassSearcher";
import ScheduleEntryContainer from "./components/ScheduleEntryContainer";
import Footer from "./components/Footer";
import ProgramContainer from "./components/ScheduleEntryContainer/ScheduleEntry/ProgramContainer";

class Page extends React.Component {

    // A ref to allow the Class Searcher to be connected to from the Schedule Entry Container
    public readonly ClassSearcherRef: React.RefObject<ClassSearcher>;

    // Ref to allow this container to be connected to the Class Searcher
    public readonly ScheduleEntryContainerRef: React.RefObject<ScheduleEntryContainer>;

    constructor(props: any) {
        super(props);

        // Create some refs
        this.ClassSearcherRef = React.createRef();
        this.ScheduleEntryContainerRef = React.createRef();
    }

    render() {
        return (
            <div className={"pageContainer"}>
                <Header/>
                <ClassSearcher
                    ref={this.ClassSearcherRef}
                    scheduleEntryContainerRef={this.ScheduleEntryContainerRef}
                />
                <ScheduleEntryContainer
                    classSearcherRef={this.ClassSearcherRef}
                    ref={this.ScheduleEntryContainerRef}
                />
                <Footer/>
            </div>
        )
    }
}

ReactDOM.render(<Page />, document.getElementById('root'));
serviceWorker.unregister();
