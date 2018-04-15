require('jsdom/lib/old-api').env("", (err, window) => {
	let $;
	if (err) {
		console.error(err);
		return;
	} else $ = require("jquery")(window);

	const fs = require('fs');
	const ut = require('../js/utils.js');
	const er = require('../js/entryrender.js');
	const o = require('../data/bestiary/bestiary-mm');
	const d = require('../mm_fixed.json');

	const ct = {};
	const dupes = [];
	d.bullshit.forEach(it => {
		it.fluff = it.fluff.trim();
		if (it.fluff) {
			const txt = $(it.fluff).filter(`p`).text();
			if (ct[txt]) {
				dupes.push(ct[txt]);
				dupes.push(it.name);
			} else if (txt) {
				ct[txt] = it.name;
			}
		}
	});
	if (dupes.length) throw new Error("duplicate text!");

	const cpy = {
		"Bone Devil Polearm": "Bone Devil",
		"Bone Naga (Guardian)": "Bone Naga",
		"Bone Naga (Spirit)": "Bone Naga",
		"Drider Spellcaster": "Drider",
		"Faerie Dragon (Blue)": "Faerie Dragon",
		"Faerie Dragon (Green)": "Faerie Dragon",
		"Faerie Dragon (Indigo)": "Faerie Dragon",
		"Faerie Dragon (Orange)": "Faerie Dragon",
		"Faerie Dragon (Red)": "Faerie Dragon",
		"Faerie Dragon (Violet)": "Faerie Dragon",
		"Faerie Dragon (Yellow)": "Faerie Dragon",
		"Gray Ooze (Psychic)": "Gray Ooze",
		"Ice Devil Spear": "Ice Devil",
		"Quaggoth Thonot": "Quaggoth",

		"Swarm of Beetles": "Generic Swarm",
		"Swarm of Centipedes": "Generic Swarm",
		"Swarm of Spiders": "Generic Swarm",
		"Swarm of Wasps": "Generic Swarm",
		"Swarm of Poisonous Snakes": "Generic Swarm",
		"Swarm of Bats": "Generic Swarm",
		"Swarm of Insects": "Generic Swarm",
		"Swarm of Quippers": "Generic Swarm",
		"Swarm of Rats": "Generic Swarm",
		"Swarm of Ravens": "Generic Swarm",

		"Thri-kreen (Psionic)": "Thri-kreen",
		"Yuan-ti Malison (Type 1)": "Yuan-ti Malison",
		"Yuan-ti Malison (Type 2)": "Yuan-ti Malison",
		"Yuan-ti Malison (Type 3)": "Yuan-ti Malison",
		"Mind Flayer Arcanist": "Mind Flayer",

		"Ancient Black Dragon": "Black Dragon",
		"Adult Black Dragon": "Black Dragon",
		"Young Black Dragon": "Black Dragon",
		"Black Dragon Wyrmling": "Black Dragon",

		"Ancient Blue Dragon": "Blue Dragon",
		"Ancient Brass Dragon": "Brass Dragon",
		"Ancient Bronze Dragon": "Bronze Dragon",
		"Ancient Copper Dragon": "Copper Dragon",
		"Ancient Gold Dragon": "Gold Dragon",
		"Ancient Green Dragon": "Green Dragon",
		"Ancient Red Dragon": "Red Dragon",
		"Ancient Silver Dragon": "Silver Dragon",
		"Ancient White Dragon": "White Dragon",

		"Young Blue Dragon": "Blue Dragon",
		"Young Brass Dragon": "Brass Dragon",
		"Young Bronze Dragon": "Bronze Dragon",
		"Young Copper Dragon": "Copper Dragon",
		"Young Gold Dragon": "Gold Dragon",
		"Young Green Dragon": "Green Dragon",
		"Young Red Dragon": "Red Dragon",
		"Young Silver Dragon": "Silver Dragon",
		"Young White Dragon": "White Dragon",

		"Adult Blue Dragon": "Blue Dragon",
		"Adult Brass Dragon": "Brass Dragon",
		"Adult Bronze Dragon": "Bronze Dragon",
		"Adult Copper Dragon": "Copper Dragon",
		"Adult Gold Dragon": "Gold Dragon",
		"Adult Green Dragon": "Green Dragon",
		"Adult Red Dragon": "Red Dragon",
		"Adult Silver Dragon": "Silver Dragon",
		"Adult White Dragon": "White Dragon",

		"Blue Dragon Wyrmling": "Blue Dragon",
		"Brass Dragon Wyrmling": "Brass Dragon",
		"Bronze Dragon Wyrmling": "Bronze Dragon",
		"Copper Dragon Wyrmling": "Copper Dragon",
		"Gold Dragon Wyrmling": "Gold Dragon",
		"Green Dragon Wyrmling": "Green Dragon",
		"Red Dragon Wyrmling": "Red Dragon",
		"Silver Dragon Wyrmling": "Silver Dragon",
		"White Dragon Wyrmling": "White Dragon",

		"Fire Snake": "Salamander",
		"Githyanki Knight": "Githyanki",
		"Githyanki Warrior": "Githyanki",
		"Githzerai Monk": "Githzerai",
		"Githzerai Zerth": "Githzerai",
		"Bugbear Chief": "Bugbear",
		"Goblin Boss": "Goblin",
		"Hobgoblin Captain": "Hobgoblin",
		"Hobgoblin Warlord": "Hobgoblin",
		"Winged Kobold": "Kobold",
		"Lizard King": "Lizardfolk",
		"Lizard Queen": "Lizardfolk",
		"Lizardfolk Shaman": "Lizardfolk",
		"Sahuagin Priestess": "Sahuagin",
		"Sahuagin Baron": "Sahuagin",
		"Grick Alpha": "Grick",
		"Abominable Yeti": "Yeti",
		"Myconid Adult": "Myconid",
		"Myconid Sprout": "Myconid",
		"Myconid Sovereign": "Myconid",
		"Quaggoth Spore Servant": "Myconid",

		"Incubus": "Succubus/Incubus",
		"Succubus": "Succubus/Incubus",

		"Kuo-toa Archpriest": "Kuo-toa",
		"Kuo-toa Whip": "Kuo-toa",
		"Kuo-toa Monitor": "Kuo-toa",

		"Ghast": "Ghoul",

		"Beholder Zombie": "Zombie",
		"Ogre Zombie": "Zombie",

		"Minotaur Skeleton": "Skeleton",
		"Warhorse Skeleton": "Skeleton",

		"Vampire Spawn": "Vampire",
		"Vampire Spellcaster": "Vampire",
		"Vampire Warrior": "Vampire",

		"Young Remorhaz": "Remorhaz",
		"Young Red Shadow Dragon": "Shadow Dragon"
	};

	const unmapped = [];

	// validate mapped
	o.monster.sort((a, b) => SortUtil.ascSort(a.name, b.name)).map(it => {
		if (cpy[it.name]) {
			if (!d.bullshit.find(f => f.name.trim().toLowerCase() === cpy[it.name].trim().toLowerCase())) {
				throw new Error("unmapped copy!")
			}
		}
	});

	let out = o.monster.sort((a, b) => SortUtil.ascSort(a.name, b.name)).map(it => {
		if (cpy[it.name]) {
			return {
				name: it.name,
				source: it.source,
				_copy: {
					name: cpy[it.name],
					source: it.source
				}
			}
		} else {
			const ixFlf = d.bullshit.findIndex(f => f.name.trim().toLowerCase() === it.name.trim().toLowerCase());
			if (ixFlf === undefined) {
				unmapped.push(it.name);
				console.log(`Unmapped: ${it.name}`);
			} else {
				return d.bullshit.splice(ixFlf, 1)[0];
			}
		}
	});
	Array.prototype.push.apply(out, d.bullshit);

	const procOut = out.map(it => {
		if (it.fluff) {
			const out = {name: it.name, source: "MM"};

			let $f = $(it.fluff);

			// strip images
			const $i = $f.filter(`a`);
			if ($i.length) {
				$f = $f.not(`a`);
				out.images = [];

				$i.map((i, e) => {
					const $e = $(e);

					out.images.push({
						type: "image",
						href: {
							type: "internal",
							path: `bestiary/MM/${$e.attr("href").replace("images/", "")}`
						}
					})
				})
			}

			const ent = {
				type: "entries",
				entries: []
			};
			let ptr = ent;
			// get text
			$f.map((i, e) => {
				const $e = $(e);

				if ($e.is("p")) {
					ptr.entries.push($e.text())
				} else if ($e.is("h")) {
					ptr = {
						type: "entries",
						name: $e.text(),
						entries: []
					};
					ent.entries.push(ptr);
				} else if ($e.is("list")) {
					const l = {
						type: "list",
						items: []
					};
					ptr.entries.push(l);
					$e.children().map((i, c) => {
						l.items.push($(c).text())
					});
				} else if ($e.is("table")) {
					const out = {
						"type": "table",
						"caption": "",
						"colLabels": [],
						"colStyles": [
							"col-xs-6",
							"col-xs-6"
						],
						"rows": []
					};

					const h = $e.find(`tr[decoration="underline"]`);
					if (h) {
						out.colLabels = h.find(`td`).map((i, e) => {
							return $(e).text();
						}).get();
					} else delete out.colLabels;

					const rs = $e.find(`tr[decoration!="underline"]`);
					rs.each((i, r) => {
						out.rows.push(
							$(r).find(`td`).map((i, e) => {
								return $(e).text();
							}).get()
						)
					});

					ptr.entries.push(out)
				} else {
					console.log("unmapped node type: ", $e[0].nodeType);
				}
			});

			out.entries = ent;
			return out;
		} else if (it._copy) {
			return it;
		}
	}).filter(it => it);

	const toWrite = JSON.stringify({monster: procOut}, null, "\t");
	// TODO other fluff
	// fs.writeFileSync("data/bestiary/fluff-bestiary-mm.json", toWrite, "utf8");
});