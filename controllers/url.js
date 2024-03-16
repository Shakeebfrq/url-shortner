const shortid = require("shortid");
const URL = require("../models/url");
const User = require("../models/user.model");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortId = shortid(8);
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortId });
}

const getURL = async (req, res) => {
  try {
    const shortId = req.params.shortId;

    if (!shortId) {
      return res.status(400).json({ error: "Short ID is required." });
    }

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error retrieving URL:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    if (!shortId) {
      return res.status(400).json({ error: "Short ID is required." });
    }

    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    const totalClicks = result.visitHistory ? result.visitHistory.length : 0;
    const analytics = result.visitHistory || [];

    return res.json({
      totalClicks,
      analytics,
    });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  const user = await User.create(req.body);
  return res.json({
    status: "success",
    data: user,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please provide the email and password", 400);
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return res.send("Invalid credentials", 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.send("Password Incorrect");
  }
  return res.json({
    status: "success",
    msg: "Login Successfull",
  });
};

module.exports = {
  handleGenerateNewShortURL,
  getURL,
  handleGetAnalytics,
  signup,
  signin,
};
