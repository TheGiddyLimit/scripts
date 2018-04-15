const numbers = {
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5
};

function getNumFromStr(numberString) {
	if (numbers[numberString] === undefined) console.log(numberString, "not in `numbers`");
	return numbers[numberString]
}

const DOT_CODE = 8226;

const SETERINO = [];

let o = document.getElementById("out");

let jsonURL = "spells-bols-old.json";

let request = new XMLHttpRequest();
request.open('GET', jsonURL, true);
request.onload = function() {
	let data = JSON.parse(this.response);
	doStuff(data)
};
request.send();


function doStuff(data) {

	// TODO have to manually go through ctrl-Fing empty string and fixing the entry layout

	let spells = data.spell;

	for (let i = 0; i < spells.length; ++i) {
		let spell = spells[i];
		if (!spell.source) spell.source = "PHB";
	}

	spells = spells.sort(function(a, b) {
		let x = SortUtil.ascSort(a.source, b.source);
		if (x !== 0) return x;
		return SortUtil.ascSort(a.name, b.name);
	});

	for (let i = 0; i < spells.length; ++i) {
		let spell = spells[i];

		spell.level = Number(spell.level);

		getNewSpellMeta(spell.ritual, spell.technomagic);

		delete spell.ritual;
		delete spell.technomagic;

		spell.school = getNewSchool(spell.school);

		spell.time = getNewTime(spell.time);

		spell.range = getNewRange(spell.range);

		spell.components = getNewComponents(spell.components);

		spell.duration = getNewDur(spell.duration);

		// spell.classes = getNewClasses(spell.classes);
		spell.classes = getNewClasses(spell.classes);

		getNewEntries(spell, spell.text);

		delete spell.text; // replaced with entries

		delete spell.roll; // not used in roll20





		function getNewSpellMeta(isRitual, isTechno) {
			if (isRitual || isTechno) {
				spell.meta = {}
				if (isRitual) spell.meta.ritual = true
				if (isTechno) spell.meta.technomagic = true
			}
		}

		function getNewSchool (school) {
			if (school === "A") return "A";
			if (school === "EV") return "V";
			if (school === "EN") return "E";
			if (school === "I") return "I";
			if (school === "D") return "D";
			if (school === "N") return "N";
			if (school === "T") return "T";
			if (school === "C") return "C";
			console.log("Invalid skool: ", school, spell);
			return "";
		}

		function getNewTime (time) {
			/*
			{
				"number": 1,
				"unit": "reaction",
				"condition": "which you take when you take acid, cold, fire, lightning, or thunder damage"
			}
			*/
			let re = /(\d+) (.*?)(, .*?)?$/;
			let out = [];
			if (time === "1 action or 8 hours") {
				time = time.split(" or ");
				for (let t of time) out.push(doTime(t));
			} else {
				out.push(doTime(time));
			}
			return out;

			function doTime(theTime) {
				let m = re.exec(theTime);
				if (m) {
					let t = {};
					t.number = Number(m[1].trim());
					t.unit = normaliseUnit(m[2]);
					if (m[3]) t.condition = m[3].slice(1).trim();
					return t;
				} else {
					console.log("Invalid time: ", theTime, spell)
				}
			}
		}

		function normaliseUnit(unit) {
			if (unit === "hours") return "hour";
			if (unit === "minutes") return "minute";
			if (unit === "action") return "action";
			if (unit === "round") return "round";
			if (unit === "rounds") return "round";
			if (unit === "bonus action") return "bonus action";
			if (unit === "reaction") return "reaction";
			if (unit === "hour") return "hour";
			if (unit === "minute") return "minute";
			console.log("Invalid unit: ", unit, spell)
		}

		function getNewRange(range) {
			range = range.trim();
			/*
			{
				"type": "point", // line, point, cube, sphere, cone, radius, hemisphere, special ...?
				"distance": {
					"type": "feet", // feet, touch, sight, unlimited, self, miles..
					"amount": 120 // can be undefined
				},
				"size": { // same as "distance"
					"type": "feet",
					"amount": 10
				}
			}

			 */

			if (range.toLowerCase() === "self") return {"type": "point", "distance": {"type": "self"}};
			if (range.toLowerCase() === "special") return {"type": "special"};
			if (range.toLowerCase() === "unlimited") return {"type": "point", "distance": {"type": "unlimited"}};
			if (range.toLowerCase() === "unlimited on the same plane") return {"type": "point", "distance": {"type": "plane"}};
			if (range.toLowerCase() === "sight") return {"type": "point", "distance": {"type": "sight"}};
			if (range.toLowerCase() === "touch") return {"type": "point", "distance": {"type": "touch"}};

			const re1 = /^(\d+) feet$/;
			let m1 = re1.exec(range);
			if (m1) {
				return {"type": "point", "distance": {"type": "feet", "amount": Number(m1[1])}}
			}
			const re4 = /^(\d+) mile$/;
			let m4 = re4.exec(range);
			if (m4) {
				return {"type": "point", "distance": {"type": "miles", "amount": Number(m4[1])}}
			}
			const re8 = /^(\d+) miles$/;
			let m8 = re8.exec(range);
			if (m8) {
				return {"type": "point", "distance": {"type": "feet", "amount": Number(m8[1])}}
			}


			const re2 = /^Self \((\d+)-foot radius\)$/;
			let m2 = re2.exec(range);
			if (m2) {
				return {"type": "radius", "distance": {"type": "feet", "amount": Number(m2[1])}}
			}

			const re6 = /^Self \((\d+)-mile radius\)$/;
			let m6 = re6.exec(range);
			if (m6) {
				return {"type": "radius", "distance": {"type": "miles", "amount": Number(m6[1])}}
			}

			const re3 = /^Self \((\d+)-foot-radius sphere\)$/;
			let m3 = re3.exec(range);
			if (m3) {
				return {"type": "sphere", "distance": {"type": "feet", "amount": Number(m3[1])}}
			}

			const pe1 = /^Self \((\d+)-mile-radius sphere\)$/;
			let n1 = pe1.exec(range);
			if (n1) {
				return {"type": "sphere", "distance": {"type": "miles", "amount": Number(n1[1])}}
			}

			const re5 = /^Self \((\d+)-foot cone\)$/;
			let m5 = re5.exec(range);
			if (m5) {
				return {"type": "cone", "distance": {"type": "feet", "amount": Number(m5[1])}}
			}

			const re7 = /^Self \((\d+)-foot line\)$/;
			let m7 = re7.exec(range);
			if (m7) {
				return {"type": "line", "distance": {"type": "feet", "amount": Number(m7[1])}}
			}

			const re9 = /^Self \((\d+)-foot cube\)$/;
			let m9 = re9.exec(range);
			if (m9) {
				return {"type": "cube", "distance": {"type": "feet", "amount": Number(m9[1])}}
			}

			const re10 = /^Self \((\d+)-foot-radius hemisphere\)$/;
			let m10 = re10.exec(range);
			if (m10) {
				return {"type": "hemisphere", "distance": {"type": "feet", "amount": Number(m10[1])}}
			}

			console.log("Invalid range: ", range)
		}

		function getNewComponents(com) {
			/*
			"components": { // all optional
				"v": true,
				"s": true,
				"m": true, // or a string of the components; "some material components"
			}
			 */
			com = com.trim();

			const out = [];

			let matRe = /(M( \(.*?\))?)/;
			let matM = matRe.exec(com);
			if (matM) {
				out.push(matM[0]);
				com = com.slice(0, com.length-matM[0].length)
			}
			let coms = com.split(", ");
			for (let j = 0; j < coms.length; j++) {
				coms[j] = coms[j].trim();
			}
			for (let j = 0; j < coms.length; j++) {
				const c = coms[j].trim();
				if (!c) continue;

				if (c === "V") out.push("V");
				else if (c === "S") out.push("S");
				else {
					console.log("Invalid componens: ", c)
				}
			}

			out.sort(function(a, b) {
				if (a[0] === "M") {
					return b[0] === "M" ? 0 : 1;
				}
				if (a === "S") {
					return b === "S" ? 0 : 1;
				}
				if (a === "V") {
					return b === "V" ? 0 : -1;
				}
				else return 1;
			});

			const outObj = {};
			// TODO
			for (let it of out) {
				it = it.trim();
				if (it === "V") outObj.v = true;
				else if (it === "S") outObj.s = true;
				else if (it.startsWith("M")) {
					outObj.m = true;
					if (it.length > 1) {
						// things with fancy components
						let re = /^\((.*?)\)$/;
						let m = re.exec(it.slice(1).trim());
						outObj.m = m[1];
					}
				}
			}

			return outObj;
		}

		function getNewDur(all) {
			/*
			[
				{
					"type": "instant",  // "timed", "permanent", special
					"condition": "asdasd", // only if instant; some bracketed text  at the end
					"concentration": true,
					"duration": { // op
						"type": "hours", // minutes, rounds, days
						"amount": 123,
						"upTo": true
					},
					{ // op
						"ends" [   // " ... or ... " list
							"dispel",
							"trigger"
						]
					}
				},
				...
			]

			 */
			all = all.trim();

			if (all.toLowerCase() === "instantaneous") return [{"type": "instant"}];
			if (all.toLowerCase() === "instantaneous (see text)") return [{"type": "instant", "condition": "see text"}];
			if (all.toLowerCase() === "special") return [{"type": "special"}];
			if (all.toLowerCase() === "permanent") return [{"type": "permanent"}];

			if (all.toLowerCase() === "until scraped off") return [{"type": "permanent"}];
			if (all.toLowerCase() === "1 minute or until discharged") return [{"type": "timed", "duration": {"type": "minutes", "amount": 1}}];
			if (all.toLowerCase() === "permanent or 1 minute") return [
				{"type": "permanent"},
				{"type": "timed", "duration": {"type": "minutes", "amount": 1}}
			];

			let re1 = /^Concentration, up to (\d+) hour(s)?$/;
			let m1 = re1.exec(all);
			if (m1) {
				return [{"type": "timed", "duration": {"type": "hours", "amount": Number(m1[1])}, "concentration": true}]
			}

			let re2 = /^Concentration, up to (\d+) minute(s)?$/;
			let m2 = re2.exec(all);
			if (m2) {
				return [{"type": "timed", "duration": {"type": "minutes", "amount": Number(m2[1])}, "concentration": true}]
			}

			let re3 = /^(\d+) hour(s)?$/;
			let m3 = re3.exec(all);
			if (m3) {
				return [{"type": "timed", "duration": {"type": "hours", "amount": Number(m3[1])}}]
			}

			let re4 = /^(\d+) minute(s)?$/;
			let m4 = re4.exec(all);
			if (m4) {
				return [{"type": "timed", "duration": {"type": "minutes", "amount": Number(m4[1])}}]
			}

			let m5 = /^(\d+) round(s)?$/.exec(all);
			if (m5) {
				return [{"type": "timed", "duration": {"type": "rounds", "amount": Number(m5[1])}}]
			}

			let m6 = /^(\d+) day(s)?$/.exec(all);
			if (m6) {
				return [{"type": "timed", "duration": {"type": "days", "amount": Number(m6[1])}}]
			}

			let m7 = /^Until dispelled( or triggered)?$/.exec(all);
			if (m7) {
				let oot = {"type": "permanent", "ends": ["dispel"]};
				if (m7[1]) {
					oot.ends.push("trigger")
				}
				return [oot];
			}

			let m72 = /^Permanent until discharged$/.exec(all);
			if (m72) {
				let oot = {"type": "permanent", "ends": ["discharge"]};
				return [oot];
			}

			let m8 = /^Concentration, up to a minute$/.exec(all);
			if (m8) {
				return [{"type": "timed", "duration": {"type": "minute", "amount": 1}, "concentration": true}]
			}

			let m9 = /^Concentration, up to 1 day$/.exec(all);
			if (m9) {
				return [{"type": "timed", "duration": {"type": "day", "amount": 1, "upTo": true}, "concentration": true}]
			}

			let n1 = /^Up to (\d+) hour(s)?$/.exec(all);
			if (n1) {
				return [{"type": "timed", "duration": {"type": "hour", "amount": n1[1], "upTo": true}}]
			}

			let n2 = /^Up to (\d+) minute(s)?$/.exec(all);
			if (n2) {
				return [{"type": "timed", "duration": {"type": "minute", "amount": n2[1], "upTo": true}}]
			}

			let n3 = /^Concentration, up to (\d+) round(s)?$/.exec(all);
			if (n3) {
				return [{"type": "timed", "duration": {"type": "rounds", "amount": Number(n3[1]), "upTo": true}, "concentration": true}]
			}

			let n4 = /^Instantaneous or 1 hour \(see below\)$/.exec(all);
			if (n4) {
				return [{"type": "instant"}, {"type": "timed", "duration": {"type": "hours", "amount": 1}}]
			}

			let n5 = /^(\d+) year(s)?$/.exec(all);
			if (n5) {
				return [{"type": "timed", "duration": {"type": "years", "amount": Number(n5[1])}}]
			}

			let n6 = /^(\d+) week(s)?$/.exec(all);
			if (n6) {
				return [{"type": "timed", "duration": {"type": "weeks", "amount": Number(n6[1])}}]
			}

			let n7 = /^(\d+) turn(s)?$/.exec(all);
			if (n7) {
				return [{"type": "timed", "duration": {"type": "turns", "amount": Number(n7[1])}}]
			}

			let n8 = /^Permanent or Concentration, up to 3 rounds \(see below\)$/.exec(all);
			if (n8) {
				return [
					{"type": "permanent"},
					{"type": "timed", "duration": {"type": "rounds", "amount": 3}, "concentration": true}]
			}

			console.log("Invalid dur: ", all)
		}

		function getNewClasses(c) {
			let cs = c.split(",");

			let classes = {"fromClassList" : [], "fromSubclass": []};
			for (let s of cs) {
				s = s.trim();

				let main = s;
				let sub = null;
				let circle = null;

				if (s !== "Artificer (UA)" && s.includes("(") && s.includes(")")) {
					let re = /(.*?) \((.*?)\)/;
					let m = re.exec(s);
					main = m[1];
					if (main === "Druid") {
						sub = "Circle of the Land";
						circle = m[2]
					} else {
						sub = m[2]
					}

					let out = {"class": {"name": RL_CLASSES[main], "source": CLASS_SOURCES[main]}, "subclass": {"name": sub, "source": CLASSES[s]}};

					classes.fromSubclass.push(out)
				} else {
					classes.fromClassList.push({"name": RL_CLASSES[main], "source": CLASS_SOURCES[main]});
				}
			}
			if (classes.fromSubclass.length === 0) delete classes.fromSubclass;
			return classes;
		}

		// TODO go through PHB and check everything looks ship-shape
		// TODO repeat for UA spells?
		function getNewEntries(spell, oldText) {
			let inList = false;
			let isHigherLevelsText = false;

			if (!(oldText instanceof Array)) oldText = [oldText];
			spell.entries = [];
			for (let s = 0; s < oldText.length; ++s) {
				let t = oldText[s];

				isHigherLevelsText = false;

				if (typeof t === "string") {
					if (t.startsWith("At Higher Levels: ")) {
						spell.entriesHigherLevel = [];
						isHigherLevelsText = true;
					} else if (t.charCodeAt(0) === DOT_CODE) {
						inList = true;
					} else {
						inList = false;
					}
					addThisShit(t);
				} else {
					addThisShit(t);
				}
			}

			function addThisShit(toAdd) {
				let targetList = spell.entriesHigherLevel === undefined ? spell.entries : spell.entriesHigherLevel;
				if (inList) {
					let prevItem = targetList.length > 0 ? targetList[targetList.length-1] : null;
					toAdd = toAdd.slice(1).trim();
					if (toAdd.includes(":") && spell.name !== "Divine Word") console.log("Might have a sub-title!: ", toAdd);
					if (prevItem !== null && prevItem.type === "list") {
						prevItem.items.push(toAdd);
					} else {
						targetList.push({"type": "list", "items": [toAdd]})
					}
				} else {
					if (typeof toAdd === "string") {
						if (!isHigherLevelsText) {
							if (toAdd.includes(":") && toAdd.indexOf(":") < 54 && spell.name !== "Warding Wind") {
								// console.log(toAdd.split(":")[0], toAdd.indexOf(":"), spell.name+"--"+spell.source);
								let temp = toAdd.split(':').slice(1).join(':');
								toAdd = {"type": "entries", "name": toAdd.split(':')[0], "entries": [temp]}
							}
							targetList.push(toAdd);
						} else {
							toAdd = toAdd.slice("At Higher Levels: ".length).trim();
							if (targetList.length === 0) {
								targetList.push({"type": "entries", "name": "At Higher Levels", "entries": [toAdd]});
							} else {
								targetList.entries.push(toAdd);
							}
						}
					} else {
						// these are all tables
						toAdd = {
							"type": "table",
							"caption": toAdd.caption,
							"colLabels": toAdd.thead,
							"colStyles": toAdd.thstyleclass,
							"rows": toAdd.tbody
						};
						for (let j = 0; j < toAdd.rows.length; j++) {
							const r = toAdd.rows[j];
							for (let k = 0; k < r.length; k++) {
								const roText = r[k];
								if (roText.includes("\u2011")) {
									r[k] = roText.replace(/\u2011/g, "-");
									if (!toAdd.colStyles[k].includes("no-wrap")) toAdd.colStyles[k] += " no-wrap"
								}
							}
						}
						targetList.push(toAdd);
					}
				}
			}
		}
	}

	console.log(SETERINO);
	// PRINTS THE SET AS A SET
/*	let setR = {}
	for (let i = 0; i < SETERINO.length; i++) {
		let xd = SETERINO[i];
		setR[xd] = ""
	}
	console.log(JSON.stringify(setR, null, 4))*/
	// PRINTS THE SET AS A LIST
	/*console.log(JSON.stringify(SETERINO.sort(), null, 4))*/

	o.value = JSON.stringify({"spell": spells}, null, "\t")
		.replace(/  /g, " ") // collapse double spaces
		.replace(/\u2014/g, "\\u2014").replace(/\u2011/g, "\\u2011"); // maintain unicode stuff
}
const RL_CLASSES = {
	"Sorcerer": "Sorcerer",
	"Wizard": "Wizard",
	"Druid": "Druid",
	"Ranger": "Ranger",
	"Cleric": "Cleric",
	"Paladin": "Paladin",
	"Bard": "Bard",
	"Warlock": "Warlock",
	"Artificer (UA)": "Artificer"
};

const CLASS_SOURCES = {
	"Sorcerer": "PHB",
	"Wizard": "PHB",
	"Druid": "PHB",
	"Ranger": "PHB",
	"Cleric": "PHB",
	"Paladin": "PHB",
	"Bard": "PHB",
	"Warlock": "PHB",
	"Artificer (UA)": "UAArtificer"
};

const CLASSES =
	{
		"Sorcerer": "PHB",
		"Wizard": "PHB",
		"Druid": "PHB",
		"Ranger": "PHB",
		"Cleric": "PHB",
		"Paladin": "PHB",
		"Bard": "PHB",
		"Warlock": "PHB",
		"Artificer (UA)": "UAArtificer",
		"Cleric (Ambition)": "PSA",
		"Cleric (Arcana)": "SCAG",
		"Cleric (City)": "UAModernMagic",
		"Cleric (Death)": "DMG",
		"Cleric (Forge)": "ClericDivineDomains",
		"Cleric (Grave)": "ClericDivineDomains",
		"Cleric (Knowledge)": "PHB",
		"Cleric (Life)": "PHB",
		"Cleric (Light)": "PHB",
		"Cleric (Nature)": "PHB",
		"Cleric (Protection)": "ClericDivineDomains",
		"Cleric (Solidarity)": "PSA",
		"Cleric (Strength)": "PSA",
		"Cleric (Tempest)": "PHB",
		"Cleric (Trickery)": "PHB",
		"Cleric (War)": "PHB",
		"Cleric (Zeal)": "PSA",
		"Druid (Arctic)": "PHB",
		"Druid (Coast)": "PHB",
		"Druid (Desert)": "PHB",
		"Druid (Forest)": "PHB",
		"Druid (Grassland)": "PHB",
		"Druid (Mountain)": "PHB",
		"Druid (Swamp)": "PHB",
		"Druid (Underdark)": "PHB",
		"Paladin (Ancients)": "PHB",
		"Paladin (Conquest)": "UAP",
		"Paladin (Crown)": "SCAG",
		"Paladin (Devotion)": "PHB",
		"Paladin (Oathbreaker)": "DMG",
		"Paladin (Treachery)": "UAP",
		"Paladin (Vengeance)": "PHB",
		"Sorcerer (Stone)": "UASorcerer",
		"Warlock (Archfey)": "PHB",
		"Warlock (Celestial)": "UARevisedClassOptions",
		"Warlock (Fiend)": "PHB",
		"Warlock (Ghost in the Machine)": "UAModernMagic",
		"Warlock (Great Old One)": "PHB",
		"Warlock (Hexblade)": "UAWarlockAndWizard",
		"Warlock (Raven Queen)": "UAWarlockAndWizard",
		"Warlock (Seeker)": "UATheFaithful",
		"Warlock (Undying Light)": "UALightDarkUnderdark",
		"Warlock (Undying)": "SCAG"
	};


function setAdd(set, item) {
	if (item === undefined || item === null) {
		console.log("oi vey!");
		return;
	}
	if (item instanceof Array) {
		for (let i = 0; i < item.length; ++i) {
			console.log("ASD");
			helper(item[i])
		}
	} else {
		helper(item)
	}

	function helper(x) {
		if (!set.includes(x)) set.push(x)
	}
}

function getXthNumber(num) {
	if (num === 1) return "1st";
	if (num === 2) return "2nd";
	if (num === 3) return "3rd";
	return num + "th"
}