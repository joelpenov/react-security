const express = require("express");
require("dotenv").config();
var jwt = require("express-jwt");
var jwks = require("jwks-rsa");
var checkScope = require("express-jwt-authz");

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

const app = express();

app.get("/public", (req, res) => {
  res.json({
    message: "Hello!"
  });
});

app.get("/private", jwtCheck, (req, res) => {
  res.json({
    message: "Private!"
  });
});

const courses = {
  courses: [
    {
      id: 1,
      title: "Securing React Apps with Auth0",
      slug: "react-auth0-authentication-security",
      authorId: 1,
      category: "JavaScript"
    },
    {
      id: 2,
      title: "React: The Big Picture",
      slug: "react-big-picture",
      authorId: 1,
      category: "JavaScript"
    },
    {
      id: 3,
      title: "Creating Reusable React Components",
      slug: "react-creating-reusable-components",
      authorId: 1,
      category: "JavaScript"
    },
    {
      id: 4,
      title: "Building a JavaScript Development Environment",
      slug: "javascript-development-environment",
      authorId: 1,
      category: "JavaScript"
    },
    {
      id: 5,
      title: "Building Applications with React and Redux",
      slug: "react-redux-react-router-es6",
      authorId: 1,
      category: "JavaScript"
    },
    {
      id: 6,
      title: "Building Applications in React and Flux",
      slug: "react-flux-building-applications",
      authorId: 1,
      category: "JavaScript"
    },
    {
      id: 7,
      title: "Clean Code: Writing Code for Humans",
      slug: "writing-clean-code-humans",
      authorId: 1,
      category: "Software Practices"
    },
    {
      id: 8,
      title: "Architecting Applications for the Real World",
      slug: "architecting-applications-dotnet",
      authorId: 1,
      category: "Software Architecture"
    },
    {
      id: 9,
      title: "Becoming an Outlier: Reprogramming the Developer Mind",
      slug: "career-reboot-for-developer-mind",
      authorId: 1,
      category: "Career"
    },
    {
      id: 10,
      title: "Web Component Fundamentals",
      slug: "web-components-shadow-dom",
      authorId: 1,
      category: "HTML5"
    }
  ]
};

app.get("/courses", jwtCheck, checkScope(["read:courses"]), (req, res) => {
  res.json(courses);
});

app.listen(2014);
console.log(`API running on ${process.env.REACT_APP_API_URL}`);
