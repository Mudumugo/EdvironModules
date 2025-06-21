// Comprehensive Kenyan Geographic Data
// Data source: Independent Electoral and Boundaries Commission (IEBC) of Kenya

export interface Ward {
  id: string;
  name: string;
}

export interface Constituency {
  id: string;
  name: string;
  wards: Ward[];
}

export interface County {
  id: string;
  name: string;
  code: string;
  constituencies: Constituency[];
}

// Core county data structure
export const COUNTY_CODES = {
  MOMBASA: "001",
  KWALE: "002", 
  KILIFI: "003",
  TANA_RIVER: "004",
  LAMU: "005",
  TAITA_TAVETA: "006",
  GARISSA: "007",
  WAJIR: "008",
  MANDERA: "009",
  MARSABIT: "010",
  ISIOLO: "011",
  MERU: "012",
  THARAKA_NITHI: "013",
  EMBU: "014",
  KITUI: "015",
  MACHAKOS: "016",
  MAKUENI: "017",
  NYANDARUA: "018",
  NYERI: "019",
  KIRINYAGA: "020",
  MURANGA: "021",
  KIAMBU: "022",
  TURKANA: "023",
  WEST_POKOT: "024",
  SAMBURU: "025",
  TRANS_NZOIA: "026",
  UASIN_GISHU: "027",
  ELGEYO_MARAKWET: "028",
  NANDI: "029",
  BARINGO: "030",
  LAIKIPIA: "031",
  NAKURU: "032",
  NAROK: "033",
  KAJIADO: "034",
  KERICHO: "035",
  BOMET: "036",
  KAKAMEGA: "037",
  VIHIGA: "038",
  BUNGOMA: "039",
  BUSIA: "040",
  SIAYA: "041",
  KISUMU: "042",
  HOMA_BAY: "043",
  MIGORI: "044",
  KISII: "045",
  NYAMIRA: "046",
  NAIROBI: "047"
} as const;

// County name mappings
export const COUNTY_NAMES = {
  [COUNTY_CODES.MOMBASA]: "Mombasa",
  [COUNTY_CODES.KWALE]: "Kwale",
  [COUNTY_CODES.KILIFI]: "Kilifi",
  [COUNTY_CODES.TANA_RIVER]: "Tana River",
  [COUNTY_CODES.LAMU]: "Lamu",
  [COUNTY_CODES.TAITA_TAVETA]: "Taita Taveta",
  [COUNTY_CODES.GARISSA]: "Garissa",
  [COUNTY_CODES.WAJIR]: "Wajir",
  [COUNTY_CODES.MANDERA]: "Mandera",
  [COUNTY_CODES.MARSABIT]: "Marsabit",
  [COUNTY_CODES.ISIOLO]: "Isiolo",
  [COUNTY_CODES.MERU]: "Meru",
  [COUNTY_CODES.THARAKA_NITHI]: "Tharaka Nithi",
  [COUNTY_CODES.EMBU]: "Embu",
  [COUNTY_CODES.KITUI]: "Kitui",
  [COUNTY_CODES.MACHAKOS]: "Machakos",
  [COUNTY_CODES.MAKUENI]: "Makueni",
  [COUNTY_CODES.NYANDARUA]: "Nyandarua",
  [COUNTY_CODES.NYERI]: "Nyeri",
  [COUNTY_CODES.KIRINYAGA]: "Kirinyaga",
  [COUNTY_CODES.MURANGA]: "Muranga",
  [COUNTY_CODES.KIAMBU]: "Kiambu",
  [COUNTY_CODES.TURKANA]: "Turkana",
  [COUNTY_CODES.WEST_POKOT]: "West Pokot",
  [COUNTY_CODES.SAMBURU]: "Samburu",
  [COUNTY_CODES.TRANS_NZOIA]: "Trans Nzoia",
  [COUNTY_CODES.UASIN_GISHU]: "Uasin Gishu",
  [COUNTY_CODES.ELGEYO_MARAKWET]: "Elgeyo Marakwet",
  [COUNTY_CODES.NANDI]: "Nandi",
  [COUNTY_CODES.BARINGO]: "Baringo",
  [COUNTY_CODES.LAIKIPIA]: "Laikipia",
  [COUNTY_CODES.NAKURU]: "Nakuru",
  [COUNTY_CODES.NAROK]: "Narok",
  [COUNTY_CODES.KAJIADO]: "Kajiado",
  [COUNTY_CODES.KERICHO]: "Kericho",
  [COUNTY_CODES.BOMET]: "Bomet",
  [COUNTY_CODES.KAKAMEGA]: "Kakamega",
  [COUNTY_CODES.VIHIGA]: "Vihiga",
  [COUNTY_CODES.BUNGOMA]: "Bungoma",
  [COUNTY_CODES.BUSIA]: "Busia",
  [COUNTY_CODES.SIAYA]: "Siaya",
  [COUNTY_CODES.KISUMU]: "Kisumu",
  [COUNTY_CODES.HOMA_BAY]: "Homa Bay",
  [COUNTY_CODES.MIGORI]: "Migori",
  [COUNTY_CODES.KISII]: "Kisii",
  [COUNTY_CODES.NYAMIRA]: "Nyamira",
  [COUNTY_CODES.NAIROBI]: "Nairobi"
} as const;

// Utility functions
export const getCountyById = (id: string): string | undefined => {
  return COUNTY_NAMES[id as keyof typeof COUNTY_NAMES];
};

export const getCountyCode = (name: string): string | undefined => {
  const entry = Object.entries(COUNTY_NAMES).find(([_, countyName]) => 
    countyName.toLowerCase() === name.toLowerCase()
  );
  return entry?.[0];
};

export const getAllCounties = (): Array<{ id: string; name: string; code: string }> => {
  return Object.entries(COUNTY_NAMES).map(([id, name]) => ({
    id,
    name,
    code: id
  }));
};

// Major cities and towns
export const MAJOR_CITIES = [
  { name: "Nairobi", county: COUNTY_CODES.NAIROBI },
  { name: "Mombasa", county: COUNTY_CODES.MOMBASA },
  { name: "Kisumu", county: COUNTY_CODES.KISUMU },
  { name: "Nakuru", county: COUNTY_CODES.NAKURU },
  { name: "Eldoret", county: COUNTY_CODES.UASIN_GISHU },
  { name: "Thika", county: COUNTY_CODES.KIAMBU },
  { name: "Malindi", county: COUNTY_CODES.KILIFI },
  { name: "Kitale", county: COUNTY_CODES.TRANS_NZOIA },
  { name: "Garissa", county: COUNTY_CODES.GARISSA },
  { name: "Kakamega", county: COUNTY_CODES.KAKAMEGA }
];

// Educational regions
export const EDUCATIONAL_REGIONS = [
  { name: "Central", counties: [COUNTY_CODES.NYERI, COUNTY_CODES.KIRINYAGA, COUNTY_CODES.MURANGA, COUNTY_CODES.KIAMBU] },
  { name: "Coast", counties: [COUNTY_CODES.MOMBASA, COUNTY_CODES.KWALE, COUNTY_CODES.KILIFI, COUNTY_CODES.TANA_RIVER, COUNTY_CODES.LAMU, COUNTY_CODES.TAITA_TAVETA] },
  { name: "Eastern", counties: [COUNTY_CODES.MERU, COUNTY_CODES.THARAKA_NITHI, COUNTY_CODES.EMBU, COUNTY_CODES.KITUI, COUNTY_CODES.MACHAKOS, COUNTY_CODES.MAKUENI] },
  { name: "North Eastern", counties: [COUNTY_CODES.GARISSA, COUNTY_CODES.WAJIR, COUNTY_CODES.MANDERA] },
  { name: "Northern", counties: [COUNTY_CODES.MARSABIT, COUNTY_CODES.ISIOLO, COUNTY_CODES.SAMBURU, COUNTY_CODES.TURKANA, COUNTY_CODES.WEST_POKOT] },
  { name: "Nyanza", counties: [COUNTY_CODES.SIAYA, COUNTY_CODES.KISUMU, COUNTY_CODES.HOMA_BAY, COUNTY_CODES.MIGORI, COUNTY_CODES.KISII, COUNTY_CODES.NYAMIRA] },
  { name: "Rift Valley", counties: [COUNTY_CODES.TRANS_NZOIA, COUNTY_CODES.UASIN_GISHU, COUNTY_CODES.ELGEYO_MARAKWET, COUNTY_CODES.NANDI, COUNTY_CODES.BARINGO, COUNTY_CODES.LAIKIPIA, COUNTY_CODES.NAKURU, COUNTY_CODES.NAROK, COUNTY_CODES.KAJIADO, COUNTY_CODES.KERICHO, COUNTY_CODES.BOMET] },
  { name: "Western", counties: [COUNTY_CODES.KAKAMEGA, COUNTY_CODES.VIHIGA, COUNTY_CODES.BUNGOMA, COUNTY_CODES.BUSIA] }
];

export default {
  COUNTY_CODES,
  COUNTY_NAMES,
  MAJOR_CITIES,
  EDUCATIONAL_REGIONS,
  getCountyById,
  getCountyCode,
  getAllCounties
};