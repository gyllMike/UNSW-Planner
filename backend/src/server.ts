import express from "express";
import { adminAuthLogin, adminAuthRegister } from "./auth.js";

const app = express();
const PORT = 3000;

app.use(express.json());

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


// routes

app.get("/", (req, res) => {
    res.json({
        message: "UNSW Planner API"
    });
});

app.get("/courses", (req, res) => {
    res.json(courses);
});


/**
 * POST /v1/admin/auth/register
 *
 * user input the information and registered
 * 
 * @param {string} email        200.user.email - user put the email
 * @param {string} password     200.user.password - user put the password
 * @param {string} nameFirst    200.user.nameFirst - user put the nameFirst
 * @param {string} nameLast     200.user.nameLast - user put the nameLast
 * @param {string} programName  200.user.programName - user put the programName
 * @param {number} age          200.user.age - user put the age
 * @returns {Object} 200 - The generated controlUserSessionId
 *
 */
app.post('/v1/admin/auth/register', async (req, res) => {
  const {
    email,
    password,
    nameFirst,
    nameLast,
    programName,
    age,
  } = req.body;

  const result = await adminAuthRegister(
    email,
    password,
    nameFirst,
    nameLast,
    programName,
    age
  );

  res.status(200).json(result);
});

app.post('/v1/admin/auth/login', async (req, res) => {
    const {
        email,
        password,
    } = req.body;

    const result = await adminAuthLogin(email, password);

    res.status(200).json(result);
});

// dealing none route
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// wrong middlelware
app.use((
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.status(err.status ?? 500).json({
    error: err.message ?? 'Internal server error',
  });
});

// open server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
