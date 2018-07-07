/* eslint-disable */
const fs = require('fs');
const ut = require('../js/utils.js');
const er = require('../js/entryrender.js');

const spellIndex = require("../data/spells/index.json");

const workOn = {};
Object.keys(spellIndex).forEach(src => {
	workOn[spellIndex[src]] = require(`../data/spells/${spellIndex[src]}`)
});

const includeBrew = true;
if (includeBrew) {
	fs.readdirSync("../homebrew/spell/").forEach(f => {
		workOn[f] = JSON.parse(fs.readFileSync(`../homebrew/spell/${f}`, "utf8"));
	});
}

// stuff to break a list of all components into items
const componentOut = [];
const componentSet = new Set();

const testSet = new Set();
require("C:\\Users\\Murray\\AppData\\Roaming\\npm\\node_modules\\jsdom\\lib\\old-api").env("", function(err, window) {
	if (err) {
		console.error(err);
		return;
	}
	const $ = require("C:\\Users\\Murray\\AppData\\Roaming\\npm\\node_modules\\jquery")(window);
	Object.values(workOn).forEach(l => {
		l.spell.forEach(s => {
			const componentStage1 = () => {
				if (s.components && s.components.m && s.components.m !== true && !s.components.m.text) {
					const removeA = (str) => {
						return str.replace(/^a(n)? /gi, "");
					};

					let mat;
					if (s.components.m.text) {
						let mat = s.components.m.text;
						// remove "which the spell consumes"
						mat = mat.replace(/which the spell consumes/gi, "");
						mat = mat.trim().replace(/,$/, "");

					} else {
						mat = s.components.m;

					}
					mat = removeA(mat);

					const splitter = new RegExp(/( or | and |,\s?(?![^(]*\)))/, "gi"); // order (LUL) is important
					const mats = mat.split(splitter)
						.filter(it => it)
						.map(it => it.trim())
						.filter(it => it !== "," && it !== "and" && it !== "or")
						.filter(it => {
							const r = /(^worth |^000)/.exec(it);
							return !r;
						})
						.map(it => removeA(removeA(it).replace(/^(or|and) /i, "")))
						.forEach(m => {
							const titular = m.toTitleCase();
							if (componentSet.has(titular)) {

								const found = componentOut.find(it => it.name === titular)
								found._spells.push({
									n: s.name,
									s: s.source
								})
							} else {
								componentOut.push({
									name: titular,
									type: "SCF",
									rarity: "None",
									_spells: [
										{
											n: s.name,
											s: s.source
										}
									],
									source: "5eTools"
								});
							}
							componentSet.add(titular)
						});
				}
			};

			const renderer = new er.EntryRenderer();
			const renderStack = [];

			const entryList = {type: "entries", entries: s.entries};
			renderer.recursiveEntryRender(entryList, renderStack, 1);
			if (s.entriesHigherLevel) {
				const higherLevelsEntryList = {type: "entries", entries: s.entriesHigherLevel};
				renderer.recursiveEntryRender(higherLevelsEntryList, renderStack, 2);
			}

			const text = $(`<div>${renderStack.join("")}</div>`).text();

			// TODO search text for "spell attack" or something
			const isM = text.toLowerCase().includes("melee spell attack");
			const isR = text.toLowerCase().includes("ranged spell attack");
			const isU = !isM && !isR && text.toLowerCase().includes("spell attack");
			if (isM || isR || isU) {
				s.spellAttack =[isM ? "M" : "", isR ? "R" : "", isU ? "O" : ""].filter(it => it);
			}
		});
	});
	console.log(JSON.stringify([...testSet], null, "\t"));

	const componentStage2 = () => {
		componentOut.forEach((it, ix) => {
			function asText (spell) {
				return `{@spell ${spell.n}|${spell.s}}`
			}

			let s = "";
			if (it._spells.length === 1) {
				s = asText(it._spells[0])
			} else {
				s = CollectionUtil.joinConjunct(it._spells.map(spell => asText(spell)), ", ", " and ");
			}
			delete it._spells
			it.entries = [
				`A spell component used in ${s}.`
			];
		});

		console.log(JSON.stringify([...componentSet], null, "\t"));

		const dump = JSON.stringify(componentOut, null, "\t").replace(/( )?\u2014( )?/g, "\\u2014").replace(/\u2013/g, "\\u2014");
		fs.writeFileSync(`trash/test.json`, dump, "utf8");
	};

	let doWrite = true;
	if (doWrite) {
		Object.keys(workOn).forEach(file => {
			const out = JSON.stringify(workOn[file], null, "\t").replace(/( )?\u2014( )?/g, "\\u2014").replace(/\u2013/g, "\\u2014");

			fs.writeFileSync(`trash/${file}`, out, "utf8");
		});
	}

	console.log("done");
});