import React from "react";
import HomepageButton from "../../components/homepageButton/HomepageButton"

const Homepage = () => {
    return (
        <div>
            <div className="flex-row">
                <HomepageButton to="/registration-services" text="Registration services" subtitle="Obtain or renew vehicle registrations"/>
                <HomepageButton to="/driver-services" text="Driver Services" subtitle="Apply for or renew drivers license, obtain vital record"/>
                <HomepageButton to="/vehicle-services" text="Vehicle services" subtitle="Buy, sell, or transfer vehicles"/>
            </div>
        </div>
    )
};

export default Homepage;