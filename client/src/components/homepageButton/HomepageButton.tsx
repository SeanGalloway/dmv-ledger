import React from "react";
import { Link } from "react-router-dom";
import "./HomepageButton.css";

const HomepageButton = (props: {text: string, subtitle: string, to: string}) => {
    return (
        <Link to={props.to} className="homepage-button">
            <h1>
                {props.text}
            </h1>
            <p>
                {props.subtitle}
            </p>
        </Link>
    )
}

export default HomepageButton;