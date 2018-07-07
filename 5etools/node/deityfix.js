/* eslint-disable */
const fs = require('fs');
const ut = require('../js/utils');


const gods = require("../data/deities");

gods.deity.forEach(g => {
	delete g.reprinted
});


const out = JSON.stringify(gods, null, "\t").replace(/\s*\u2014\s*/g, "\\u2014").replace(/\s*\u2013\s*/g, "\\u2014");

fs.writeFileSync(`trash/deities.json`, out, "utf8");