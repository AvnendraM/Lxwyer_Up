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
  'Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 'Corporate Law',
  'Tax Law', 'Labour Law', 'Consumer Law', 'Constitutional Law', 'Intellectual Property',
  'Banking Law', 'Cyber Law', 'Immigration Law', 'Environmental Law', 'Medical Negligence'
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

const lawyerImages = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=800'
];

const generateLawyers = () => {
  return specializations.flatMap((spec, specIndex) => {
    // Generate multiple lawyers per specialization to fill up the list
    return Array.from({ length: 5 }).map((_, i) => {
      const index = specIndex * 5 + i;
      // Round-robin assignment for location to test filters
      const location = cities[index % cities.length];
      const experience = 5 + (index % 25); // varied experience

      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[index % lastNames.length];
      const fullName = `${firstName} ${lastName}`;

      return {
        id: `dummy_lawyer_${index + 1}`,
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: '+91 9876543210',
        specialization: spec,
        secondarySpecializations: [],
        experience,
        rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5 and 5.0
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
        feeMin: 2000 + Math.floor(Math.random() * 3000),
        feeMax: 6000 + Math.floor(Math.random() * 5000),
        bio: `${fullName} is a distinguished ${spec} lawyer based in ${location.city} with over ${experience} years of experience. Specializing in complex ${spec.toLowerCase()} matters, they have successfully handled numerous high-profile cases and provide dedicated legal counsel to clients across ${location.state}.`,
        photo: lawyerImages[index % lawyerImages.length], // Changed from 'image' to 'photo' to match component usage, using high-quality images
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        consultationModes: ['In-Person', 'Video Call', 'Phone'],
        verified: Math.random() > 0.3, // 70% chance of being verified
        featured: Math.random() > 0.8,
        joinedDate: '2024-01-01'
      };
    });
  });
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
