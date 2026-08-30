import express from "express";

const app = express();

const PORT = 3000;

const courses = [
    {
        code: "COMP1511",
        name: "Programming Fundamentals",
        uoc: 6
    },
    {
        code: "COMP2521",
        name: "Data Structures and Algorithms",
        uoc: 6
    },
    {
        code: "MATH1081",
        name: "Discrete Mathematics",
        uoc: 6
    }
];


app.get("/", (req, res) => {
    res.json({
        message: "UNSW Planner API"
    });
});

app.get("/courses", (req, res) => {
    res.json(courses);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

