import React from "react";

import "./index.scss";

class AcademicAdviserButton extends React.Component<any, any> {

    render() {

        return (
            <div className={"ButtonContainer"}>
                <a
                    id={"helpPls"}
                    href={"https://students.usask.ca/academics/advisors.php#Undergraduateadvisors"}
                    target={"_blank"}
                    rel="noopener noreferrer"
                    type={"button"}
                >Academic Advisor</a>
            </div>
        );

    }

}

export default AcademicAdviserButton;
