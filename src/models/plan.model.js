class Plan {
  constructor(id, name, prices, startdate, duration) {
    this.id = id;
    this.name = name;
    this.prices = prices;
    this.startdate = startdate;
    this.duration = duration;
    this.createdAt = new Date();
  }
}

module.exports = Plan;
