/* eslint-disable */
const fs = require('fs');
const ut = require('../js/utils');

// CONFIGABLE OPTIONS
const doOutput = false;
const mode = ["5ET_AND_BREW", "5ET", "TRASH"][0];
// END COFIGABLE OPTIONS

function dumpSet (set, sort = false) {
	const toPrint = [...set];
	if (sort) toPrint.sort();
	console.log(JSON.stringify(toPrint, null, "\t"));
}

const monIndex = require("../data/bestiary/index.json");
const newMon = {};
switch (mode) {
	case "5ET_AND_BREW":
		fs.readdirSync("../homebrew/creature/").forEach(f => {
			newMon[f] = JSON.parse(fs.readFileSync(`../homebrew/creature/${f}`, "utf8"));
		});
	case "5ET":
		Object.keys(monIndex).forEach(src => {
			newMon[monIndex[src]] = require(`../data/bestiary/${monIndex[src]}`);
		});
		break;
	case "TRASH":
		fs.readdirSync("./trash_in").forEach(f => {
			newMon[f] = require(`../trash_in/${f}`);
		});
		break;
}

class ResImmFix {
	static run (m) {
		ResImmFix.wasRun = true;
		// immune
		if (m.immune) {
			const x = ResImmFix._extractDam(m, "immune");
			m.immune = x;
		}
		// resist
		if (m.resist) {
			const x = ResImmFix._extractDam(m, "resist");
			m.resist = x;
		}
		// vulnerable
		if (m.vulnerable) {
			const x = ResImmFix._extractDam(m, "vulnerable");
			m.vulnerable = x;
		}
	}

	static dbg() {
		if (ResImmFix.wasRun) {
			dumpSet(ResImmFix.damSet, true);
			dumpSet(ResImmFix.fuckedSet, true);
		}
	}

	static _extractDam (mon, prop) {
		const out = [];
		let allGroup = null;

		function add (it) {
			if (allGroup) {
				allGroup[prop].push(it);
			} else {
				out.push(it);
			}
		}

		const noteM = /^.*?:/g.exec(mon[prop]);
		if (noteM) {
			allGroup = {
				[prop]: []
			};
			out.push(allGroup);
			allGroup.preNote = noteM[0];
			console.log(`extracted prenote [${allGroup.preNote}]`);
			mon[prop] = mon[prop].substring(allGroup.preNote.length)
		}

		if (mon[prop].includes(";")) {
			const parts = mon[prop].split(";")
				.map(it => it.trim())
				.filter(it => it)
				.map(it => extractDam({name: mon.name, source: mon.source, [prop]: it}, prop));
			[].concat.apply([], parts).forEach(it => add(it));
		} else {

			const bpsM = /bludgeoning, piercing, and slashing .*?,?/g.exec(mon[prop]);
			if (bpsM) {
				mon[prop] = mon[prop].replace(/bludgeoning, piercing, and slashing (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
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

			const bsM = /bludgeoning and slashing .*,?/g.exec(mon[prop]);
			if (bsM) {
				mon[prop] = mon[prop].replace(/bludgeoning and slashing (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
							"bludgeoning",
							"slashing",
						],
						note: ms[1]
					};

					add(group);

					return "";
				})
			}

			const bpM = /bludgeoning and piercing .*,?/g.exec(mon[prop]);
			if (bpM) {
				mon[prop] = mon[prop].replace(/bludgeoning and piercing (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
							"bludgeoning",
							"piercing",
						],
						note: ms[1]
					};

					add(group);

					return "";
				})
			}

			const spM = /slashing and piercing .*,?/g.exec(mon[prop]);
			if (spM) {
				mon[prop] = mon[prop].replace(/slashing and piercing (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
							"slashing",
							"piercing",
						],
						note: ms[1]
					};

					add(group);

					return "";
				})
			}

			const pM = /piercing .*,?/g.exec(mon[prop]);
			if (pM) {
				mon[prop] = mon[prop].replace(/piercing (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
							"piercing",
						],
						note: ms[1]
					};

					add(group);

					return "";
				})
			}

			const bM = /bludgeoning .*,?/g.exec(mon[prop]);
			if (bM) {
				mon[prop] = mon[prop].replace(/bludgeoning (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
							"bludgeoning",
						],
						note: ms[1]
					};

					add(group);

					return "";
				})
			}

			const sM = /slashing .*,?/g.exec(mon[prop]);
			if (sM) {
				mon[prop] = mon[prop].replace(/slashing (.*),?/g, (...ms) => {
					console.log(`extracting [${ms[0]}] in ${mon.source}`);

					const group = {
						[prop]: [
							"slashing",
						],
						note: ms[1]
					};

					add(group);

					return "";
				})
			}

			const them = mon[prop].split(",").filter(me => me).map(me => me.trim()).filter(me => me);
			them.forEach(it => {
				if (!~DYPES.indexOf(it)) {
					add({
						"special": it
					});
					ResImmFix.fuckedSet.add(`${mon.name} :: ${mon.source}`);
				} else {
					add(it);
				}
				ResImmFix.damSet.add(it);
			});
		}

		return out;
	}
}
ResImmFix.damSet = new Set();
ResImmFix.fuckedSet = new Set();
ResImmFix.DYPES = [
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

class CondFix {
	static run (m) {
		CondFix.wasRun = true;
		// conditionImmune
		if (m.conditionImmune) {
			const x = extractCondImm(m);
			m.conditionImmune = x;
		}
	}

	static extractCondImm (mon) {
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


			if (!~CondFix.CONDS.indexOf(it)) {
				add({
					"special": it
				});
				CondFix.fConSet.add(`${mon.name} :: ${mon.source}`);
			} else {
				add(it);
			}

			CondFix.conImmSet.add(it)
		});

		return out;
	}

	static dbg() {
		if (CondFix.wasRun) {
			dumpSet(CondFix.conImmSet, true);
			dumpSet(CondFix.fConSet, true);
		}
	}
}
CondFix.CONDS = [
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
CondFix.fConSet = new Set();
CondFix.conImmSet = new Set();

class AliFix {
	static run (m) {
		AliFix.wasRun = true;
		// alignment
		m.alignment = AliFix.extractAl(m);
	}

	static extractAl (m) {
		const a = m.alignment;
		AliFix.alSet.add(a);
		if (!AliFix.ALIGN[a]) {
			AliFix.fAlSet.add(a);
		} else {
			return AliFix.ALIGN[a];
		}
	}

	static dbg () {
		if (AliFix.wasRun) {
			dumpSet(AliFix.fAlSet, true);
			dumpSet(AliFix.alSet, true);
		}
	}
}
AliFix.fAlSet = new Set();
AliFix.alSet = new Set();
AliFix.ALIGN = {
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

class SaveFix {
	static run (m) {
		SaveFix.wasRun = true;
		SaveFix.extractSave(m);
	}

	static extractSave (mon, save) {
		if (typeof save !== "string") return save;
		const spl = save.split(",").map(it => it.trim()).filter(it => it);

		const out = {};
		spl.forEach(it => {
			const spl2 = it.split(" ");
			out[spl2[0].toLowerCase()] = spl2[1];
		});
		return out;
	}

	static dbg () {
		if (SaveFix.wasRun) {

		}
	}
}
SaveFix.saveSet = new Set();

class DiceFix {
	static run (m) {
		DiceFix.wasRun = true;
		// trait, action, reaction, legendary
		if (m.trait) m.trait = m.trait.map(it => DiceFix.toDice(m, it));
		if (m.action) m.action = m.action.map(it => DiceFix.toDice(m, it));
		if (m.reaction) m.reaction = m.reaction.map(it => DiceFix.toDice(m, it));
		if (m.legendary) m.legendary = m.legendary.map(it => DiceFix.toDice(m, it));
	}

	static toDice (mon, it) {
		if (it.entries) {
			it.entries = it.entries.map(e => {
				if (typeof e !== "string") return e;

				// replace "+X" or "+Y to hit"
				e = e.replace(/([-+])?\d+(?= to hit)/g, function (match) {
					return `{@hit ${match}}`
				});

				e = e.replace(/ \d+d\d+(\s?([-+])\s?\d+\s?)? /g, function (match) { // skip already converted
					return `{@dice ${match}}`;
				});

				return e;
			})
		}
		return it;
	}

	static dbg () {
		if (DiceFix.wasRun) {

		}
	}
}

class HpFix {
	static run (m) {
		HpFix.wasRun = true;
		m.hp = HpFix.splitHP(m);
	}

	static splitHP (m) {
		if (typeof m.hp !== "string") return m.hp;
		const x = /^(\d+) \((.*?)\)$/.exec(m.hp);
		if (!x) {
			return {special: m.hp}
		}

		return {
			average: Number(x[1]),
			formula: x[2]
		}
	}

	static dbg () {
		if (HpFix.wasRun) {

		}
	}
}

// copied straight from the converter
const SPELL_SRC_MAP = {};
function getSpellSource (spellName) {
	if (spellName && SPELL_SRC_MAP[spellName.toLowerCase()]) return SPELL_SRC_MAP[spellName.toLowerCase()];
	return null;
}
function tryParseSpellcasting (trait) {
	let spellcasting = [];

	function parseSpellcasting (trait) {
		const splitter = new RegExp(/,\s?(?![^(]*\))/, "g"); // split on commas not within parentheses

		let name = trait.name;
		let spellcastingEntry = {"name": name, "headerEntries": [parseToHit(trait.entries[0])]};
		let doneHeader = false;
		for (let i = 1; i < trait.entries.length; i++) {
			let thisLine = trait.entries[i];
			if (thisLine.includes("/rest")) {
				doneHeader = true;
				let property = thisLine.substr(0, 1) + (thisLine.includes(" each:") ? "e" : "");
				let value = thisLine.substring(thisLine.indexOf(": ") + 2).split(splitter).map(i => parseSpell(i));
				if (!spellcastingEntry.rest) spellcastingEntry.rest = {};
				spellcastingEntry.rest[property] = value;
			} else if (thisLine.includes("/day")) {
				doneHeader = true;
				let property = thisLine.substr(0, 1) + (thisLine.includes(" each:") ? "e" : "");
				let value = thisLine.substring(thisLine.indexOf(": ") + 2).split(splitter).map(i => parseSpell(i));
				if (!spellcastingEntry.daily) spellcastingEntry.daily = {};
				spellcastingEntry.daily[property] = value;
			} else if (thisLine.includes("/week")) {
				doneHeader = true;
				let property = thisLine.substr(0, 1) + (thisLine.includes(" each:") ? "e" : "");
				let value = thisLine.substring(thisLine.indexOf(": ") + 2).split(splitter).map(i => parseSpell(i));
				if (!spellcastingEntry.weekly) spellcastingEntry.weekly = {};
				spellcastingEntry.weekly[property] = value;
			} else if (thisLine.startsWith("Constant: ")) {
				doneHeader = true;
				spellcastingEntry.constant = thisLine.substring(9).split(splitter).map(i => parseSpell(i));
			} else if (thisLine.startsWith("At will: ")) {
				doneHeader = true;
				spellcastingEntry.will = thisLine.substring(9).split(splitter).map(i => parseSpell(i));
			} else if (thisLine.includes("Cantrip")) {
				doneHeader = true;
				let value = thisLine.substring(thisLine.indexOf(": ") + 2).split(splitter).map(i => parseSpell(i));
				if (!spellcastingEntry.spells) spellcastingEntry.spells = {"0": {"spells": []}};
				spellcastingEntry.spells["0"].spells = value;
			} else if (thisLine.includes(" level") && thisLine.includes(": ")) {
				doneHeader = true;
				let property = thisLine.substr(0, 1);
				let value = thisLine.substring(thisLine.indexOf(": ") + 2).split(splitter).map(i => parseSpell(i));
				if (!spellcastingEntry.spells) spellcastingEntry.spells = {};
				let slots = thisLine.includes(" slot") ? parseInt(thisLine.substr(11, 1)) : 0;
				spellcastingEntry.spells[property] = {"slots": slots, "spells": value};
			} else {
				if (doneHeader) {
					if (!spellcastingEntry.footerEntries) spellcastingEntry.footerEntries = [];
					spellcastingEntry.footerEntries.push(parseToHit(thisLine));
				} else {
					spellcastingEntry.headerEntries.push(parseToHit(thisLine));
				}
			}
		}
		spellcasting.push(spellcastingEntry);
	}

	function parseSpell (name) {
		function getSourcePart (spellName) {
			const source = getSpellSource(spellName);
			return `${source && source !== SRC_PHB ? `|${source}` : ""}`;
		}

		name = name.trim();
		let asterix = name.indexOf("*");
		let brackets = name.indexOf(" (");
		if (asterix !== -1) {
			const trueName = name.substr(0, asterix);
			return `{@spell ${trueName}${getSourcePart(trueName)}}*`;
		} else if (brackets !== -1) {
			const trueName = name.substr(0, brackets);
			return `{@spell ${trueName}${getSourcePart(trueName)}}${name.substring(brackets)}`;
		}
		return `{@spell ${name}${getSourcePart(name)}}`;
	}

	function parseToHit (line) {
		return line.replace(/( \+)(\d+)( to hit with spell)/g, (m0, m1, m2, m3) => {
			return ` {@hit ${m2}}${m3}`;
		});
	}

	try {
		parseSpellcasting(trait);
		return {out: spellcasting, success: true};
	} catch (e) {
		return {out: trait, success: false};
	}
}
// end copied straight from the converter
class SpellFix {
	static init () {
		// ... with a little custom spice
		const spellIndex = require("../data/spells/index.json");
		Object.keys(spellIndex).reverse().forEach(src => {
			const file = require(`../data/spells/${spellIndex[src]}`);
			file.spell.forEach(s => SPELL_SRC_MAP[s.name.toLowerCase()] = s.source);
		});
		// end custom spice
	}

	static run (m) {
		SpellFix.wasRun = true;
		SpellFix.doScan(m)
	}

	static doScan (m) {
		if (m.trait) {
			const nuTrait = m.trait.map(t => {
				if (t.name.toLowerCase().includes("spellcasting")) {
					return tryParseSpellcasting(t);
				} else {
					return t;
				}
			});
			if (nuTrait.filter(it => it.success === false).length) throw new Error("failed to parse spells!");
			const spellTraits = nuTrait.filter(it => it.success === true);
			if (spellTraits.length) {
				m.spellcasting = [].concat(...spellTraits.map(it => it.out)); // FIXME this might not work
				m.trait = nuTrait.filter(it => it.success === undefined)
			}
		}
	}

	static dbg () {
		if (SpellFix.wasRun) {

		}
	}
}

class LegFix {
	static run (m) {
		LegFix.wasRun = true;
		LegFix.setLegendaryThe(m);
	}

	static setLegendaryThe (m) {
		const it = m.legendary[0].entries[0].split(" ")[0];
		if ((it === "If" || it === "Melee" || it === "One" || it === "{@hit" || it === "All" || it === "As") || it !== "The") {
			m.isNamedCreature = true;
		} else {
			console.log(m.name, "::", m.source)
		}
		LegFix.legTheSet.add(it);
	}

	static dbg () {
		if (LegFix.wasRun) {
			dumpSet(LegFix.legTheSet, true);
		}
	}
}
LegFix.legTheSet = new Set();

class AcFix {
	// maps AC to a list
	static run (m) {
		AcFix.wasRun = true;
		let nuAc = [];
		const basic = /^(\d+)( \((.*?)\))?$/.exec(m.ac.trim());
		if (basic) {
			if (basic[3]) {
				const brak = basic[3];
				let cur =  {
					ac: Number(basic[1]),
				};

				let nextPart = null;

				const from = [];

				const splitter = new RegExp(/,\s?(?![^(]*\))/, "g"); // split on commas not within parentheses

				const parts = brak.split(splitter).map(it => it.trim());

				parts.forEach(p => {
					switch (p) {
						case "natural armor":
						case "natural":
							from.push("natural armor");
							break;

						case "unarmored defense":
						case "armor scraps":
						case "barding scraps":
						case "patchwork armor":
						case "see Natural Armor feature":
						case "Barkskin trait":
						case "Sylvan Warrior":
						case "cage":
						case "chains":
						case "coin mail":
						case "crude armored coat":
						case "improvised armor":
						case "magic robes":
						case "makeshift armor":
						case "natural and mystic armor":
						case "padded armor":
						case "padded leather":
						case "parrying dagger":
						case "plant fiber armor":
						case "plus armor worn":
						case "rag armor":
						case "ring of protection +2":
						case "see below":
						case "wicker armor":
							from.push(p);
							break;


						case "foresight bonus":
							from.push(`{@spell foresight} bonus`);
							break;

						case "natural barkskin":
							from.push(`natural {@spell barkskin}`);
							break;

						case "studded leather armor":
						case "studded leather":
							from.push("{@item studded leather armor|phb}");
							break;

						case "leather armor":
						case "leather":
							from.push("{@item leather armor|phb}");
							break;

						case "half plate":
							from.push("{@item half plate armor|phb}");
							break;

						case "splint":
						case "splint armor":
							from.push("{@item splint armor|phb}");
							break;

						case "chain mail":
						case "chainmail":
						case "chain armor":
							from.push("{@item chain mail|phb}");
							break;

						case "scale mail":
						case "scale armor":
						case "scale":
							from.push("{@item scale mail|phb}");
							break;

						case "hide armor":
						case "hide":
							from.push("{@item hide armor|phb}");
							break;

						case "chain shirt":
							from.push("{@item chain shirt|phb}");
							break;

						case "breastplate":
							from.push("{@item breastplate|phb}");
							break;

						case "ring mail":
							from.push("{@item ring mail|phb}");
							break;

						case "plate mail":
						case "platemail":
						case "plate":
						case "plate armor":
						case "full plate":
							from.push("{@item plate armor|phb}");
							break;

						case "dwarven plate":
							from.push("{@item dwarven plate|dmg}");
							break;

						case "shield":
							from.push("{@item shield|phb}");
							break;

						case "shields":
							from.push("{@item shield|phb|shields}");
							break;

						case "+3 plate armor":
							from.push("{@item plate armor +3|dmg|+3 plate armor}");
							break;

						case "half plate armor +1":
							from.push("{@item half plate armor +1|dmg|+1 half-plate armor}");
							break;

						case "scale mail +1":
							from.push("{@item scale mail +1|dmg|+1 scale mail}");
							break;

						case "scale mail +2":
							from.push("{@item scale mail +2|dmg|+2 scale mail}");
							break;

						case "splint mail +2":
							from.push("{@item splint armor +2|dmg|+2 splint armor}");
							break;

						case "studded leather armor +1":
							from.push("{@item studded leather armor +1|dmg|+1 studded leather armor}");
							break;

						case "bracers of defense":
							from.push("{@item bracers of defense}");
							break;

						case "mage armor":
							from.push("{@spell mage armor}");
							break;
						default:
							if (p.endsWith("with mage armor") || p.endsWith("with barkskin")) {
								const numMatch = /(\d+) with (.*)/.exec(p);
								if (!numMatch) throw new Error("Spell AC but no leading number?");
								let spell = null;
								if (numMatch[2] === "mage armor") {
									spell = `{@spell mage armor}`
								} else if (numMatch[2] === "barkskin") {
									spell = `{@spell barkskin}`
								} else {
									throw new Error(`Unhandled spell! ${numMatch[2]}`)
								}

								nextPart = {
									ac: Number(numMatch[1]),
									condition: `with ${spell}`,
									braces: true
								}
							} else {
								AcFix.set.add(p);
								console.log(`AC REQURIED MANUAL FIXING: ${m.name} ${m.source} p${m.page}`);
								nuAc.push(p)
							}
					}
				});

				if (from.length) {
					cur.from = from;
					nuAc.push(cur);
				} else {
					nuAc.push(cur.ac);
				}
				if (nextPart) nuAc.push(nextPart)
			} else {
				nuAc.push(Number(basic[1]));
			}
		} else {
			console.log("Unhandled AC!");
			AcFix.badSet.add(`${m.name} ${m.source} p${m.page} :: ${m.ac}`);
			nuAc.push(m.ac);
		}
		m.ac = nuAc;
	}

	static dbg () {
		if (AcFix.wasRun) {
			dumpSet(AcFix.set, true);
			dumpSet(AcFix.badSet, true);
		}
	}
}
AcFix.set = new Set();
AcFix.badSet = new Set();

class SpeedFix {
	static run (m) {
		SpeedFix.wasRun = true;
		SpeedFix.setCleanSpeed(m, `speed ${m.speed}`); // spicy hacks
		SpeedFix.tagHover(m);
	}

	static tagHover (m) {
		if (m.speed && m.speed.fly && m.speed.fly.condition) {
			m.speed.fly.condition = m.speed.fly.condition.trim();

			if (m.speed.fly.condition.toLowerCase().includes("hover")) {
				m.speed.canHover = true;
			}
		}
	}

	// copied straight from the converter
	static setCleanSpeed (stats, line) {
		line = line.toLowerCase().trim().replace(/^speed\s*/, "");
		const ALLOWED = ["walk", "fly", "swim", "climb", "burrow"];

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

		const out = {};
		let byHand = false;

		splitSpeed(line.toLowerCase()).map(it => it.trim()).forEach(s => {
			const m = /^(\w+?\s+)?(\d+)\s*ft\.( .*)?$/.exec(s);
			if (!m) {
				byHand = true;
				return;
			}

			if (m[1]) m[1] = m[1].trim();
			else m[1] = "walk";

			if (ALLOWED.includes(m[1])) {
				if (m[3]) {
					out[m[1]] = {
						number: Number(m[2]),
						condition: m[3].trim()
					};
				} else out[m[1]] = Number(m[2]);
			} else byHand = true;
		});

		// flag speed as invalid
		if (Object.values(out).filter(s => (s.number != null ? s.number : s) % 5 !== 0).length) out.INVALID_SPEED = true;

		// flag speed as needing hand-parsing
		if (byHand) out.UNPARSED_SPEED = line;
		stats.speed = out;
	}

	static dbg () {
		if (SpeedFix.wasRun) {

		}
	}
}

class VariantFix {
	static run (m) {
		VariantFix.wasRun = true;
		VariantFix.doCheckFix(m);
	}

	static doCheckFix (m) {
		if (m.trait) {
			VariantFix.doFixVariants(m, "trait")
		}
		if (m.action) {
			VariantFix.doFixVariants(m, "action")
		}
		if (m.trait && !m.trait.length) delete m.trait;
		if (m.action && !m.action.length) delete m.action;
	}

	static doFixVariants (m, prop) {
		function addVar (it) {
			const name = it.name.trim().replace(/^variant\s*([:;\-!\|,])*/i, "").trim();

			m.variant = m.variant || [];
			m.variant.push({
				type: "variant",
				name: name,
				entries: it.entries
			})
		}

		const withVars = m[prop].filter(it => it.name && it.name.toLowerCase().includes("variant"));
		if (withVars.length) {
			withVars.forEach(addVar);
			m[prop] = m[prop].filter(it => it.name && !it.name.toLowerCase().includes("variant"));
		}
	}

	static dbg () {
		if (VariantFix.wasRun) {

		}
	}
}

SpellFix.init();
Object.values(newMon).forEach(l => {
	l.monster.forEach(m => {
		// ResImmFix.run(m);
		// CondFix.run(m);
		// AliFix.run(m);
		// SaveFix.run(m);
		// DiceFix.run(m);
		// HpFix.run(m);
		// SpellFix.run(m);
		// LegFix.run(m);
		// AcFix.run(m);
		// SpeedFix.run(m);
		// VariantFix.run(m);
	});
});

ResImmFix.dbg();
CondFix.dbg();
AliFix.dbg();
SaveFix.dbg();
DiceFix.dbg();
HpFix.dbg();
SpellFix.dbg();
LegFix.dbg();
AcFix.dbg();
SpeedFix.dbg();
VariantFix.dbg();

if (doOutput) {
	Object.keys(newMon).forEach(file => {
		const out = JSON.stringify(newMon[file], null, "\t").replace(/\s*\u2014\s*/g, "\\u2014").replace(/\s*\u2013\s*/g, "\\u2014");

		fs.writeFileSync(`trash/${file}`, out, "utf8");
	});
}

console.log("done");