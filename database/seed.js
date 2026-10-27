/**
 * Database Seed Script for Tourist Attraction Information Service Portal
 * Pre-populates the SQLite database with rich, realistic tourist attractions
 * across India, highlighting Telangana and prominent national destinations.
 */

const { getDb, initDb } = require('./database');

const sampleDestinations = [
  {
    name: "Charminar",
    description: "Built in 1591 by Muhammad Quli Qutb Shah, the Charminar is a monumental grand mosque and the iconic global landmark of Hyderabad. Its four magnificent minarets soar over the historic Old City and bustling bazaars filled with pearls, lac bangles, and fragrant spices.",
    city: "Hyderabad",
    state: "Telangana",
    address: "Char Kaman, Ghansi Bazaar, Hyderabad, Telangana 500002",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:30 AM – 05:30 PM (Please verify before visiting)",
    entry_fee: "₹25 for Indian citizens, ₹300 for Foreign tourists (Please verify before visiting)",
    best_time_to_visit: "October to March",
    recommended_duration: "1 to 2 hours",
    facilities: JSON.stringify(["Drinking Water", "Restrooms", "Street Food Market", "Souvenir Stalls", "Local Guides"]),
    accessibility: "Ground level accessible around monument; upper gallery reached via 149 spiral stone steps.",
    travel_tips: "Visit during early morning hours to beat market traffic. Savor authentic Irani chai and Osmania biscuits at the adjacent Nimrah Cafe.",
    nearby_attractions: "Laad Bazaar, Chowmahalla Palace, Mecca Masjid, Salar Jung Museum",
    latitude: 17.3616,
    longitude: 78.4747
  },
  {
    name: "Golconda Fort",
    description: "A colossal medieval citadel perched on a granite hill, Golconda was the capital of the Qutb Shahi kingdom and the epicenter of the historic diamond trade that produced the Koh-i-Noor and Hope diamonds. Known worldwide for ingenious acoustic engineering and majestic battlements.",
    city: "Hyderabad",
    state: "Telangana",
    address: "Ibrahim Bagh, Hyderabad, Telangana 500008",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:00 AM – 05:30 PM (Evening Sound & Light show timings vary; please verify before visiting)",
    entry_fee: "₹25 for Indian citizens, ₹300 for Foreign tourists (Sound & Light show separate; please verify before visiting)",
    best_time_to_visit: "September to March",
    recommended_duration: "3 to 4 hours",
    facilities: JSON.stringify(["Vehicle Parking", "Audio Guides", "Guided Tours", "Restrooms", "Drinking Water", "Cafeteria"]),
    accessibility: "Entrance and lower courtyards paved; ascending to the Bala Hissar royal palace requires climbing stone stairways.",
    travel_tips: "Wear comfortable walking shoes with good grip and carry plenty of drinking water. Experience the acoustic clap at Fateh Darwaza that echoes at the top citadel.",
    nearby_attractions: "Qutb Shahi Tombs, Taramati Baradari, Durgam Cheruvu Lake & Cable Bridge",
    latitude: 17.3833,
    longitude: 78.4011
  },
  {
    name: "Ramoji Film City",
    description: "Certified by Guinness World Records as the world's largest integrated film studio complex covering over 2,000 acres. Offers immersive cinema sets, live stunt shows, thematic amusement rides, eco gardens, and vibrant entertainment suitable for all ages.",
    city: "Hyderabad",
    state: "Telangana",
    address: "Anaspur Village, Hayathnagar Mandal, Hyderabad, Telangana 501512",
    category: "Adventure Destinations",
    image_url: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:00 AM – 05:30 PM (Daily; please verify before visiting)",
    entry_fee: "Approx. ₹1350 for Adults, ₹1150 for Children (Custom packages available; please verify before visiting)",
    best_time_to_visit: "October to February",
    recommended_duration: "Full Day (6 to 8 hours)",
    facilities: JSON.stringify(["Ample Parking", "Theme Dining", "Guided Vintage Buses", "Wheelchair Support", "Restrooms", "ATMs", "Luxury Resorts"]),
    accessibility: "Wheelchair assistance available at entrance; studio tour buses accommodate accessible boarding.",
    travel_tips: "Book admission tickets online in advance to skip queue counters. Arrive promptly at opening time to catch all scheduled live stunt shows.",
    nearby_attractions: "Sanghi Temple, Mount Opera Water Park",
    latitude: 17.2543,
    longitude: 78.6808
  },
  {
    name: "Thousand Pillar Temple",
    description: "A masterpiece of Kakatiya architectural excellence constructed in 1163 AD by King Rudra Deva. Dedicated to Lord Shiva, Vishnu, and Surya (Trikuta), the temple is famed for intricately carved star-shaped pillars and a monolithic polished basalt Nandi sculpture.",
    city: "Hanamkonda",
    state: "Telangana",
    address: "Raganna Darwaja, Hanamkonda, Telangana 506001",
    category: "Temples and Religious Places",
    image_url: "https://images.unsplash.com/photo-1621644869818-cb15714fef65?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1621644869818-cb15714fef65?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "06:00 AM – 08:00 PM (Daily; please verify before visiting)",
    entry_fee: "Free admission (Camera fee may apply; please verify before visiting)",
    best_time_to_visit: "October to March",
    recommended_duration: "1 to 2 hours",
    facilities: JSON.stringify(["Footwear Stand", "Drinking Water", "Landscaped Gardens", "Parking Nearby"]),
    accessibility: "Surrounding garden and temple courtyard feature flat stone pathways; temple plinth requires stepped entry.",
    travel_tips: "Maintain reverence and observe temple dress guidelines. The morning puja offers a peaceful, spiritually uplifting atmosphere.",
    nearby_attractions: "Warangal Fort, Bhadrakali Temple, Kakatiya Musical Garden, Kazipet Dargah",
    latitude: 17.9942,
    longitude: 79.5762
  },
  {
    name: "Ramappa Temple",
    description: "Recognized as a prestigious UNESCO World Heritage Site, this 13th-century Kakatiya architectural marvel is also named Rudreshwara Temple. Engineered with lightweight floating bricks, sandbox foundation technology, and breathtaking dancing figurine brackets carved from hard dolerite.",
    city: "Palampet",
    state: "Telangana",
    address: "Palampet, Venkatapur Mandal, Mulugu District, Telangana 506345",
    category: "Temples and Religious Places",
    image_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "06:00 AM – 06:00 PM (Daily; please verify before visiting)",
    entry_fee: "Free admission / Nominal ASI fee (Please verify before visiting)",
    best_time_to_visit: "October to March",
    recommended_duration: "2 to 3 hours",
    facilities: JSON.stringify(["ASI Information Desk", "Vehicle Parking", "Restrooms", "Garden Pathways"]),
    accessibility: "Level walkways across the outer compound leading up to the raised stone plinth.",
    travel_tips: "Inspect the temple spire constructed with unique spongy bricks that float on water. Combine your trip with a relaxing visit to nearby Ramappa Lake.",
    nearby_attractions: "Ramappa Lake, Laknavaram Cheruvu Lake & Ropeway, Bogatha Waterfalls",
    latitude: 18.2604,
    longitude: 79.9431
  },
  {
    name: "Nagarjuna Sagar Dam",
    description: "One of the earliest and largest masonry dams built in independent India across the mighty Krishna River. The majestic reservoir straddles Telangana and Andhra Pradesh, framing scenic hills, island archaeological discoveries, and thrilling boat cruises to Nagarjunakonda.",
    city: "Nalgonda",
    state: "Telangana",
    address: "Nagarjuna Sagar Dam, Nalgonda District, Telangana 508202",
    category: "Lakes and Natural Attractions",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:00 AM – 05:00 PM (Ferry service schedules depend on reservoir weather; please verify before visiting)",
    entry_fee: "Dam viewpoint free; Launch ferry & Nagarjunakonda Museum approx. ₹150 (Please verify before visiting)",
    best_time_to_visit: "August to February (Monsoon opening of crest gates is spectacular)",
    recommended_duration: "4 to 6 hours",
    facilities: JSON.stringify(["Boat Launch Jetty", "Scenic Viewpoint Towers", "Tourism Restaurant", "Restrooms", "Parking"]),
    accessibility: "Dam viewpoint road is accessible by car; island ferry boarding requires negotiating steps on jetty.",
    travel_tips: "Check water discharge schedules during peak monsoon when 26 crest gates are opened in breathtaking roaring cascades.",
    nearby_attractions: "Ethipothala Waterfalls, Nagarjunakonda Buddhist Island, Nagarjunasagar Wildlife Sanctuary",
    latitude: 16.5772,
    longitude: 79.3134
  },
  {
    name: "Tirumala Venkateswara Temple",
    description: "One of the most visited and revered Hindu pilgrimage destinations in the world, dedicated to Lord Sri Venkateswara (an incarnation of Vishnu). Situated on the picturesque Seven Hills of the Seshachalam range with centuries of spiritual tradition.",
    city: "Tirupati",
    state: "Andhra Pradesh",
    address: "S Mada St, Tirumala, Tirupati, Andhra Pradesh 517504",
    category: "Temples and Religious Places",
    image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "03:00 AM – 11:30 PM (Varies per seva & darshan calendar; please verify before visiting)",
    entry_fee: "Sarva Darshan is Free; Special Entry Darshan ₹300 (Advance online booking required; please verify before visiting)",
    best_time_to_visit: "September to February",
    recommended_duration: "4 to 8 hours (Darshan queue dependent)",
    facilities: JSON.stringify(["Free Annaprasadam", "Luggage Cloakrooms", "Medical Stations", "Battery Carts", "Restrooms", "Famous Laddu Counters"]),
    accessibility: "Dedicated queue lines and assistance are provided for senior citizens and physically challenged pilgrims.",
    travel_tips: "Book Special Entry Darshan (SED) slots well in advance on the official TTD portal. Observe strictly mandatory traditional dress codes (dhoti/kurta for men, saree/chudidar with dupatta for women).",
    nearby_attractions: "Kapila Theertham, Sri Padmavathi Ammavari Temple, Silathoranam Natural Rock Arch",
    latitude: 13.6833,
    longitude: 79.3472
  },
  {
    name: "Taj Mahal",
    description: "An epitome of eternal love and universally admired masterpiece of Mughal architecture. Built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal on the southern bank of the Yamuna River, featuring translucent white marble, calligraphy, and pietra dura inlays.",
    city: "Agra",
    state: "Uttar Pradesh",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "30 minutes before sunrise until 30 minutes before sunset (Closed on Fridays; please verify before visiting)",
    entry_fee: "₹50 for Indian citizens, ₹1100 for Foreign tourists + ₹200 for main mausoleum (Please verify before visiting)",
    best_time_to_visit: "October to March",
    recommended_duration: "2 to 3 hours",
    facilities: JSON.stringify(["Battery Shuttle Carts", "Shoe Covers Included", "Official Audio Guides", "Restrooms", "Drinking Water Stations"]),
    accessibility: "Paved ramps provide access through the Charbagh gardens; golf cart shuttles connect outer parking to the main gates.",
    travel_tips: "Sunrise offers ethereal diffused morning light and the lowest crowd density. Strict security applies: tripods, smoking materials, and food items are prohibited inside.",
    nearby_attractions: "Agra Fort, Mehtab Bagh, Fatehpur Sikri, Tomb of I'timād-ud-Daulah",
    latitude: 27.1751,
    longitude: 78.0421
  },
  {
    name: "Red Fort (Lal Qila)",
    description: "The historic seat of Mughal imperial power in Old Delhi, erected by Shah Jahan in 1639. Built with formidable octagonal red sandstone ramparts, it encloses ornate palaces, Diwan-i-Aam, Diwan-i-Khas, and gardens that have witnessed pivotal moments of Indian history.",
    city: "Delhi",
    state: "Delhi",
    address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi 110006",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:30 AM – 04:30 PM (Closed on Mondays; please verify before visiting)",
    entry_fee: "₹35 for Indian citizens, ₹500 for Foreign tourists (Museum tickets extra; please verify before visiting)",
    best_time_to_visit: "October to March",
    recommended_duration: "2 to 3 hours",
    facilities: JSON.stringify(["Cloakrooms", "Archaeological Museums", "Restrooms", "Drinking Water", "Cafeteria"]),
    accessibility: "Broad paved pathways across the central complex; wheelchairs available upon request at the Lahori Gate.",
    travel_tips: "Take the Delhi Metro (Lal Qila or Chandni Chowk stations) to comfortably bypass road traffic. Explore the bustling street food alleys of Chandni Chowk nearby.",
    nearby_attractions: "Jama Masjid, Chandni Chowk Bazaar, Raj Ghat, Gurudwara Sis Ganj Sahib",
    latitude: 28.6562,
    longitude: 77.2410
  },
  {
    name: "Hawa Mahal (Palace of Winds)",
    description: "Jaipur's most distinctive signature landmark, built in 1799 by Maharaja Sawai Pratap Singh. Featuring a five-story honeycomb façade crafted from pink and red sandstone with 953 jharokhas (casements) engineered to circulate cool breeze throughout the royal chambers.",
    city: "Jaipur",
    state: "Rajasthan",
    address: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:00 AM – 05:00 PM (Daily; please verify before visiting)",
    entry_fee: "₹50 for Indian citizens, ₹200 for Foreign tourists (Composite Jaipur pass available; please verify before visiting)",
    best_time_to_visit: "October to March",
    recommended_duration: "1 to 2 hours",
    facilities: JSON.stringify(["Onsite Museum", "Restrooms", "Ramp Walkways", "Heritage Bazaars Outside"]),
    accessibility: "The upper floors are connected by ramps rather than stairs, built originally for palanquins, though inclines are steep.",
    travel_tips: "Best exterior photos are taken from the rooftop cafes directly across the avenue in the morning sun.",
    nearby_attractions: "City Palace Jaipur, Jantar Mantar Observatory, Albert Hall Museum, Johari Bazaar",
    latitude: 26.9239,
    longitude: 75.8267
  },
  {
    name: "Gateway of India",
    description: "An iconic 26-meter basalt arch monument erected to commemorate the 1911 landing of King George V and Queen Mary in Bombay. Overlooking the Arabian Sea in vibrant Colaba, it serves as the launching point for ferries to the UNESCO Elephanta Caves.",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "Open 24 Hours (Promenade accessible all day; please verify security guidelines)",
    entry_fee: "Free public access (Ferries to Elephanta Caves cost approx. ₹260 return; please verify before visiting)",
    best_time_to_visit: "November to February",
    recommended_duration: "1 to 2 hours",
    facilities: JSON.stringify(["Sea-facing Promenade", "Elephanta Ferry Pier", "Street Food Vendors", "Photography Services"]),
    accessibility: "Step-free, flat paved public plaza with smooth waterfront access for wheelchairs and strollers.",
    travel_tips: "Visit during the late golden hour when sea breezes cool the promenade and the sunset reflects on the historic Taj Mahal Palace Hotel.",
    nearby_attractions: "The Taj Mahal Palace Hotel, Colaba Causeway Street Market, Marine Drive, Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    latitude: 18.9220,
    longitude: 72.8347
  },
  {
    name: "Mysore Palace (Amba Vilas)",
    description: "The official residence of the Wadiyar dynasty, Mysore Palace is among India's most opulent royal palaces. Designed in the Indo-Saracenic style with domes, arches, stained glass ceilings, ornate carved rosewood doors, and a jewel-encrusted golden throne.",
    city: "Mysuru",
    state: "Karnataka",
    address: "Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysuru, Karnataka 570001",
    category: "Historical Monuments",
    image_url: "https://images.unsplash.com/photo-1600100397608-f010f443b35d?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1600100397608-f010f443b35d?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "10:00 AM – 05:30 PM (Grand illumination on Sundays and public holidays 07:00 PM – 07:45 PM; please verify before visiting)",
    entry_fee: "₹100 for Adults, ₹50 for Children (Audio guide extra; please verify before visiting)",
    best_time_to_visit: "October to March (Renowned Dasara festivities in autumn)",
    recommended_duration: "2 to 3 hours",
    facilities: JSON.stringify(["Footwear Deposit Counter", "Battery Buggies", "Audio Guides", "Restrooms", "Souvenir Outlets", "Cloakrooms"]),
    accessibility: "Electric carts are available for seniors across the expansive palace grounds; ramp access inside ground palace sections.",
    travel_tips: "Footwear must be deposited before entering the interior palace halls. Do not miss the Sunday evening lighting when nearly 100,000 electric bulbs illuminate the palace.",
    nearby_attractions: "Chamundi Hills, Brindavan Gardens, Sri Chamarajendra Zoological Gardens, St. Philomena's Cathedral",
    latitude: 12.3052,
    longitude: 76.6552
  },
  {
    name: "Goa Beaches (Calangute & Baga)",
    description: "World-famous golden sand beaches along the Arabian Sea in North Goa. Calangute and Baga offer vibrant sun-drenched coastal scenery, thrilling water sports like parasailing and jet skiing, beach shacks serving fresh seafood, and lively beachfront nightlife.",
    city: "North Goa",
    state: "Goa",
    address: "Calangute Beach Promenade, Bardez, North Goa 403516",
    category: "Beaches",
    image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "Accessible 24 Hours (Water sports typically operate 09:00 AM – 06:00 PM; please verify before visiting)",
    entry_fee: "Free public access (Water sports & beach loungers charged by individual operators; please verify before visiting)",
    best_time_to_visit: "November to March",
    recommended_duration: "1 to 2 days",
    facilities: JSON.stringify(["Beach Shacks & Cafes", "Registered Water Sports", "Lifeguard Patrol Stations", "Shower & Change Cabins", "Parking Areas"]),
    accessibility: "Beach approach roads and shacks have level access; manual assistance needed on soft sandy stretches.",
    travel_tips: "Always swim within lifeguard-monitored red and yellow flags. Insist on certified life jackets before undertaking parasailing or speed boat rides.",
    nearby_attractions: "Aguada Fort & Lighthouse, Anjuna Flea Market, Chapora Fort, Baga Nightlife Strip",
    latitude: 15.5439,
    longitude: 73.7553
  },
  {
    name: "Ooty Hill Station (Udhagamandalam)",
    description: "Known affectionately as the Queen of Hill Stations in the Nilgiri Mountains at an elevation of 2,240 meters. Features sprawling emerald tea estates, aromatic eucalyptus groves, serene lakes, colonial cottages, and the historic Nilgiri Mountain Railway toy train.",
    city: "Nilgiris",
    state: "Tamil Nadu",
    address: "Nilgiris District, Ooty, Tamil Nadu 643001",
    category: "Hill Stations",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "Town attractions generally open 09:00 AM – 06:00 PM (Please verify before visiting)",
    entry_fee: "Attraction-specific (Botanical Garden approx. ₹40, Boating approx. ₹150; please verify before visiting)",
    best_time_to_visit: "October to June (Pleasant weather throughout summer and crisp winters)",
    recommended_duration: "2 to 3 days",
    facilities: JSON.stringify(["Heritage Toy Train Station", "Botanical Gardens", "Boathouses", "Tea Factory Museums", "Hotels & Mountain Lodges"]),
    accessibility: "Botanical gardens and lake promenades feature paved walking paths; historic toy train platforms have step access.",
    travel_tips: "Book tickets for the UNESCO Nilgiri Mountain Toy Train in advance via IRCTC for unforgettable mountain viaduct views. Carry warm woolen clothing in winter.",
    nearby_attractions: "Doddabetta Peak, Pykara Falls and Lake, Avalanche Lake, Government Rose Garden",
    latitude: 11.4102,
    longitude: 76.6950
  },
  {
    name: "Araku Valley",
    description: "An enchanting, mist-clad hill retreat in the Eastern Ghats inhabited by indigenous tribes. Renowned for lush aromatic coffee plantations, emerald valleys, the subterranean limestone formations of Borra Caves, cascading waterfalls, and tribal folklore.",
    city: "Visakhapatnam Region",
    state: "Andhra Pradesh",
    address: "Eastern Ghats, Alluri Sitharama Raju District, Andhra Pradesh 531149",
    category: "Hill Stations",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "Natural valley accessible 24 hours (Borra Caves open 09:00 AM – 05:00 PM; please verify before visiting)",
    entry_fee: "Free valley access; Borra Caves ticket approx. ₹80 for Adults (Please verify before visiting)",
    best_time_to_visit: "September to March",
    recommended_duration: "1 to 2 days",
    facilities: JSON.stringify(["Vistadome Glass-Roof Train", "Coffee Museums", "Tribal Culture Museum", "Haritha Hill Resorts", "Restrooms"]),
    accessibility: "Coffee museum and tribal heritage center are easily accessible; exploring deep inside Borra Caves requires steep staircase descents.",
    travel_tips: "Experience the glass-roof Vistadome train ride from Visakhapatnam through mountain tunnels. Don't leave without tasting authentic Araku organic coffee and traditional bamboo chicken.",
    nearby_attractions: "Borra Caves, Chaparai Water Cascades, Katiki Waterfalls, Padmapuram Botanical Gardens",
    latitude: 18.3273,
    longitude: 82.8775
  },
  {
    name: "Kerala Backwaters (Alleppey)",
    description: "A magical tranquil network of interlocking lagoons, serene lakes, canals, and palm-fringed inlets parallel to the Arabian Sea coast. Celebrated as the Venice of the East, famed for traditional kettuvallam houseboats gliding gently through pastoral paddy landscapes.",
    city: "Alappuzha",
    state: "Kerala",
    address: "Finishing Point Jetty, Punnamada, Alappuzha, Kerala 688013",
    category: "Lakes and Natural Attractions",
    image_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "Houseboat check-in typically 12:00 PM, checkout 09:00 AM; Day shikara boats 06:00 AM – 06:00 PM (Please verify before visiting)",
    entry_fee: "Day Shikara approx. ₹800/hr; Overnight deluxe houseboats ₹7,000–₹16,000 depending on season (Please verify before visiting)",
    best_time_to_visit: "September to March",
    recommended_duration: "1 to 2 days",
    facilities: JSON.stringify(["Houseboat Docks", "Tourist Information Desks", "Ayurvedic Wellness Centers", "Waterfront Homestays", "Catering Staff"]),
    accessibility: "Boat embarkation points have wooden gangplanks; staff assist guests during boarding.",
    travel_tips: "Opt for government-certified green-palm eco houseboats. Savor traditional Kerala sadya lunch and freshly caught Karimeen fish prepared on board.",
    nearby_attractions: "Marari Beach, Vembanad Lake, Pathiramanal Bird Island, Krishnapuram Palace",
    latitude: 9.4981,
    longitude: 76.3388
  },
  {
    name: "Bogatha Waterfalls",
    description: "Commonly known as the Niagara of Telangana, Bogatha Waterfall is a spectacular wide cascade located in the dense forests of Mulugu district on the Cheekupally stream. A breathtaking nature escape popular for picnics, trekking, and refreshing vistas.",
    city: "Koyaveerapuram / Mulugu",
    state: "Telangana",
    address: "Koyaveerapuram, Wazeedu Mandal, Mulugu District, Telangana 507136",
    category: "Waterfalls",
    image_url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "09:00 AM – 05:00 PM (Daily; strictly prohibited after dusk; please verify before visiting)",
    entry_fee: "Nominal forest entry approx. ₹30 per adult, parking extra (Please verify before visiting)",
    best_time_to_visit: "July to November (Peak monsoon and post-monsoon water flow)",
    recommended_duration: "3 to 4 hours",
    facilities: JSON.stringify(["Forest Department Watchtowers", "Designated Parking", "Changing Rooms", "Snack Counters"]),
    accessibility: "Walkway and viewing deck constructed by the forest department; rocks near the water pool are slippery.",
    travel_tips: "Do not attempt to swim in deep or barricaded water zones as whirlpool currents can be hazardous. Visit on weekdays to avoid weekend crowds.",
    nearby_attractions: "Ramappa Temple, Laknavaram Lake, Eturnagaram Wildlife Sanctuary",
    latitude: 18.5286,
    longitude: 80.4322
  },
  {
    name: "Pakhal Wildlife Sanctuary & Lake",
    description: "Spread over 839 sq km around a stunning man-made lake constructed in 1213 AD by the Kakatiya ruler Ganapati Deva. The sanctuary is rich in biodiversity, home to leopards, sloth bears, chital, sambar, marsh crocodiles, and a haven for migratory water birds.",
    city: "Warangal",
    state: "Telangana",
    address: "Pakhal Forest Division, Warangal Rural, Telangana 506132",
    category: "Wildlife Sanctuaries",
    image_url: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "08:00 AM – 06:00 PM (Daily; please verify before visiting)",
    entry_fee: "Nominal eco-tourism fee approx. ₹40 (Please verify before visiting)",
    best_time_to_visit: "November to March (Pleasant climate and peak birdwatching)",
    recommended_duration: "3 to 5 hours",
    facilities: JSON.stringify(["Forest Rest House", "Lake Viewpoints", "Boating Points", "Nature Walking Trails", "Parking"]),
    accessibility: "Forest roads accessible by car; lake bund has walking trails.",
    travel_tips: "Carry binoculars and telephoto lenses for birdwatching. Morning visits offer prime wildlife and water bird spotting opportunities.",
    nearby_attractions: "Warangal Fort, Thousand Pillar Temple, Bhadrakali Lake",
    latitude: 17.9625,
    longitude: 79.9806
  },
  {
    name: "Salar Jung Museum",
    description: "One of the three National Museums of India and the largest one-man antique art collection in the world, gathered by Mir Yousuf Ali Khan (Salar Jung III). Housed on the banks of Musi River, displaying over 40,000 priceless artifacts including the veiled Rebecca and the famous musical clock.",
    city: "Hyderabad",
    state: "Telangana",
    address: "Salar Jung Rd, Darulshifa, Hyderabad, Telangana 500002",
    category: "Museums",
    image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80",
    gallery_urls: JSON.stringify([
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80"
    ]),
    opening_hours: "10:00 AM – 05:00 PM (Closed on Fridays; please verify before visiting)",
    entry_fee: "₹50 for Indian citizens, ₹500 for Foreigners, children under 18 free with student ID (Please verify before visiting)",
    best_time_to_visit: "Year-round (Air-conditioned galleries provide comfortable indoor viewing)",
    recommended_duration: "3 to 4 hours",
    facilities: JSON.stringify(["Audio Guides", "Wheelchairs Available", "Air-Conditioned Galleries", "Museum Cafeteria", "Souvenir Counter", "Cloakrooms"]),
    accessibility: "Fully accessible with elevators, smooth ramps, and wheelchairs provided free at the ground floor reception.",
    travel_tips: "Gather in the central foyer 10 minutes before every hour to watch the famous 19th-century British musical clock strike and figurine appear.",
    nearby_attractions: "Charminar, Chowmahalla Palace, High Court of Telangana, Purani Haveli",
    latitude: 17.3713,
    longitude: 78.4804
  }
];

function seedDatabase(db, force = false) {
  if (force) {
    db.exec(`DELETE FROM destinations;`);
    console.log("Cleared existing destinations.");
  }

  const countRow = db.prepare(`SELECT COUNT(*) AS count FROM destinations`).get();
  if (countRow.count > 0 && !force) {
    console.log(`Database already contains ${countRow.count} destinations. Skipping seed.`);
    return countRow.count;
  }

  const insertStmt = db.prepare(`
    INSERT INTO destinations (
      name, description, city, state, address, category,
      image_url, gallery_urls, opening_hours, entry_fee,
      best_time_to_visit, recommended_duration, facilities,
      accessibility, travel_tips, nearby_attractions,
      latitude, longitude
    ) VALUES (
      @name, @description, @city, @state, @address, @category,
      @image_url, @gallery_urls, @opening_hours, @entry_fee,
      @best_time_to_visit, @recommended_duration, @facilities,
      @accessibility, @travel_tips, @nearby_attractions,
      @latitude, @longitude
    )
  `);

  const insertMany = db.transaction((destinations) => {
    for (const dest of destinations) {
      insertStmt.run(dest);
    }
  });

  insertMany(sampleDestinations);
  console.log(`Successfully seeded ${sampleDestinations.length} tourist destinations!`);
  return sampleDestinations.length;
}

if (require.main === module) {
  const db = initDb();
  const force = process.argv.includes('--force');
  seedDatabase(db, force);
}

module.exports = {
  sampleDestinations,
  seedDatabase
};

