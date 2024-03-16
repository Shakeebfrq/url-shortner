const express = require("express");
const {
  handleGenerateNewShortURL,
  getURL,
  handleGetAnalytics,
  signup,
  signin,
} = require("../controllers/url");
const router = require("express").Router();

router.post("/new", handleGenerateNewShortURL);

router.get("/:shortId", getURL);

router.get("/analytics/:shortid", handleGetAnalytics);

router.post("/signup", signup);

router.post("/signin", signin);

module.exports = router;
