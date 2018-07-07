/* eslint-disable */

// run this before running stuff through mon-fix.js

const fs = require('fs');



const mtf = require("../data/test.json");

const TRAITS = ["trait", "action", "legendary", "reaction"];
mtf.monster.forEach(m => {
TRAITS.forEach(t => {
	if (m[t]) {
		m[t].forEach(it => {
			it.entries = it.entries.map(e => {
				return e.replace(/\d+d\d+(\s?([-+])\s?\d+\s?)?/g, function (match) {
					return `{@dice ${match}}`;
				});
			});
		})
	}
})

// fix passive perception dupes
if (m.senses) {
	const cleanSenses = m.senses.trim().toLowerCase();
	if (cleanSenses === "none" || cleanSenses === "-") {
		m.passive = 0;
		delete m.senses;
	} else {
		try {
			m.senses = m.senses.trim();
			const match = /Perception (\d+)$/.exec(m.senses);
			m.passive = Number(match[1])
			m.senses = m.senses.replace(/(,\s*)?passive Perception (\d+)$/, "");
			if (!m.senses) delete m.senses;
		} catch (e) {
			console.error(e);
		}
	}
}

// purge "Options" traits
if (m.legendary) {
	m.legendary = m.legendary.filter(it => {
		return !(it.name === "Options" && it.entries[0].includes("3 legendary actions"))
	})
}
});

let doWrite = true;
if (doWrite) {
	const out = JSON.stringify(mtf, null, "\t").replace(/( )?\u2014( )?/g, "\\u2014").replace(/\u2013/g, "\\u2014");

	fs.writeFileSync(`trash/bestiary-toa.json`, out, "utf8");
}

console.log("done");

//
// const request = require('request');
//
// const download = function(uri, filename, callback){
// 	request.head(uri, function(err, res, body){
// 		// console.log('content-type:', res.headers['content-type']);
// 		// console.log('content-length:', res.headers['content-length']);
// 		if (err) {
// 			console.log(err);
// 		}
//
// 		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
// 	});
// };
//
//
//
// const tokens = require("../data/dump.json");
//
// download('https://www.google.com/images/srpr/logo3w.png', `trash/${"dicks"}.png`, () => {});
//
// tokens.forEach(t => {
// 	// console.log(t.name)
//
// 	const cleanName = t.name.replace(/[\\/.]/g, "").trim();
// 	download(t.url, `trash/${cleanName}.png`, () => console.log("done"));
// });