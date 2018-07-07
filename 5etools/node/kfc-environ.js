/* eslint-disable */
const fs = require('fs');

const monIndex = require("../data/bestiary/index.json");
const kfc = require("../_OLD/kfc-environ-data");

const newMon = {};
Object.keys(monIndex).forEach(src => {
	newMon[monIndex[src]] = require(`../data/bestiary/${monIndex[src]}`);
});

/* KFC DATA IS NOT OFFICIAL?!
const WITH_ENV = ["abyss", "apoc", "hoard", "mm", "tiamat", "volo", "tortle"];
const WITH_ENV_NO_ADV = ["mm", "volo"]; // miss me with that gay shit

const RE_MAP = {
	"hoard.langdedrosa-cyanwrath": "hoard.langdedrosa-cynwrath",
	"mm.bone-devil-polearm": "mm.bone-devil",
	"mm.bone-naga-guardian": "mm.bone-naga",
	"mm.bone-naga-spirit": "mm.bone-naga",
	"mm.cave-bear": "mm.black-bear",
	"mm.acererak-demilich": "mm.demilich",
	"mm.drider-spellcaster": "mm.drider",
	"mm.giant-rat-diseased": "mm.giant-rat",
	"mm.gray-ooze-psychic": "mm.gray-ooze",
	"mm.half-ogre-ogrillon": "mm.half-ogre",
	"mm.ice-devil-spear": "mm.ice-devil",
	"mm.lizard-king": "mm.lizard-kingqueen",
	"mm.lizard-queen": "mm.lizard-kingqueen",
	"mm.succubus": "mm.succubusincubus",
	"mm.incubus": "mm.succubusincubus",
	"mm.swarm-of-beetles": "mm.swarm-of-insects",
	"mm.swarm-of-centipedes": "mm.swarm-of-insects",
	"mm.swarm-of-spiders": "mm.swarm-of-insects",
	"mm.swarm-of-wasps": "mm.swarm-of-insects",
	"mm.thri-kreen-psionic": "mm.thri-kreen",
	"mm.ultroloth": "mm.ultraloth",
	"mm.will-o'-wisp": "mm.will-o-wisp",
	"mm.yuan-ti-malison-type-1": "mm.yuan-ti-malison",
	"mm.yuan-ti-malison-type-2": "mm.yuan-ti-malison",
	"mm.yuan-ti-malison-type-3": "mm.yuan-ti-malison",
	"abyss.awakened-zurkhwood": null,
	"abyss.duergar-darkhaft": null,
	"abyss.duergar-kavalrachni": null,
	"abyss.duergar-keeper-of-the-flame": null,
	"abyss.emerald-enclave-scout": null,
	"abyss.fraz-urb'luu": "",
	"abyss.giant-riding-lizard": "",
	"abyss.graz'zt": "",
	"abyss.hook-horror-spore-servant": "",
	"abyss.ixitxachitl-cleric": "",
	"abyss.lords'-alliance-guard": "",
	"abyss.lords'-alliance-spy": "",
	"abyss.vampiric-ixitxachitl-cleric": "",
	"abyss.veteran-of-the-gauntlet": "",
	"abyss.deepking-horgar-steelshadow-v": "",
	"abyss.zhentarim-thug": "",
	"abyss.spider-king": "",
	"apoc.burrowshark": "",
	"apoc.ogrémoch": "",
	"tiamat.dragonclaw": "",
	"tiamat.guard-drake": "",
	"tiamat.rath-modar": "",
	"tortle.tortle": "",
	"tortle.tortle-druid": "",
	"tortle.giant-slug": "",
	"volo.black-guard-drake": "volo.guard-drake",
	"volo.blue-guard-drake": "volo.guard-drake",
	"volo.deep-rothé": "volo.rothe",
	"volo.green-guard-drake": "volo.guard-drake",
	"volo.illithilich": "volo.mind-flayer-lich-illithilich",
	"volo.mind-flayer-psion": "mm.mind-flayer",
	"volo.ox": "volo.cow-ox",
	"volo.red-guard-drake": "volo.guard-drake",
	"volo.rothé": "volo.rothe",
	"volo.tlincalli": "volo.tlingcalli",
	"volo.white-guard-drake": "volo.guard-drake",
};

const UNMAPPED_SOURCES = new Set();
function mapSource(s) {
	switch (s) {
		case "OotA":
			return "abyss";
		case "PotA":
			return "apoc";
		case "HotDQ":
			return "hoard";
		case "SKT":
			return "sking";
		case "CoS":
			return "strahd";
		case "TftYP":
			return "tftyp";
		case "RoT":
			return "tiamat";
		case "VGM":
			return "volo";
		case "TTP":
			return "tortle";
		case "ToA":
			return "toa";
		case "MM":
			return "mm"
	}
	UNMAPPED_SOURCES.add(s);
	return null;
}

function mapName(n) {
	return n.toLowerCase().replace(/[ ]/g, "-").replace(/[()]/g, "");
}

Object.values(newMon).forEach(l => {
	l.monster.forEach(m => {
		if (mapSource(m.source) && WITH_ENV_NO_ADV.includes(mapSource(m.source))) {
			if (!mapName(m.name)) return; // skip any unmapped
			let fid =  `${mapSource(m.source)}.${mapName(m.name)}`;
			if (RE_MAP[fid]) fid = RE_MAP[fid];
			const env = kfc.data.find(it => it.fid === fid);
			m.environment = env.environment.split(",") .map(it => it.trim());
			if (!env) {
				console.log(fid);
			}
		}
	});
});

const SET = new Set();
kfc.data.forEach(e => {
	if (e.environment) {
		e.environment.split(",").map(it => it.trim()).forEach(it => SET.add(it));
	}
})

// console.log(...UNMAPPED_SOURCES);
console.log(...SET);

*/

const ENV_SET = new Set();

const DJN_FILE = require("../_OLD/djn-environ-data");
const DJN = DJN_FILE.data;
const NORMALISED = {};
Object.keys(DJN).forEach(k => {
	if (!DJN[k].environment) return;
	NORMALISED[k.toLowerCase()] = Object.keys(DJN[k].environment).filter(it => DJN[k].environment[it] === "yes").map(k => k.toLowerCase())

	NORMALISED[k.toLowerCase()].forEach(env => ENV_SET.add(env));
});

const HAS_DATA = ["VGM", "MM"];

Object.values(newMon).forEach(l => {
	l.monster.forEach(m => {
		if (m.environment) delete m.environment; // undo any previous efforts
	});
});

function getMappedName (n) {
	if (DJN_FILE.names[n] !== undefined) {
		return DJN_FILE.names[n] === null ? null : DJN_FILE.names[n].toLowerCase();
	} else {
		return n.toLowerCase();
	}
}

Object.values(newMon).forEach(l => {
	l.monster.forEach(m => {
		if (HAS_DATA.includes(m.source)) {
			const mapped = getMappedName(m.name);
			if (!mapped) return; // skip any unmapped

			if (!NORMALISED[mapped]) console.log(m.name);
			m.environment = NORMALISED[mapped];
		}
	});
});

console.log(JSON.stringify([...ENV_SET], null, 2));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let doWrite = false;
if (doWrite) {
	Object.keys(newMon).forEach(file => {
		const out = JSON.stringify(newMon[file], null, "\t").replace(/( )?\u2014( )?/g, "\\u2014").replace(/\u2013/g, "\\u2014");
		fs.writeFileSync(`trash/${file}`, out, "utf8");
	});
}

console.log("done");