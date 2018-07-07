/* eslint-disable */
const Z_BAK_CPY_MM = {
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
const Z_BAK_CPY_VGM = {
	"Black Guard Drake": "Guard Drake",
	"Blue Guard Drake": "Guard Drake",
	"Deep Rothé": "Rothe, Deep",
	"Green Guard Drake": "Guard Drake",
	"Kobold Dragonshield": "Kobold Dragonshield, Black",
	"Red Guard Drake": "Guard Drake",
	"Rothé": "Rothe",
	"White Guard Drake": "Guard Drake",
	"Xvart Speaker": "Xvart"
};

// CONFIG STUFF
const SOURCE = "CoS";
const FILE = "../data/bestiary/bestiary-cos";
const FLUFF_FILE = "../_OLD/cos_fluff.json";

require("C:\\Users\\Murray\\AppData\\Roaming\\npm\\node_modules\\jsdom\\lib\\old-api").env("", function(err, window) {
	if (err) {
		console.error(err);
		return;
	}
	const $ = require("C:\\Users\\Murray\\AppData\\Roaming\\npm\\node_modules\\jquery")(window);
	const fs = require('fs');
	const ut = require('../js/utils.js');
	const er = require('../js/entryrender.js');

	const o = require(FILE);
	const d = require(FLUFF_FILE);

	const IMAGES = [];

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
	// FIXME enable + check
	// if (dupes.length) throw new Error("duplicate text!");

	// fill this out with `5etools name => fluff name`
	const cpy = {

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
			if (ixFlf === -1) {
				unmapped.push(it.name);
				console.log(`Unmapped: ${it.name}`);
			} else {
				return d.bullshit.splice(ixFlf, 1)[0];
			}
		}
	});
	Array.prototype.push.apply(out, d.bullshit);

	const allNames = new Set(o.monster.map(it => it.name.toLowerCase()));
	const nameMap = {

	};

	const procOut = out
		.filter(it => it) // no fluff
		.filter(it => o.monster.find(m => m.name.toLowerCase() === it.name.toLowerCase()))
		.map(it => {
		if (it.fluff) {
			allNames.delete(it.name.toLowerCase());
			const out = {name: it.name, source: SOURCE};

			let $f = $(it.fluff);

			// strip images
			// OLD FORMAT
			// const $i = $f.filter(`a`);
			// if ($i.length) {
			// 	$f = $f.not(`a`);
			// 	out.images = [];
			//
			// 	$i.map((i, e) => {
			// 		const $e = $(e);
			//
			// 		out.images.push({
			// 			type: "image",
			// 			href: {
			// 				type: "internal",
			// 				path: `bestiary/${SOURCE}/${$e.attr("href").replace("images/", "")}`
			// 			}
			// 		})
			// 	})
			// }

			// NU FORMAT
			$f = $f.not(`link`);
			if (it.image_path) {
				out.images = out.images || [];
				IMAGES.push(it.image_path.replace("images\\", ""));
				out.images.push({
					type: "image",
					href: {
						type: "internal",
						path: `bestiary/${SOURCE}/${it.image_path.replace("images\\", "")}`
					}
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
					console.log("unmapped node type: ", $e[0].nodeType, $e.html());
				}
			});

			if (ent.entries && ent.entries[0] && ent.entries[0].name) {
				delete ent.entries[0].name;
			}
			out.entries = ent;

			// post-process entries

			return out;
		} else if (it._copy) {
			return it;
		}
	}).filter(it => it);

	console.log("No fluff for:");
	console.log(JSON.stringify([...allNames], null, "\t"));

	console.log("Deez some images");
	const toWrite = JSON.stringify({monster: procOut}, null, "\t");
	fs.writeFileSync(`data/bestiary/fluff-bestiary-${SOURCE.toLowerCase()}.json`, toWrite, "utf8");
	console.log(JSON.stringify(IMAGES, null, 2));
	console.log("done")
});
