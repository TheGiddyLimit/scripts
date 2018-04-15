/* eslint-disable */
const fs = require('fs');

/*const spellIndex = require("../data/spells/index.json");

const workOn = {};
Object.keys(spellIndex).forEach(src => {
	workOn[spellIndex[src]] = require(`../data/spells/${spellIndex[src]}`)
});

Object.values(workOn).forEach(l => {
	l.spell.forEach(s => {
		if (s.components && s.components.m && s.components.m !== true) {
			const mGold = /(\d+)\s*gp/g.exec(s.components.m.replace(/,/g, ""));
			const mCons = /consume/g.exec(s.components.m);

			const mWorth = /worth/g.exec(s.components.m);

			if (mGold || mCons) {
				if (mCons && !mGold) {
					console.log("consumed but no gold cost?", s.name, s.components.m);
				}

				if (mWorth && !mGold) {
					console.log("worth but no gold cost?", s.name, s.components.m);
				}

				const nuM = {
					text: s.components.m
				};
				if (mGold) nuM.cost = Number(mGold[1]);
				if (mCons) nuM.consume = true;

				s.components.m = nuM;
			}
		}
	});
});
Object.keys(workOn).forEach(file => {
	const out = JSON.stringify(workOn[file], null, "\t").replace(/( )?\u2014( )?/g, "\\u2014").replace(/\u2013/g, "\\u2013");

	fs.writeFileSync(`trash/${file}`, out, "utf8");
});
*/

const monIndex = require("../data/bestiary/index.json");

const newMon = {};
Object.keys(monIndex).forEach(src => {
	newMon[monIndex[src]] =  require(`../data/bestiary/${monIndex[src]}`);
});

const DYPES = [
	"acid",
	"bludgeoning",
	"cold",
	"fire",
	"force",
	"lightning",
	"necrotic",
	"piercing",
	"poison",
	"psychic",
	"radiant",
	"slashing",
	"thunder"
];

const fuckedSet = new Set();

const immSet = new Set();
function extractVuln (mon) {
	const out = [];
	let allGroup = null;

	function add (it) {
		if (allGroup) {
			allGroup.vulnerable.push(it);
		} else {
			out.push(it);
		}
	}

	const noteM = /^.*?:/g.exec(mon.vulnerable);
	if (noteM) {
		allGroup = {
			vulnerable: []
		};
		out.push(allGroup);
		allGroup.preNote = noteM[0];
		console.log(`extracted prenote [${allGroup.preNote}]`);
		mon.vulnerable = mon.vulnerable.substring(allGroup.preNote.length)
	}

	if (mon.vulnerable.includes(";")) {
		const parts = mon.vulnerable.split(";")
			.map(it => it.trim())
			.filter(it => it)
			.map(it => extractVuln({name: mon.name, source: mon.source, vulnerable: it}));
		[].concat.apply([], parts).forEach(it => add(it));
	} else {

		const bpsM = /bludgeoning, piercing, and slashing .*?,?/g.exec(mon.vulnerable);
		if (bpsM) {
			mon.vulnerable = mon.vulnerable.replace(/bludgeoning, piercing, and slashing (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"bludgeoning",
						"piercing",
						"slashing"
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const bsM = /bludgeoning and slashing .*,?/g.exec(mon.vulnerable);
		if (bsM) {
			mon.vulnerable = mon.vulnerable.replace(/bludgeoning and slashing (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"bludgeoning",
						"slashing",
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const bpM = /bludgeoning and piercing .*,?/g.exec(mon.vulnerable);
		if (bpM) {
			mon.vulnerable = mon.vulnerable.replace(/bludgeoning and piercing (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"bludgeoning",
						"piercing",
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const spM = /slashing and piercing .*,?/g.exec(mon.vulnerable);
		if (spM) {
			mon.vulnerable = mon.vulnerable.replace(/slashing and piercing (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"slashing",
						"piercing",
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const pM = /piercing .*,?/g.exec(mon.vulnerable);
		if (pM) {
			mon.vulnerable = mon.vulnerable.replace(/piercing (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"piercing",
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const bM = /bludgeoning .*,?/g.exec(mon.vulnerable);
		if (bM) {
			mon.vulnerable = mon.vulnerable.replace(/bludgeoning (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"bludgeoning",
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const sM = /slashing .*,?/g.exec(mon.vulnerable);
		if (sM) {
			mon.vulnerable = mon.vulnerable.replace(/slashing (.*),?/g, (...ms) => {
				console.log(`extracting [${ms[0]}] in ${mon.source}`);

				const group = {
					vulnerable: [
						"slashing",
					],
					note: ms[1]
				};

				add(group);

				return "";
			})
		}

		const them = mon.vulnerable.split(",").filter(me => me).map(me => me.trim()).filter(me => me);
		them.forEach(it => {
			if (!~DYPES.indexOf(it)) {
				add({
					"special": it
				});
				fuckedSet.add(`${mon.name} :: ${mon.source}`);
			} else {
				add(it);
			}
			immSet.add(it);
		});
	}

	return out;
}

const CONDS = [
	"blinded",
	"charmed",
	"deafened",
	"exhaustion",
	"frightened",
	"grappled",
	"incapacitated",
	"invisible",
	"paralyzed",
	"petrified",
	"poisoned",
	"prone",
	"restrained",
	"stunned",
	"unconscious",

	"disease"
];

const fConSet = new Set();
const conImmSet = new Set();
function extractCondImm (mon) {
	const out = [];
	let allGroup = null;

	function add (it) {
		if (allGroup) {
			allGroup.conditionImmune.push(it);
		} else {
			out.push(it);
		}
	}

	const noteM = /^.*?:/g.exec(mon.conditionImmune);
	if (noteM) {
		allGroup = {
			conditionImmune: []
		};
		out.push(allGroup);
		allGroup.preNote = noteM[0];
		console.log(`extracted prenote [${allGroup.preNote}]`);
		mon.conditionImmune = mon.conditionImmune.substring(allGroup.preNote.length)
	}

	const parts = mon.conditionImmune.split(",").map(f => f.trim()).filter(it => it);
	parts.forEach(it => {


		if (!~CONDS.indexOf(it)) {
			add({
				"special": it
			});
			fConSet.add(`${mon.name} :: ${mon.source}`);
		} else {
			add(it);
		}

		conImmSet.add(it)
	});

	return out;
}

const fAlSet = new Set();
const alSet = new Set();

const ALIGN = {
	"lawful good": ["L", "G"],
	"neutral good": ["N", "G"],
	"chaotic good": ["C", "G"],
	"chaotic neutral": ["C", "N"],
	"lawful evil": ["L", "E"],
	"lawful neutral": ["L", "N"],
	"neutral evil": ["L", "E"],
	"chaotic evil": ["C", "E"],

	"good": ["G"],
	"lawful": ["L"],
	"neutral": ["N"],
	"chaotic": ["C"],
	"evil": ["E"],

	"unaligned": ["U"],

	"any alignment": ["A"],

	"any non-good alignment":             ["L", "NX", "C", "NY", "E"],
	"any non-lawful alignment":           ["NX", "C", "G", "NY", "E"],

	"any chaotic alignment":              ["C", "G", "NY", "E"],
	"any evil alignment":                 ["L", "NX", "C", "E"],
	"any lawful alignment":               ["L", "G", "NY", "E"],
	"any good alignment":                 ["L", "NX", "C", "G"],

	"neutral good (50%) or neutral evil (50%)": [{alignment: ["N", "G"], chance: 50}, {alignment: ["N", "E"], chance: 50}],
	"chaotic good (75%) or neutral evil (25%)": [{alignment: ["C", "G"], chance: 75}, {alignment: ["N", "E"], chance: 25}],
	"chaotic good or chaotic neutral": [{alignment: ["C", "G"]}, {alignment: ["C", "N"]}],
	"lawful neutral or lawful evil": [{alignment: ["L", "N"]}, {alignment: ["L", "E"]}],
	"neutral evil (50%) or lawful evil (50%)": [{alignment: ["N", "E"], chance: 50}, {alignment: ["L", "E"], chance: 50}]
};
function extractAl (m) {
	const a = m.alignment;
	alSet.add(a);
	if (!ALIGN[a]) {
		fAlSet.add(a);
	} else {
		return ALIGN[a];
	}
}

Object.values(newMon).forEach(l => {
	l.monster.forEach(m => {
		// immune
		// if (m.immune) {
		// 	const x = extractImm(m);
		// 	m.immune = x;
		// }

		// conditionImmune
		// if (m.conditionImmune) {
		// 	const x = extractCondImm(m);
		// 	m.conditionImmune = x;
		// }

		// resist
		// if (m.resist) {
		// 	const x = extractRes(m);
		// 	m.resist = x;
		// }

		// vulnerable
		// if (m.vulnerable) {
		// 	const x = extractVuln(m);
		// 	m.vulnerable = x;
		// }

		// alignment
		m.alignment = extractAl(m);
	});
});

console.log(JSON.stringify([...alSet], null, "\t"));
console.log(JSON.stringify([...fAlSet], null, "\t"));

let doWrite = true;
if (doWrite) {
	Object.keys(newMon).forEach(file => {
		const out = JSON.stringify(newMon[file], null, "\t").replace(/( )?\u2014( )?/g, "\\u2014").replace(/\u2013/g, "\\u2013");

		fs.writeFileSync(`trash/${file}`, out, "utf8");
	});
}

console.log("done");