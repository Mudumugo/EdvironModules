// Legacy kenya locations - use modular data from kenya-locations-data.ts
export * from './kenya-locations-data';

export const KENYAN_COUNTIES: County[] = [
  {
    id: "001",
    name: "Mombasa",
    code: "MSA",
    constituencies: [
      {
        id: "001001",
        name: "Changamwe",
        wards: [
          { id: "001001001", name: "Port Reitz" },
          { id: "001001002", name: "Kipevu" },
          { id: "001001003", name: "Airport" },
          { id: "001001004", name: "Changamwe" },
          { id: "001001005", name: "Chaani" }
        ]
      },
      {
        id: "001002",
        name: "Jomba",
        wards: [
          { id: "001002001", name: "Jomba" },
          { id: "001002002", name: "Miritini" },
          { id: "001002003", name: "Mikindani" }
        ]
      },
      {
        id: "001003",
        name: "Kisauni",
        wards: [
          { id: "001003001", name: "Mjambere" },
          { id: "001003002", name: "Junda" },
          { id: "001003003", name: "Bamburi" },
          { id: "001003004", name: "Mwakirunge" },
          { id: "001003005", name: "Mtopanga" },
          { id: "001003006", name: "Magogoni" }
        ]
      },
      {
        id: "001004",
        name: "Nyali",
        wards: [
          { id: "001004001", name: "Frere Town" },
          { id: "001004002", name: "Ziwa La Ng'Ombe" },
          { id: "001004003", name: "Mkomani" },
          { id: "001004004", name: "Kongowea" },
          { id: "001004005", name: "Kadzandani" }
        ]
      },
      {
        id: "001005",
        name: "Likoni",
        wards: [
          { id: "001005001", name: "Mtongwe" },
          { id: "001005002", name: "Shika Adabu" },
          { id: "001005003", name: "Bofu" },
          { id: "001005004", name: "Likoni" },
          { id: "001005005", name: "Timbwani" }
        ]
      },
      {
        id: "001006",
        name: "Mvita",
        wards: [
          { id: "001006001", name: "Mji Wa Kale/Makadara" },
          { id: "001006002", name: "Tudor" },
          { id: "001006003", name: "Tononoka" },
          { id: "001006004", name: "Shimanzi/Ganjoni" },
          { id: "001006005", name: "Majengo" }
        ]
      }
    ]
  },
  {
    id: "002",
    name: "Kwale",
    code: "KWL",
    constituencies: [
      {
        id: "002001",
        name: "Msambweni",
        wards: [
          { id: "002001001", name: "Lunga Lunga" },
          { id: "002001002", name: "Vanga" },
          { id: "002001003", name: "Msambweni" },
          { id: "002001004", name: "Kinondo" },
          { id: "002001005", name: "Ramisi" }
        ]
      },
      {
        id: "002002",
        name: "Lungalunga",
        wards: [
          { id: "002002001", name: "Mwereni" },
          { id: "002002002", name: "Vanga" },
          { id: "002002003", name: "Lunga Lunga" }
        ]
      },
      {
        id: "002003",
        name: "Matuga",
        wards: [
          { id: "002003001", name: "Tsimba Golini" },
          { id: "002003002", name: "Waa" },
          { id: "002003003", name: "Tiwi" },
          { id: "002003004", name: "Kubo South" },
          { id: "002003005", name: "Mkongani" }
        ]
      },
      {
        id: "002004",
        name: "Kilifi North",
        wards: [
          { id: "002004001", name: "Tezo" },
          { id: "002004002", name: "Sokoke" },
          { id: "002004003", name: "Kibaoni" },
          { id: "002004004", name: "Matsangoni" },
          { id: "002004005", name: "Watamu" }
        ]
      }
    ]
  },
  {
    id: "047",
    name: "Nairobi",
    code: "NRB",
    constituencies: [
      {
        id: "047001",
        name: "Westlands",
        wards: [
          { id: "047001001", name: "Kitisuru" },
          { id: "047001002", name: "Parklands/Highridge" },
          { id: "047001003", name: "Karura" },
          { id: "047001004", name: "Kangemi" },
          { id: "047001005", name: "Mountain View" }
        ]
      },
      {
        id: "047002",
        name: "Dagoretti North",
        wards: [
          { id: "047002001", name: "Kilimani" },
          { id: "047002002", name: "Kawangware" },
          { id: "047002003", name: "Gatina" },
          { id: "047002004", name: "Kileleshwa" },
          { id: "047002005", name: "Kabiro" }
        ]
      },
      {
        id: "047003",
        name: "Dagoretti South",
        wards: [
          { id: "047003001", name: "Mutu-ini" },
          { id: "047003002", name: "Ngando" },
          { id: "047003003", name: "Riruta" },
          { id: "047003004", name: "Uthiru/Ruthimitu" },
          { id: "047003005", name: "Waithaka" }
        ]
      },
      {
        id: "047004",
        name: "Langata",
        wards: [
          { id: "047004001", name: "Karen" },
          { id: "047004002", name: "Nairobi West" },
          { id: "047004003", name: "Mugumo-ini" },
          { id: "047004004", name: "South C" },
          { id: "047004005", name: "Nyayo Highrise" }
        ]
      },
      {
        id: "047005",
        name: "Kibra",
        wards: [
          { id: "047005001", name: "Laini Saba" },
          { id: "047005002", name: "Lindi" },
          { id: "047005003", name: "Makina" },
          { id: "047005004", name: "Woodley/Kenyatta Golf Course" },
          { id: "047005005", name: "Sarang'ombe" }
        ]
      },
      {
        id: "047006",
        name: "Roysambu",
        wards: [
          { id: "047006001", name: "Githurai" },
          { id: "047006002", name: "Kahawa West" },
          { id: "047006003", name: "Zimmerman" },
          { id: "047006004", name: "Roysambu" },
          { id: "047006005", name: "Kahawa" }
        ]
      },
      {
        id: "047007",
        name: "Kasarani",
        wards: [
          { id: "047007001", name: "Clay City" },
          { id: "047007002", name: "Mwiki" },
          { id: "047007003", name: "Kasarani" },
          { id: "047007004", name: "Njiru" },
          { id: "047007005", name: "Ruai" }
        ]
      },
      {
        id: "047008",
        name: "Ruaraka",
        wards: [
          { id: "047008001", name: "Baba Dogo" },
          { id: "047008002", name: "Utalii" },
          { id: "047008003", name: "Mathare North" },
          { id: "047008004", name: "Lucky Summer" },
          { id: "047008005", name: "Korogocho" }
        ]
      },
      {
        id: "047009",
        name: "Embakasi South",
        wards: [
          { id: "047009001", name: "Imara Daima" },
          { id: "047009002", name: "Kwa Njenga" },
          { id: "047009003", name: "Kwa Reuben" },
          { id: "047009004", name: "Pipeline" },
          { id: "047009005", name: "Kware" }
        ]
      },
      {
        id: "047010",
        name: "Embakasi North",
        wards: [
          { id: "047010001", name: "Kariobangi North" },
          { id: "047010002", name: "Dandora Area I" },
          { id: "047010003", name: "Dandora Area II" },
          { id: "047010004", name: "Dandora Area III" },
          { id: "047010005", name: "Dandora Area IV" }
        ]
      },
      {
        id: "047011",
        name: "Embakasi Central",
        wards: [
          { id: "047011001", name: "Kayole North" },
          { id: "047011002", name: "Kayole Central" },
          { id: "047011003", name: "Kayole South" },
          { id: "047011004", name: "Komarock" },
          { id: "047011005", name: "Matopeni/Spring Valley" }
        ]
      },
      {
        id: "047012",
        name: "Embakasi East",
        wards: [
          { id: "047012001", name: "Upper Savannah" },
          { id: "047012002", name: "Lower Savannah" },
          { id: "047012003", name: "Embakasi" },
          { id: "047012004", name: "Utawala" },
          { id: "047012005", name: "Mihango" }
        ]
      },
      {
        id: "047013",
        name: "Embakasi West",
        wards: [
          { id: "047013001", name: "Umoja I" },
          { id: "047013002", name: "Umoja II" },
          { id: "047013003", name: "Mowlem" },
          { id: "047013004", name: "Kariobangi South" }
        ]
      },
      {
        id: "047014",
        name: "Makadara",
        wards: [
          { id: "047014001", name: "Maringo/Hamza" },
          { id: "047014002", name: "Viwandani" },
          { id: "047014003", name: "Harambee" },
          { id: "047014004", name: "Makongeni" }
        ]
      },
      {
        id: "047015",
        name: "Kamukunji",
        wards: [
          { id: "047015001", name: "Pumwani" },
          { id: "047015002", name: "Eastleigh North" },
          { id: "047015003", name: "Eastleigh South" },
          { id: "047015004", name: "Airbase" },
          { id: "047015005", name: "California" }
        ]
      },
      {
        id: "047016",
        name: "Starehe",
        wards: [
          { id: "047016001", name: "Nairobi Central" },
          { id: "047016002", name: "Ngara" },
          { id: "047016003", name: "Pangani" },
          { id: "047016004", name: "Ziwani/Kariokor" },
          { id: "047016005", name: "Landimawe" },
          { id: "047016006", name: "Nairobi South" }
        ]
      },
      {
        id: "047017",
        name: "Mathare",
        wards: [
          { id: "047017001", name: "Hospital" },
          { id: "047017002", name: "Mabatini" },
          { id: "047017003", name: "Huruma" },
          { id: "047017004", name: "Ngei" },
          { id: "047017005", name: "Mlango Kubwa" },
          { id: "047017006", name: "Kiamaiko" }
        ]
      }
    ]
  }
];

// Utility functions for location data
export function getCountyByName(name: string): County | undefined {
  return KENYAN_COUNTIES.find(county => 
    county.name.toLowerCase() === name.toLowerCase()
  );
}

export function getConstituencyByName(countyName: string, constituencyName: string): Constituency | undefined {
  const county = getCountyByName(countyName);
  if (!county) return undefined;
  
  return county.constituencies.find(constituency => 
    constituency.name.toLowerCase() === constituencyName.toLowerCase()
  );
}

export function getWardByName(countyName: string, constituencyName: string, wardName: string): Ward | undefined {
  const constituency = getConstituencyByName(countyName, constituencyName);
  if (!constituency) return undefined;
  
  return constituency.wards.find(ward => 
    ward.name.toLowerCase() === wardName.toLowerCase()
  );
}

export function getAllCountyNames(): string[] {
  return KENYAN_COUNTIES.map(county => county.name).sort();
}

export function getConstituenciesByCounty(countyName: string): string[] {
  const county = getCountyByName(countyName);
  if (!county) return [];
  
  return county.constituencies.map(constituency => constituency.name).sort();
}

export function getWardsByConstituency(countyName: string, constituencyName: string): string[] {
  const constituency = getConstituencyByName(countyName, constituencyName);
  if (!constituency) return [];
  
  return constituency.wards.map(ward => ward.name).sort();
}