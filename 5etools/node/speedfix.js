const monIndex = require("../data/bestiary/index.json");
const fs = require('fs');

const newMon = {};
Object.keys(monIndex).forEach(src => {
	newMon[src] = require(`../data/bestiary/${monIndex[src]}`)
});

const setSpd = new Set();
const setCnd = new Set();

const byHand = [];

const ALLOWED = ["walk", "fly", "swim", "climb", "burrow"];
Object.values(newMon).forEach(l => {
	l.monster.forEach(m => {
		if (!m.speed) {
			throw new Error("No speed!")
		}

		const nuSped = {};
		let hand = false;

		splitSpeed(m.speed).map(it => it.trim()).forEach(s => {
			const r = /^(\w+?\s+)?(\d+) ft\.( .*)?$/.exec(s);
			if (!r) {
				hand = true;
				return byHand.push(m)
			}

			if (r[1]) r[1] = r[1].trim();
			else r[1] = "walk";

			if (ALLOWED.includes(r[1])) {
				if (r[3]) {
					setSpd.add(r[1]);
					setCnd.add(r[3]);
					nuSped[r[1]] = {
						number: Number(r[2]),
						condition: r[3]
					};
				} else {
					setSpd.add(r[1]);
					nuSped[r[1]] = Number(r[2]);
				}
			} else {
				hand = true;
				byHand.push(m);
			}
		});

		if (Object.values(nuSped).filter(s => (s.number != null ? s.number : s) % 5 !== 0).length) {
			throw new Error("Invalid speed!")
		}

		if (hand) nuSped.OLD_SPEED = m.speed;
		m.speed = nuSped;
	});
});

function splitSpeed (str) {
	let c;
	let ret = [];
	let stack = "";
	let para = 0;
	for (let i = 0; i < str.length; ++i) {
		c = str.charAt(i);
		switch (c) {
			case ",":
				if (para === 0) {
					ret.push(stack);
					stack = "";
				}
				break;
			case "(":
				para++;
				stack += c;
				break;
			case ")":
				para--;
				stack += c;
				break;
			default:
				stack += c;
		}
	}
	if (stack) ret.push(stack);
	return ret.map(it => it.trim()).filter(it => it);
}

console.log([...setCnd].join("\n"));

Object.keys(newMon).forEach(k => {
	newMon[k] = JSON.stringify(newMon[k], null, "\t").replace(/\u2014/g, "\\u2014").replace(/\u2013/g, "\\u2013");
});

Object.keys(newMon).forEach(k => {
	const path = monIndex[k];
	fs.writeFileSync(`trash/${path}`, newMon[k], "utf8");
});
