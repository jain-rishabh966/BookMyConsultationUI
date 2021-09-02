import React from "react";
import { Fragment } from "react";
import Header from "../../common/header/Header";

const Home = function (props) {
    return (
        <Fragment>
            <Header {...props} />
        </Fragment>
    );
};

export default Home;
