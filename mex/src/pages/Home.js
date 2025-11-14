import React from "react";
import { Box } from "@mui/material";

import HeroBanner from "../components/HeroBanner";

const Home = (props) => {
    return (
        <Box>
            <HeroBanner isAuth={props.isAuth} />
        </Box>
    );
};

export default Home;
