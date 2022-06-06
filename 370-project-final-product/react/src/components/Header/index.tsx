import React from "react";

// Stylesheet
import "./index.scss";
import AcademicAdviserButton from "./AdvisorLinks";

/*
 No props or state ; could possible have this read a JSON file or something so that the links
 to advisors or program lists are read from the database! Something to consider.
 */
class Header extends React.Component {

    render() {

        return (
            <div className={"headerContainer"}>
                <p>uPlan</p>
                <AcademicAdviserButton/>
            </div>
        )
    }

}

export default Header;