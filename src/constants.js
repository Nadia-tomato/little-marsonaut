// Module 1: Game Constants & Catalogs
// [Module 1: Game Constants & Elementary-Friendly English Text]
    // =========================================================================
    const MAX_TOMATO_GROWTH = 10;
    const IS_LOCAL_TEST_HOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const TEST_CLOCK_SECONDS = IS_LOCAL_TEST_HOST
      ? Math.max(0, Number(new URLSearchParams(window.location.search).get('testClock')) || 0)
      : 0;
    const DAY_DURATION_SECONDS = TEST_CLOCK_SECONDS || 100; // 1 Sol = 100s (1:40)
    const TOMATO_HARVEST_FOOD_GAIN = 24;
    const ROVER_POWER_PER_BAR = 10;
    const OUR_ROVER_NAME = 'Curiosity Jr.'; // Named after NASA's Curiosity Rover!

    const INITIAL_RESOURCES = {
      oxygen: 70,
      power: 70,
      water: 100,
      food: 60,
    };

    // Elementary-school friendly explanations triggered by Big Question Mark (?) buttons
    // Includes real space photos + NASA deep-space tomato experiment link!
    const SCIENCE_EXPLANATIONS = {
      SOLAR_POWER: {
        icon: '☀️',
        title: 'How Do Solar Panels Work on Mars?',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA24836/PIA24836~orig.jpg',
        photoCaption: 'Real NASA Photo: Mars InSight Lander’s solar panels covered in fine red Martian dust.',
        body: 'Solar panels catch sunlight and turn it into electricity for our base! By moving the solar panel, we tilt its angle to face the sun directly and catch the most light. As days go by on Mars, fine red dust settles on the panels, so they make a little less power each day!',
        funTip: 'Tip: In a dust storm, thick clouds of sand block the sun, so we get less power!',
      },
      OXYGEN_ELECTROLYSIS: {
        icon: '🫧',
        title: 'Making Oxygen From Water & Mars Air!',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA24533/PIA24533~orig.jpg',
        photoCaption: 'Real NASA Photo: Technicians installing the golden MOXIE oxygen-making box inside the Perseverance rover!',
        body: 'Mars has almost no oxygen to breathe! In our Power Lab, we use electricity to split water into hydrogen gas and oxygen gas. NASA also tested a real golden box on Mars called MOXIE that makes breathable oxygen right out of the Martian air!',
        funTip: 'Science Word: Splitting water with electricity is called "Electrolysis"!',
      },
      TOMATO_GROWTH: {
        icon: '🍅',
        title: 'Real Space Tomatoes & Grow Lights!',
        photoUrl: 'https://images-assets.nasa.gov/image/iss068e025551/iss068e025551~medium.jpg',
        fallbackPhotoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/ISS-68_Red_Robin_dwarf_tomato_plants_in_the_Veggie_facility.jpg/800px-ISS-68_Red_Robin_dwarf_tomato_plants_in_the_Veggie_facility.jpg',
        photoCaption: 'Real Fact: Astronauts really grow dwarf tomatoes in space aboard the International Space Station under special LED grow lights!',
        linkUrl: 'https://science.nasa.gov/science-research/biological-physical-sciences/three-experiments-heading-to-space-station-aim-to-support-deep-space-missions/?utm_source=chatgpt.com',
        linkLabel: '🔗 Read NASA Article: Growing Space Tomatoes for Deep Space Missions',
        body: 'Astronauts really grow tomatoes in space! Mars is super freezing at night (down to -80°C!), and sunlight is weaker than on Earth. Turning on bright grow lamps and heaters gives our tomato plants the light and warmth they need to grow big and red!',
        funTip: 'Remember: Plants need both warm light AND water to grow fast!',
      },
      CURIOSITY_ROVER: {
        icon: '🛸',
        title: `About NASA's Curiosity & Our Rover "${OUR_ROVER_NAME}"!`,
        photoUrl: "Curiosity_Self-Portrait_at_'Big_Sky'_Drilling_Site.jpg",
        fallbackPhotoUrl: 'https://images-assets.nasa.gov/image/PIA19920/PIA19920~orig.jpg',
        photoCaption: 'Real NASA Photo: Curiosity Rover self-portrait at the "Big Sky" drilling site in Gale Crater on Mars!',
        body: `NASA's real Curiosity rover is a car-sized robot exploring Gale Crater on Mars since 2012! It has 6 wheels, a laser camera head, and a robot arm drill to study rocks and look for signs of ancient water. We named our base rover "${OUR_ROVER_NAME}" because it follows in Curiosity's tracks to explore Mars!`,
        funTip: `Give "${OUR_ROVER_NAME}" more battery power to drive farther and find rarer rocks!`,
      },
    };

    // Rotating Mars facts so every rocket flight shows a different fact!
    const MARS_FACTS = [
      'Did you know? Mars has two small moons shaped like potatoes: Phobos and Deimos!',
      'A day on Mars (called a "Sol") is 24 hours and 39 minutes—just a little longer than a day on Earth!',
      'Mars looks bright red because its dirt and rocks are covered in rusty iron dust!',
      'Mars has the biggest volcano in our solar system: Olympus Mons! It is three times taller than Mount Everest.',
      'Gravity on Mars is much weaker than on Earth. You could jump almost three times higher on Mars!',
      'Mars has a giant canyon called Valles Marineris that is as long as the entire United States!',
      'Billions of years ago, Mars had warm rivers, lakes, and maybe even a big ocean!',
      'Sunsets on Mars look blue instead of orange because fine red dust scatters the sunlight!',
    ];

    // Updated Rover trip durations: 10 ⚡ = 70s, 20 ⚡ = 100s, 30 ⚡ = 130s
    const ROVER_DISPATCH_MODES = {
      1: {
        barsCost: 1,
        durationSeconds: 70,
        name: 'Short Walk (10 ⚡ • 70s)',
        desc: 'Quick 70-second trip outside the garage door. Saves power, fewer rare rocks.',
        discoveryMultiplier: 0.6,
        rareBonus: 0.5,
      },
      2: {
        barsCost: 2,
        durationSeconds: 100,
        name: 'Crater Trip (20 ⚡ • 100s)',
        desc: 'Medium 100-second drive to a nearby crater. Good chance to find cool rocks!',
        discoveryMultiplier: 1.0,
        rareBonus: 1.0,
      },
      3: {
        barsCost: 3,
        durationSeconds: 130,
        name: 'Far Riverbed Dig (30 ⚡ • 130s)',
        desc: 'Long 130-second trip far away to an old riverbed. Best chance for rare gems!',
        discoveryMultiplier: 1.35,
        rareBonus: 1.8,
      },
    };

    const SAMPLE_CATALOG = [
      {
        id: 'BASALT',
        name: 'Black Lava Rock (Basalt)',
        points: 10,
        baseProbability: 30,
        isRare: false,
        variations: [
          'This dark rock has tiny holes from gas bubbles. Mars used to have big volcanoes!',
          'A hard black rock made from cooled lava (melted rock from a volcano).',
          'Strong Mars winds blew sand against this rock and made it super smooth.',
        ],
        scientificNote: 'Fun Fact: Basalt is dark rock made when hot volcano lava cools down.',
      },
      {
        id: 'IRON_OXIDE',
        name: 'Red Rusty Rock',
        points: 15,
        baseProbability: 15,
        isRare: false,
        variations: [
          'Red rust dust covers this rock. That is why Mars looks like the Red Planet!',
          'Full of tiny iron balls that turned red from sunlight and old water.',
          'This rusty rock shows that Mars dirt has lots of iron (a metal) inside.',
        ],
        scientificNote: 'Fun Fact: Iron turns red like rust when it touches water and oxygen.',
      },
      {
        id: 'HYDRATED',
        name: 'Water-Drop Crystal Rock',
        points: 30,
        baseProbability: 9,
        isRare: true,
        variations: [
          'Awesome! Tiny drops of water are trapped inside. Mars once had big lakes!',
          'This white rock formed when underground water flowed through the dirt.',
          'Our scanner found water inside this crystal—a warm pond was once here!',
        ],
        scientificNote: 'Fun Fact: Water crystals help scientists find where lakes used to be on Mars.',
      },
      {
        id: 'SPECIAL_GEO',
        name: 'Layer-Cake Magnet Stone',
        points: 25,
        baseProbability: 15,
        isRare: true,
        variations: [
          'Striped like a layer cake! Old rivers stacked mud and sand in neat layers.',
          'This rock acts like a weak magnet from when Mars was a young planet.',
          'Dried mud cracks on this stone show Mars once had rainy days and sunny days.',
        ],
        scientificNote: 'Fun Fact: Rock layers are like pages in a storybook about Mars weather.',
      },
      {
        id: 'ANCIENT_BIOSIGNATURE',
        name: 'Mystery Life-Clue Stone',
        points: 999,
        baseProbability: 1,
        isRare: true,
        variations: [
          'Super discovery! Tiny swirls and special carbon clues found—let us send this to Earth!',
        ],
        scientificNote: 'Special Win: You found a huge clue! Real NASA rovers are still looking for this.',
      },
      {
        id: 'NONE',
        name: 'No Rock Found',
        points: 0,
        baseProbability: 30,
        isRare: false,
        variations: [
          'Only soft sand here! The robot arm could not grab a solid rock.',
          'Thick dust covered the ground so the drill could not reach hard rock.',
          'The rock was too soft and turned into dust when the rover grabbed it.',
        ],
        scientificNote: 'Tip: Give Curiosity Jr. 20 or 30 Power to drive farther and find more rocks!',
      },
    ];

    const HISTORICAL_MARS_WEATHER = [
      { tempMax: -9,  tempMin: -68, windSpeedMs: 4.1 },
      { tempMax: -12, tempMin: -72, windSpeedMs: 5.2 },
      { tempMax: -16, tempMin: -77, windSpeedMs: 6.8 },
      { tempMax: -19, tempMin: -80, windSpeedMs: 7.1 },
      { tempMax: -24, tempMin: -86, windSpeedMs: 8.9 },
      { tempMax: -27, tempMin: -89, windSpeedMs: 9.4 },
    ];

    const RADIATION_LABELS = {
      1: { text: 'Very Safe', color: 'bg-emerald-500', advice: 'Calm sun rays—great day to send Curiosity Jr. out!' },
      2: { text: 'Safe', color: 'bg-green-500', advice: 'Good space weather for exploring outside!' },
      3: { text: 'Medium', color: 'bg-amber-500', advice: 'Sun rays (radiation) are a bit strong today.' },
      4: { text: 'High', color: 'bg-orange-500', advice: 'Strong sun rays (radiation) might hurt the rover!' },
      5: { text: 'Danger', color: 'bg-red-500', advice: 'Huge sun storm! Keep the rover safe inside the garage.' },
    };

    // =========================================================================
