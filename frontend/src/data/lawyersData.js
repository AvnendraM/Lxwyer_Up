// Comprehensive Lawyer Data for Lxwyer Up - 500 Lawyers
// Synced with LawyerApplication.js location data

const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Neha', 'Vikram', 'Sunita', 'Arun', 'Kavita', 'Sanjay', 'Meera',
  'Rahul', 'Anjali', 'Deepak', 'Pooja', 'Suresh', 'Rekha', 'Vivek', 'Anita', 'Manish', 'Seema',
  'Rakesh', 'Shweta', 'Ajay', 'Nisha', 'Vijay', 'Ritu', 'Ashok', 'Divya', 'Ramesh', 'Sarita',
  'Karan', 'Jyoti', 'Nikhil', 'Preeti', 'Gaurav', 'Shruti', 'Alok', 'Swati', 'Mohit', 'Pallavi',
  'Rohit', 'Megha', 'Tarun', 'Sneha', 'Pankaj', 'Komal', 'Harsh', 'Tanvi', 'Vishal', 'Sakshi'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Malhotra', 'Kapoor', 'Agarwal', 'Jain', 'Patel',
  'Shah', 'Mehta', 'Reddy', 'Nair', 'Khanna', 'Bhatia', 'Chopra', 'Bansal', 'Saxena', 'Yadav',
  'Mishra', 'Pandey', 'Dubey', 'Srivastava', 'Tiwari', 'Chauhan', 'Rathore', 'Arora', 'Sethi', 'Dhawan',
  'Bajaj', 'Goyal', 'Ahuja', 'Mehra', 'Tandon', 'Kaul', 'Dua', 'Vohra', 'Grover', 'Bhargava'
];

const specializations = [
  'Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 'Real Estate', 'Corporate Law',
  'Tax Law', 'Labour Law', 'Consumer Law', 'Constitutional Law', 'Intellectual Property',
  'Banking Law', 'Cyber Law', 'Immigration Law', 'Environmental Law', 'Medical Negligence',
  'Debt Recovery', 'Arbitration'
];

// Data from LawyerApplication.js
const citiesByState = {
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind",
    "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari",
    "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat",
    "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor",
    "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad",
    "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar",
    "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri",
    "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
    "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur",
    "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ]
};

const courtsByState = {
  "Delhi": [
    "Delhi High Court", "Tis Hazari Courts Complex", "Patiala House Courts Complex",
    "Karkardooma Courts Complex", "Rohini Courts Complex", "Dwarka Courts Complex",
    "Saket Courts Complex", "Rouse Avenue Courts Complex"
  ],
  "Haryana": [
    "Punjab and Haryana High Court", "District Court Ambala", "District Court Bhiwani", "District Court Charkhi Dadri",
    "District Court Faridabad", "District Court Fatehabad", "District Court Gurugram", "District Court Hisar",
    "District Court Jhajjar", "District Court Jind", "District Court Kaithal", "District Court Karnal",
    "District Court Kurukshetra", "District Court Mahendragarh", "District Court Nuh", "District Court Palwal",
    "District Court Panchkula", "District Court Panipat", "District Court Rewari", "District Court Rohtak",
    "District Court Sirsa", "District Court Sonipat", "District Court Yamunanagar"
  ],
  "Uttar Pradesh": [
    "Allahabad High Court", "Allahabad High Court - Lucknow Bench",
    "District Court Agra", "District Court Aligarh", "District Court Ambedkar Nagar", "District Court Amethi",
    "District Court Amroha", "District Court Auraiya", "District Court Ayodhya", "District Court Azamgarh",
    "District Court Baghpat", "District Court Bahraich", "District Court Ballia", "District Court Balrampur",
    "District Court Banda", "District Court Barabanki", "District Court Bareilly", "District Court Basti",
    "District Court Bhadohi", "District Court Bijnor", "District Court Budaun", "District Court Bulandshahr",
    "District Court Chandauli", "District Court Chitrakoot", "District Court Deoria", "District Court Etah",
    "District Court Etawah", "District Court Farrukhabad", "District Court Fatehpur", "District Court Firozabad",
    "District Court Gautam Buddha Nagar", "District Court Ghaziabad", "District Court Ghazipur", "District Court Gonda",
    "District Court Gorakhpur", "District Court Hamirpur", "District Court Hapur", "District Court Hardoi",
    "District Court Hathras", "District Court Jalaun", "District Court Jaunpur", "District Court Jhansi",
    "District Court Kannauj", "District Court Kanpur Dehat", "District Court Kanpur Nagar", "District Court Kasganj",
    "District Court Kaushambi", "District Court Kheri", "District Court Kushinagar", "District Court Lalitpur",
    "District Court Lucknow", "District Court Maharajganj", "District Court Mahoba", "District Court Mainpuri",
    "District Court Mathura", "District Court Mau", "District Court Meerut", "District Court Mirzapur",
    "District Court Moradabad", "District Court Muzaffarnagar", "District Court Pilibhit", "District Court Pratapgarh",
    "District Court Prayagraj", "District Court Raebareli", "District Court Rampur", "District Court Saharanpur",
    "District Court Sambhal", "District Court Sant Kabir Nagar", "District Court Shahjahanpur", "District Court Shamli",
    "District Court Shravasti", "District Court Siddharthnagar", "District Court Sitapur", "District Court Sonbhadra",
    "District Court Sultanpur", "District Court Unnao", "District Court Varanasi"
  ]
};

// Flatten cities for generation
const cities = Object.entries(citiesByState).flatMap(([state, cities]) =>
  cities.map(city => ({ city, state }))
);

// Flatten courts for generation
const courts = Object.values(courtsByState).flat();

const languages = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

const educations = [
  'LLB from Delhi University',
  'LLB, LLM from NLS Bangalore',
  'BA LLB from NALSAR',
  'LLB from Mumbai University',
  'LLB, LLM from Symbiosis',
  'BA LLB from Amity University',
  'LLB from Lucknow University',
  'LLB from Gujarat University',
  'BA LLB from NLIU Bhopal',
  'LLB, LLM from Pune University'
];


// Curated professional-looking portrait IDs from Unsplash for HD quality
const MALE_PRO_INDICES = [
  '1560250097-0b93528c311a', '1519085360753-af0119f7cbe7', '1556157382-97eda2d62296', 
  '1507003211169-0a1dd7228f2d', '1472099645785-5658abf4ff4e', '1500648767791-00dcc994a43e', 
  '1519345182560-3f2917c472ef', '1543610892-0b1f7e6d8ef1', '1566492031-7361f58667e4', '1506794778202-cad84cf45f1d'
];
const FEMALE_PRO_INDICES = [
  '1573496359142-b8d87734a5a2', '1580489944761-15a19d654956', '1598550874175-4d0ef436c909', 
  '1573497019940-1c28c88b4f3e', '1567532939604-b6b5b0db2604', '1551836022-d5d88e9218df', 
  '1534528741775-53994a69daeb', '1508214751196-bfd47c62756f', '1573496799826-0e0a943ee6de', '1573497491208-6f46ab6883e6'
];

// Female first names for gender detection
const femaleFirstNames = new Set([
  'Priya', 'Neha', 'Sunita', 'Kavita', 'Meera', 'Anjali', 'Pooja', 'Rekha',
  'Anita', 'Seema', 'Shweta', 'Nisha', 'Ritu', 'Divya', 'Sarita', 'Jyoti',
  'Preeti', 'Shruti', 'Swati', 'Pallavi', 'Megha', 'Sneha', 'Komal', 'Tanvi', 'Sakshi'
]);

const achievementPool = [
  { title: "Won Landmark Supreme Court Case", date: "2023", icon: "Scale", pinned: true },
  { title: "Top 40 Under 40 Legal Eagles by India Law Journal", date: "2022", icon: "Award", pinned: true },
  { title: "Recognized as Best Corporate Attorney", date: "2023", icon: "Star", pinned: false },
  { title: "Successfully defended high-profile PIL", date: "2021", icon: "Shield", pinned: false },
  { title: "Featured in Forbes Legal Powerlist", date: "2024", icon: "Award", pinned: true },
  { title: "Appointed to National Legal Advisory Board", date: "2020", icon: "Briefcase", pinned: false },
  { title: "Keynote Speaker at Global Law Tech Summit", date: "2023", icon: "Globe", pinned: false }
];

const focusCities = [
  // Delhi NCR
  { city: "New Delhi",   state: "Delhi" },
  { city: "Delhi",       state: "Delhi" },
  // Haryana
  { city: "Gurugram",   state: "Haryana" },
  { city: "Gurgaon",    state: "Haryana" },
  { city: "Faridabad",  state: "Haryana" },
  // UP
  { city: "Noida",      state: "Uttar Pradesh" },
  { city: "Lucknow",    state: "Uttar Pradesh" },
  { city: "Agra",       state: "Uttar Pradesh" },
  { city: "Varanasi",   state: "Uttar Pradesh" },
  { city: "Meerut",     state: "Uttar Pradesh" },
  // Maharashtra
  { city: "Mumbai",     state: "Maharashtra" },
  { city: "Pune",       state: "Maharashtra" },
  { city: "Nagpur",     state: "Maharashtra" },
  { city: "Thane",      state: "Maharashtra" },
  // Karnataka
  { city: "Bangalore",  state: "Karnataka" },
  { city: "Mysore",     state: "Karnataka" },
  { city: "Hubli",      state: "Karnataka" },
  // Tamil Nadu
  { city: "Chennai",    state: "Tamil Nadu" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai",    state: "Tamil Nadu" },
  // Telangana
  { city: "Hyderabad",  state: "Telangana" },
  { city: "Warangal",   state: "Telangana" },
  // Gujarat
  { city: "Ahmedabad",  state: "Gujarat" },
  { city: "Surat",      state: "Gujarat" },
  { city: "Vadodara",   state: "Gujarat" },
  // Rajasthan
  { city: "Jaipur",     state: "Rajasthan" },
  { city: "Jodhpur",    state: "Rajasthan" },
  { city: "Udaipur",    state: "Rajasthan" },
  // West Bengal
  { city: "Kolkata",    state: "West Bengal" },
  // Punjab
  { city: "Chandigarh", state: "Punjab" },
  { city: "Ludhiana",   state: "Punjab" },
  { city: "Amritsar",   state: "Punjab" },
  // Kerala
  { city: "Kochi",      state: "Kerala" },
  { city: "Trivandrum", state: "Kerala" },
  // Madhya Pradesh
  { city: "Bhopal",     state: "Madhya Pradesh" },
  { city: "Indore",     state: "Madhya Pradesh" },
  // Bihar / Jharkhand
  { city: "Patna",      state: "Bihar" },
  { city: "Ranchi",     state: "Jharkhand" },
  // Odisha
  { city: "Bhubaneswar",state: "Odisha" },
];

const generateLawyers = () => {
  let maleIdx = 1;
  let femaleIdx = 1;

  // Generate for all cities initially
  const defaultLawyers = specializations.flatMap((spec, specIndex) => {
    return Array.from({ length: 50 }).map((_, i) => {
      const index = specIndex * 50 + i;
      const location = focusCities[index % focusCities.length];
      const experience = 5 + (index % 25);
      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[index % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const isFemale = femaleFirstNames.has(firstName);
      
      const fee_60min = 1500 + Math.floor(Math.random() * 4000);
      const fee_30min = Math.ceil(fee_60min / 2);

      // Assign gender-matched photo from curated professional-looking Unsplash IDs
      let photo;
      if (isFemale) {
        photo = `https://images.unsplash.com/photo-${FEMALE_PRO_INDICES[femaleIdx % FEMALE_PRO_INDICES.length]}?q=80&w=800&auto=format&fit=crop`;
        femaleIdx++;
      } else {
        photo = `https://images.unsplash.com/photo-${MALE_PRO_INDICES[maleIdx % MALE_PRO_INDICES.length]}?q=80&w=800&auto=format&fit=crop`;
        maleIdx++;
      }

      // Shuffle and pick 3-4 random achievements
      const shuffledAchievements = [...achievementPool].sort(() => 0.5 - Math.random());
      const selectedAchievements = shuffledAchievements.slice(0, 3 + (index % 2));

      return {
        id: `dummy_lawyer_${index + 1}`,
        name: fullName,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: '+91 9876543210',
        specialization: spec,
        secondarySpecializations: [specializations[(index + 1) % specializations.length]],
        practice_areas: [spec, specializations[(index + 2) % specializations.length], "General Litigation"],
        experience,
        rating: 4.5 + (Math.random() * 0.5),
        reviews: 20 + Math.floor(Math.random() * 100),
        casesWon: 50 + Math.floor(Math.random() * 200),
        casesHandled: 80 + Math.floor(Math.random() * 300),
        city: location.city,
        state: location.state,
        location: `${location.city}, ${location.state}`,
        court: courts[index % courts.length],
        barCouncilNumber: `DUMMY/${location.state.substring(0, 2).toUpperCase()}/${2024 - experience}`,
        education: educations[index % educations.length],
        languages: ['English', 'Hindi', languages[index % languages.length]],
        
        consultation_fee: fee_60min,
        feeMin: fee_30min,
        feeMax: fee_60min,
        charge_30min: String(fee_30min),
        charge_60min: String(fee_60min),
        
        bio: `${fullName} is a distinguished ${spec} attorney based in ${location.city} with over ${experience} years of aggressive courtroom experience. Recognized for strategic litigation and a deep understanding of complex ${spec.toLowerCase()} frameworks, they have successfully secured landmark verdicts for clients across ${location.state}. Their commitment to transparent fees and unyielding representation makes them one of the most sought-after legal minds in the region.`,
        catchphrase: `Providing expert legal solutions and dedicated representation in ${spec} to secure your best outcome.`,
        photo,
        achievements: selectedAchievements,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        consultationModes: ['In-Person', 'Video Call', 'Phone'],
        consultation_preferences: 'both',
        verified: true,
        isSignature: Math.random() > 0.85, // 15% chance to be a signature lawyer
        featured: Math.random() > 0.8,
        joinedDate: '2024-01-01'
      };
    });
  });

  return defaultLawyers;
};

export const dummyLawyers = generateLawyers();

export const specializationsList = specializations;
export { specializations };
export const citiesList = cities;
export const statesList = Object.keys(citiesByState);

// Legacy exports for backward compatibility with FindLawyerManual.js
// Now updated with comprehensive data
export const states = {
  "Delhi": {
    cities: citiesByState["Delhi"],
    courts: courtsByState["Delhi"]
  },
  "Haryana": {
    cities: citiesByState["Haryana"],
    courts: courtsByState["Haryana"]
  },
  "Uttar Pradesh": {
    cities: citiesByState["Uttar Pradesh"],
    courts: courtsByState["Uttar Pradesh"]
  }
};

// Search function for backward compatibility
export const searchLawyers = (query, filters) => {
  return dummyLawyers.filter(lawyer => {
    // Search query
    if (query) {
      const q = query.toLowerCase();
      const matchesSearch =
        lawyer.name.toLowerCase().includes(q) ||
        lawyer.specialization.toLowerCase().includes(q) ||
        lawyer.location.toLowerCase().includes(q) ||
        lawyer.city.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // State filter
    if (filters.state && lawyer.state !== filters.state) {
      return false;
    }

    // City filter
    if (filters.city && lawyer.city !== filters.city) {
      return false;
    }

    // Specialization filter
    if (filters.specialization && lawyer.specialization !== filters.specialization) {
      return false;
    }

    // Court filter
    if (filters.court && lawyer.court !== filters.court) {
      return false;
    }

    // Rating filter
    if (filters.minRating && lawyer.rating < filters.minRating) {
      return false;
    }

    return true;
  });
};

export default dummyLawyers;
