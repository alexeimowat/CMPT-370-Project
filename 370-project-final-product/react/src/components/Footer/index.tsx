import React from "react";

// Stylesheet
import "./index.scss";

// No props or state ; could be a functional component instead of class...
class Footer extends React.Component {

    render() {

        return (
            <div className={"footerContainer"}>
                <p>
                    Made by <a
                        href={"https://git.cs.usask.ca/brd171/370-project"}
                        target={"_blank"}
                        rel="noopener noreferrer"
                        >
                            Noēma
                        </a>
                        .
                </p>
            </div>
        )
    }

}

export default Footer;