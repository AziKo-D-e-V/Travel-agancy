const Io = require("../utils/io");
const makePlan = new Io("./database/tour.json");
const Tours = require("../models/plan.model.js");
const Joi = require("joi");
const datee = require('date-and-time');

const tourPlan = async (req, res) => {
  try {
    const { name, prices, startdate, duration } = req.body;

    const plans = await makePlan.read();

    const schema = Joi.object({
      name: Joi.string().alphanum().required(),
      prices: Joi.number().required(),
      startdate: Joi.date().iso().required(),
      duration: Joi.number().required(),
    });

    const { error } = schema.validate({
      name,
      prices,
      startdate,
      duration,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const id = (plans[plans.length - 1]?.id || 0) + 1;
    const newPlan = new Tours(id, name, prices, startdate, duration);

    const data = plans.length ? [...plans, newPlan] : [newPlan];

    const nimadir = plans.some(
      (pl) =>
        pl.name === name &&
        pl.prices === prices &&
        pl.startdate === startdate &&
        pl.duration === duration
    );

    if (nimadir) {
      return res.status(500).json({message: 'Already exists'})
    }



    await makePlan.write(data);

    res.status(201).json({ message: "Successfully added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const findTour = async (req, res) => {
//   try {
//     const { prices, startdate, duration } = req.body;

//     const plans = await makePlan.read();

//     const schema = Joi.object({
//       prices: Joi.number().required(),
//       startdate: Joi.date().iso().required(),
//       duration: Joi.number().required(),
//     });

//     const { error } = schema.validate({
//       prices,
//       startdate,
//       duration,
//     });

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     const foundPlan = plans.find((plan) => plan.prices <= prices);

//     if (!foundPlan) {
//       return res.status(404).json({ message: "No matching tour plan found" });
//     }

//     const output = {
//       name: foundPlan.name,
//       prices: prices.toString(),
//       startdate,
//       duration: duration.toString(),
//     };

//     res.status(200).json({ message: "Successfully found", plan: output });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const findTour = async (req, res) => {
  try {
    const { prices, duration, startdate } = req.body;

    const plans = await makePlan.read();

    const schema = Joi.object({
      prices: Joi.number().required(),
      duration: Joi.number().required(),
      startdate: Joi.date().iso().required(),
    });

    const { error } = schema.validate({
      prices,
      duration,
      startdate,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const filteredPlans = plans.filter(
      (plan) => plan.prices <= prices && plan.duration <= duration
    );

    if (filteredPlans.length === 0) {
      return res.status(404).json({ message: "No matching tour plans found" });
    }

    const sortedPlans = filteredPlans.sort(
      (a, b) => new Date(a.startdate) - new Date(b.startdate)
    );

    const availablePlans = sortedPlans.filter(
      (plan) => new Date(plan.startdate) >= new Date(startdate)
    );

    if (availablePlans.length === 0) {
      return res.status(404).json({ message: "No available tour plans found" });
    }

    const selectedPlan = availablePlans[0];

    const output = {
      name: selectedPlan.name,
      prices: selectedPlan.prices.toString(),
      startdate: startdate,
      duration: selectedPlan.duration.toString(),
    };

    res.status(200).json({ message: "Successfully found", plan: output });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  tourPlan,
  findTour,
};
