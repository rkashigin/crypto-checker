const { Router } = require("express");
const config = require("config");
const Check = require("../models/Check");
const auth = require("../middleware/auth.middleware");
const axios = require("axios");
const router = Router();

router.post("/", auth, async (req, res) => {
  try {
    const market = req.body.pair.replace("/", "");
    const tick_interval = req.body.interval;
    const url = `https://api.binance.com/api/v1/klines?symbol=${market}&interval=${tick_interval}&limit=1`;
    const data = await axios.get(url).then((response) => response.data[0]);

    const check = new Check({
      pair: req.body.pair,
      interval: req.body.interval,
      price: data[4],
      owner: req.body.owner,
    });

    const lastCheck = await Check.findOne({
      owner: req.body.owner,
      pair: req.body.pair,
      interval: req.body.interval,
    }).sort({
      date: -1,
    });

    await check.save();

    if (lastCheck) {
      res.status(201).json({
        check,
        lastCheck,
      });
    } else {
      res.status(201).json({
        check,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong. Try again please.",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const checks = await Check.find({
      owner: req.user.code,
    });
    res.json(checks);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong. Try again please.",
    });
  }
});

module.exports = router;
