import { Typography } from "@mui/material";
import Exercises from "../components/Exercises";
import styles from "./ExercisesPage.module.scss";

const ExercisesPage = () => {
    return (
        <div className={styles.container}>
            <Typography
                id="exercise"
                fontWeight={600}
                color="#FF2625"
                sx={{
                    opacity: "0.1",
                    display: { lg: "block", xs: "none" },
                    fontSize: "200px",
                }}>
                Упражнения
            </Typography>
            <Exercises />
        </div>
    );
};

export default ExercisesPage;
