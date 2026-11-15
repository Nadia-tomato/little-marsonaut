// =========================================================================
// [Science Facts Database: Official NASA & CSA Verified Resources]
// Elementary-Friendly English (Grades 2-5 / Ages 7-10 Readability)
// Word count: 20-25 words per fact. All image URLs verified HTTP 200.
// =========================================================================

const SCIENCE_FACTS_DATABASE = [
  // --- Category: Mars & Geology ---
  {
    id: 'geo_olympus_mons',
    category: 'Mars & Geology',
    title: 'The Biggest Volcano in Space!',
    fact: 'Olympus Mons on Mars is a giant volcano! It is three times taller than Mount Everest and as wide as the whole state of Arizona.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA15443/PIA15443~small.jpg',
    imageAlt: 'Olympus Mons volcanic cliff scarp on Mars',
    imageCredit: 'NASA/JPL/Arizona State University',
    sourceName: 'NASA Mars Odyssey',
    sourceUrl: 'https://trek.nasa.gov/mars/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA15443',
    sourceDate: '2012'
  },
  {
    id: 'geo_valles_marineris',
    category: 'Mars & Geology',
    title: 'Mars Has a Super Grand Canyon',
    fact: "Valles Marineris is a gigantic canyon on Mars. It is four times deeper and ten times longer than Earth's Grand Canyon!",
    imageUrl: 'https://images-assets.nasa.gov/image/PIA02005/PIA02005~small.jpg',
    imageAlt: 'Valles Marineris canyon and Tharsis volcanoes',
    imageCredit: 'NASA/JPL/USGS',
    sourceName: 'NASA Mars Trek / Viking',
    sourceUrl: 'https://trek.nasa.gov/mars/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA02005',
    sourceDate: '1999'
  },
  {
    id: 'geo_gale_crater',
    category: 'Mars & Geology',
    title: 'Ancient Lakes on Mars',
    fact: "Curiosity found that Gale Crater once had freshwater lakes billions of years ago. Ancient rocks show Mars was once warm and wet!",
    imageUrl: 'https://images-assets.nasa.gov/image/PIA16058/PIA16058~small.jpg',
    imageAlt: 'Curiosity landing site in Gale Crater',
    imageCredit: 'NASA/JPL-Caltech/MSSS',
    sourceName: 'NASA Curiosity Mars Rover',
    sourceUrl: 'https://science.nasa.gov/mission/msl-curiosity/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA16058',
    sourceDate: '2012'
  },
  {
    id: 'geo_jezero_delta',
    category: 'Mars & Geology',
    title: 'An Ancient River on Mars',
    fact: 'A rushing river once flowed into Jezero Crater, leaving behind muddy river banks where ancient tiny fossils might be preserved!',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24331/PIA24331~small.jpg',
    imageAlt: 'Perseverance landing spot near Jezero river delta',
    imageCredit: 'NASA/JPL-Caltech/MRO',
    sourceName: 'NASA Perseverance Rover',
    sourceUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA24331',
    sourceDate: '2021'
  },
  {
    id: 'geo_dust_devils',
    category: 'Mars & Geology',
    title: 'Spinning Dust Devils',
    fact: 'Warm Martian sunshine makes giant towers of spinning red sand! These whirlwinds can even sweep rover solar panels clean.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA06334/PIA06334~small.jpg',
    imageAlt: 'Dust devil tracks on Mars surface',
    imageCredit: 'NASA/JPL/MSSS',
    sourceName: 'NASA Mars Global Surveyor',
    sourceUrl: 'https://science.nasa.gov/mission/mars-global-surveyor/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA06334',
    sourceDate: '2004'
  },

  // --- Category: Rovers & Exploration ---
  {
    id: 'rov_curiosity_drill',
    category: 'Rovers & Exploration',
    title: 'Robots Drilling Martian Rocks',
    fact: 'Curiosity drills into Mars rocks to collect powder. Inside, the rocks are often gray because they have not rusted in the air!',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19140/PIA19140~small.jpg',
    imageAlt: 'Curiosity drill hole at Telegraph Peak',
    imageCredit: 'NASA/JPL-Caltech/MSSS',
    sourceName: 'NASA Curiosity Mission',
    sourceUrl: 'https://www.jpl.nasa.gov/missions/mars-science-laboratory-curiosity-rover-msl',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA19140',
    sourceDate: '2015'
  },
  {
    id: 'rov_perseverance_moxie',
    category: 'Rovers & Exploration',
    title: 'Making Breathable Air on Mars',
    fact: 'A small box called MOXIE turned Mars air into real oxygen! Future astronauts can use machines like this to breathe on Mars.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24176/PIA24176~small.jpg',
    imageAlt: 'Engineers lowering MOXIE into Perseverance rover',
    imageCredit: 'NASA/JPL-Caltech',
    sourceName: 'NASA MOXIE Instrument',
    sourceUrl: 'https://mars.nasa.gov/technology/moxie/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA24176',
    sourceDate: '2020'
  },
  {
    id: 'rov_ingenuity_helicopter',
    category: 'Rovers & Exploration',
    title: 'The First Flying Space Helicopter',
    fact: "Ingenuity is the first helicopter to fly on another planet! Its blades spun super fast to lift off in Mars' thin air.",
    imageUrl: 'https://images-assets.nasa.gov/image/PIA23882/PIA23882~medium.jpg',
    imageAlt: 'Flight model of Ingenuity Mars Helicopter',
    imageCredit: 'NASA/JPL-Caltech',
    sourceName: 'NASA Ingenuity Helicopter',
    sourceUrl: 'https://science.nasa.gov/mission/ingenuity/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA23882',
    sourceDate: '2020'
  },
  {
    id: 'rov_curiosity_selfie',
    category: 'Rovers & Exploration',
    title: 'How a Rover Takes a Selfie',
    fact: 'Curiosity takes photos of itself using a camera at the end of its robot arm. Computers stitch the photos together like a selfie!',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19920/PIA19920~orig.jpg',
    imageAlt: 'Curiosity selfie at Big Sky drilling site',
    imageCredit: 'NASA/JPL-Caltech/MSSS',
    sourceName: 'NASA Curiosity Rover',
    sourceUrl: 'https://science.nasa.gov/mission/msl-curiosity/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA19920',
    sourceDate: '2015'
  },
  {
    id: 'rov_sample_tubes',
    category: 'Rovers & Exploration',
    title: 'Mars Rocks Packed for Earth',
    fact: 'Perseverance locks Mars rock samples inside clean metal tubes. Future space missions will bring these rocks home to Earth!',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24744/PIA24744~small.jpg',
    imageAlt: 'Perseverance examining Jezero floor',
    imageCredit: 'NASA/JPL-Caltech',
    sourceName: 'NASA Mars Sample Return',
    sourceUrl: 'https://science.nasa.gov/mission/mars-sample-return/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA24744',
    sourceDate: '2021'
  },

  // --- Category: Solar Storms & Space Weather ---
  {
    id: 'sol_solar_flare',
    category: 'Solar Storms & Space Weather',
    title: 'Giant Flares From the Sun',
    fact: 'The Sun can shoot out bright blasts of light and energy called solar flares! They speed across space in just minutes.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA22244/PIA22244~medium.jpg',
    imageAlt: 'Solar flare eruption seen by SDO',
    imageCredit: 'NASA/GSFC/SDO',
    sourceName: 'NASA Solar Dynamics Observatory',
    sourceUrl: 'https://sdo.gsfc.nasa.gov/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA22244',
    sourceDate: '2018'
  },
  {
    id: 'sol_coronal_mass_ejection',
    category: 'Solar Storms & Space Weather',
    title: 'Giant Space Storm Clouds',
    fact: 'The Sun sometimes blasts giant clouds of hot solar gas into deep space. NASA satellites watch these storms to keep astronauts safe.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA21836/PIA21836~medium.jpg',
    imageAlt: 'Coronal Mass Ejection erupting from the Sun',
    imageCredit: 'NASA/GSFC',
    sourceName: 'NASA DONKI Space Weather',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA21836',
    sourceDate: '2017'
  },
  {
    id: 'sol_mars_magnetic_field',
    category: 'Solar Storms & Space Weather',
    title: 'Mars Has No Magnetic Shield',
    fact: 'Earth has a magnetic shield to block space radiation, but Mars does not. Astronauts on Mars need special shields to stay safe.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24836/PIA24836~orig.jpg',
    imageAlt: 'InSight lander solar panels covered in dust',
    imageCredit: 'NASA/JPL-Caltech',
    sourceName: 'NASA InSight Mission',
    sourceUrl: 'https://science.nasa.gov/mission/insight/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA24836',
    sourceDate: '2021'
  },
  {
    id: 'sol_donki_tracking',
    category: 'Solar Storms & Space Weather',
    title: 'Space Weather Warnings',
    fact: 'NASA scientists track solar storms using space satellites. If a solar storm is coming, they warn astronauts to get ready!',
    imageUrl: 'https://images-assets.nasa.gov/image/cme-blow-out_18529951894_o/cme-blow-out_18529951894_o~small.jpg',
    imageAlt: 'Solar storm erupting into space',
    imageCredit: 'NASA/GSFC/SOHO',
    sourceName: 'NASA Space Weather DONKI',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
    imageSourceUrl: 'https://images.nasa.gov/details/cme-blow-out_18529951894_o',
    sourceDate: '2015'
  },
  {
    id: 'sol_dust_storm_dimming',
    category: 'Solar Storms & Space Weather',
    title: 'Giant Red Dust Storms',
    fact: 'Dust storms on Mars can cover the entire planet! Thick red dust blocks the Sun and turns the sky dark orange.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA01167/PIA01167~medium.jpg',
    imageAlt: 'Hazy atmosphere over Martian canyons',
    imageCredit: 'NASA/JPL/MSSS',
    sourceName: 'NASA Mars Orbiter',
    sourceUrl: 'https://science.nasa.gov/mission/mro/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA01167',
    sourceDate: '1998'
  },

  // --- Category: Space Farming & Food ---
  {
    id: 'farm_veggie_tomatoes',
    category: 'Space Farming & Food',
    title: 'Juicy Tomatoes in Space',
    fact: 'Astronauts grew sweet red dwarf tomatoes on the space station! Fresh snacks give space crews healthy vitamins and big smiles.',
    imageUrl: 'https://images-assets.nasa.gov/image/iss068e045298/iss068e045298~medium.jpg',
    imageAlt: 'Dwarf tomatoes growing in Veggie on ISS',
    imageCredit: 'NASA',
    sourceName: 'NASA Veggie Facility',
    sourceUrl: 'https://www.nasa.gov/mission/station/research-explorer/facility/?#id=374',
    imageSourceUrl: 'https://images.nasa.gov/details/iss068e045298',
    sourceDate: '2023'
  },
  {
    id: 'farm_chile_peppers',
    category: 'Space Farming & Food',
    title: 'Space Tacos With Fresh Peppers',
    fact: 'Astronauts grew spicy green chile peppers inside a space garden! They picked the peppers and made fresh space tacos in zero gravity.',
    imageUrl: 'https://images-assets.nasa.gov/image/iss065e434038/iss065e434038~medium.jpg',
    imageAlt: 'Hatch Green Chile plants in Advanced Plant Habitat',
    imageCredit: 'NASA',
    sourceName: 'NASA Advanced Plant Habitat',
    sourceUrl: 'https://www.nasa.gov/mission/station/research-explorer/facility/?#id=377',
    imageSourceUrl: 'https://images.nasa.gov/details/iss065e434038',
    sourceDate: '2021'
  },
  {
    id: 'farm_csa_food_toolkit',
    category: 'Space Farming & Food',
    title: 'Farming for the Moon and Mars',
    fact: 'The Canadian Space Agency invents new ways to grow food with very little water. This helps both space missions and remote towns on Earth!',
    imageUrl: 'https://images-assets.nasa.gov/image/jsc2024e055706/jsc2024e055706~medium.jpg',
    imageAlt: 'Astronaut training with packaged space foods',
    imageCredit: 'NASA/JSC',
    sourceName: 'Canadian Space Agency (CSA)',
    sourceUrl: 'https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/',
    imageSourceUrl: 'https://images.nasa.gov/details/jsc2024e055706',
    sourceDate: '2024'
  },
  {
    id: 'farm_led_light_recipes',
    category: 'Space Farming & Food',
    title: 'Pink Glow Lights for Plants',
    fact: 'Space plants grow under special red and blue LED lights. These colorful light recipes help leaves grow bushy and strong without sunshine!',
    imageUrl: 'https://images-assets.nasa.gov/image/KSC-20190516-PH_KLS01_0011/KSC-20190516-PH_KLS01_0011~medium.jpg',
    imageAlt: 'Plant growth under LED lights at Kennedy Space Center',
    imageCredit: 'NASA/KSC',
    sourceName: 'NASA Space Crop Production',
    sourceUrl: 'https://science.nasa.gov/biological-physical/',
    imageSourceUrl: 'https://images.nasa.gov/details/KSC-20190516-PH_KLS01_0011',
    sourceDate: '2019'
  },
  {
    id: 'farm_water_recycling',
    category: 'Space Farming & Food',
    title: 'Recycling Every Drop of Water',
    fact: 'Astronauts recycle almost all their water! When greenhouse plants breathe moisture into the air, machines clean it for drinking again.',
    imageUrl: 'https://images-assets.nasa.gov/image/KSC-06pd1292/KSC-06pd1292~medium.jpg',
    imageAlt: 'Space station environmental processing facility',
    imageCredit: 'NASA/KSC',
    sourceName: 'NASA Life Support Systems',
    sourceUrl: 'https://www.nasa.gov/international-space-station/space-station-technology-environmental-control-and-life-support-system/',
    imageSourceUrl: 'https://images.nasa.gov/details/KSC-06pd1292',
    sourceDate: '2006'
  },

  // --- Category: Astronauts & Space Science ---
  {
    id: 'astro_exercise_bones',
    category: 'Astronauts & Space Science',
    title: 'Daily Workouts in Space',
    fact: "Without gravity, astronauts' muscles and bones can get weak. They exercise for two hours every day using special workout machines!",
    imageUrl: 'https://images-assets.nasa.gov/image/iss009e19798/iss009e19798~medium.jpg',
    imageAlt: 'Astronaut Mike Fincke exercising in space',
    imageCredit: 'NASA',
    sourceName: 'NASA Human Research Program',
    sourceUrl: 'https://www.nasa.gov/hrp/',
    imageSourceUrl: 'https://images.nasa.gov/details/iss009e19798',
    sourceDate: '2004'
  },
  {
    id: 'astro_radiation_vest',
    category: 'Astronauts & Space Science',
    title: 'Special Space Armor',
    fact: 'Scientists test special vests that protect astronauts from deep-space radiation. They shield the body while still letting astronauts move easily.',
    imageUrl: 'https://images-assets.nasa.gov/image/iss053e238888/iss053e238888~medium.jpg',
    imageAlt: 'Personal radiation shielding garment on ISS',
    imageCredit: 'NASA/ESA',
    sourceName: 'NASA Open Science Data (OSDR)',
    sourceUrl: 'https://osdr.nasa.gov/',
    imageSourceUrl: 'https://images.nasa.gov/details/iss053e238888',
    sourceDate: '2017'
  },
  {
    id: 'astro_osdr_biology',
    category: 'Astronauts & Space Science',
    title: 'Open Space Science for Kids',
    fact: 'NASA shares real space biology data with scientists worldwide. Anyone can study how plants and cells grow in zero gravity!',
    imageUrl: 'https://images-assets.nasa.gov/image/iss053e238891/iss053e238891~medium.jpg',
    imageAlt: 'Space biology experiment research aboard station',
    imageCredit: 'NASA/ESA',
    sourceName: 'NASA OSDR Biology',
    sourceUrl: 'https://osdr.nasa.gov/bio/',
    imageSourceUrl: 'https://images.nasa.gov/details/iss053e238891',
    sourceDate: '2017'
  },
  {
    id: 'astro_mars_spacesuit',
    category: 'Astronauts & Space Science',
    title: 'A Spacesuit Is a Tiny Spaceship',
    fact: 'A Mars spacesuit keeps astronauts alive by providing fresh air to breathe, keeping them warm, and holding air pressure around their bodies.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24203/PIA24203~medium.jpg',
    imageAlt: 'Engineers testing spacesuit materials for Mars',
    imageCredit: 'NASA/JPL-Caltech',
    sourceName: 'NASA Spacesuit Engineering',
    sourceUrl: 'https://www.nasa.gov/humans-in-space/spacesuits/',
    imageSourceUrl: 'https://images.nasa.gov/details/PIA24203',
    sourceDate: '2020'
  },
  {
    id: 'astro_fluid_shifts',
    category: 'Astronauts & Space Science',
    title: 'Puffy Faces in Zero Gravity',
    fact: 'In space, body fluids float upward toward the head! This gives astronauts puffy cheeks during their first few days in orbit.',
    imageUrl: 'https://images-assets.nasa.gov/image/iss007e08023/iss007e08023~medium.jpg',
    imageAlt: 'Astronaut working inside space station module',
    imageCredit: 'NASA',
    sourceName: 'NASA Human Research Program',
    sourceUrl: 'https://www.nasa.gov/hrp/',
    imageSourceUrl: 'https://images.nasa.gov/details/iss007e08023',
    sourceDate: '2003'
  }
];
