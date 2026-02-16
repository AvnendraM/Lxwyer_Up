import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, MapPin, ArrowRight, ChevronLeft, ChevronRight, Scale, X, Check } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { WaveLayout } from '../components/WaveLayout';
import { Button } from '../components/ui/button';
import { dummyLawyers, states, specializations, searchLawyers } from '../data/lawyersData';

const FloatingCard = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-blue-900/5 rounded-2xl ${className}`}
  >
    {children}
  </motion.div>
);

export default function FindLawyerManual() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    specialization: '',
    court: '',
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [dbLawyers, setDbLawyers] = useState([]);
  const lawyersPerPage = 12;

  // Fetch verified lawyers from backend
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get(`${API}/lawyers`);
        console.log('Fetched lawyers:', response.data);
        setDbLawyers(response.data);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      }
    };
    fetchLawyers();
  }, []);

  // Map DB lawyers to match dummy data structure if needed
  const formattedDbLawyers = dbLawyers.map(lawyer => ({
    ...lawyer,
    id: lawyer.id || lawyer._id,
    photo: lawyer.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', // Fallback
    fee: lawyer.consultation_fee || lawyer.fee_range || 'Contact for fee',
    languages: lawyer.languages || ['English'],
    rating: 4.8 // Default or fetched if available
  }));

  // Combine dummy and DB lawyers
  // Use DB lawyers first, then dummy
  const allLawyers = [...formattedDbLawyers, ...dummyLawyers];

  // Search and filter logic
  const filteredLawyers = allLawyers.filter(lawyer => {
    // Basic search text match
    const matchesSearch =
      (lawyer.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (lawyer.specialization?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (lawyer.city?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter matches
    if (filters.state && lawyer.state !== filters.state) return false;
    if (filters.city && lawyer.city !== filters.city) return false;
    if (filters.specialization && lawyer.specialization !== filters.specialization) return false;
    if (filters.court && lawyer.court !== filters.court) return false;

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage);
  const startIndex = (currentPage - 1) * lawyersPerPage;
  const endIndex = startIndex + lawyersPerPage;
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      city: '',
      specialization: '',
      court: '',
      minRating: 0
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleBookConsultation = (lawyer) => {
    navigate('/book-consultation-signup', { state: { lawyer } });
  };

  const getCities = () => {
    if (!filters.state) return [];
    return states[filters.state]?.cities || [];
  };

  const getCourts = () => {
    if (!filters.state) return [];
    return states[filters.state]?.courts || [];
  };

  return (
    <WaveLayout activePage="find-lawyer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6"
          >
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Verified Legal Professionals</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Legal Advocate</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Browse through our curated list of experienced lawyers across various specializations and locations.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <FloatingCard className="p-6 mb-12 sticky top-24 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialization, or location..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`min-w-[120px] h-[50px] border-slate-200 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-slate-600'}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => {
                        handleFilterChange('state', e.target.value);
                        handleFilterChange('city', '');
                        handleFilterChange('court', '');
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All States</option>
                      {Object.keys(states).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      disabled={!filters.state}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">All Cities</option>
                      {getCities().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Specialization</label>
                    <select
                      value={filters.specialization}
                      onChange={(e) => handleFilterChange('specialization', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Court</label>
                    <select
                      value={filters.court}
                      onChange={(e) => handleFilterChange('court', e.target.value)}
                      disabled={!filters.state}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">All Courts</option>
                      {getCourts().map(court => (
                        <option key={court} value={court}>{court}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingCard>

        {/* Results */}
        <div className="mb-8 flex items-center justify-between text-slate-600 px-2">
          <p>Showing <span className="font-semibold text-slate-900">{startIndex + 1}-{Math.min(endIndex, filteredLawyers.length)}</span> of <span className="font-semibold text-slate-900">{filteredLawyers.length}</span> lawyers</p>
        </div>

        {currentLawyers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {currentLawyers.map((lawyer, index) => (
              <FloatingCard key={lawyer.id} delay={index * 0.05} className="group overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={lawyer.photo}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate mb-1 text-lg">{lawyer.name}</h3>
                      <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold bg-blue-50 px-2.5 py-1 rounded-md w-fit mb-1 border border-blue-100">
                        <Scale className="w-3.5 h-3.5" />
                        {lawyer.specialization}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="truncate">{lawyer.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="truncate">{lawyer.city}, {lawyer.state}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLawyer(lawyer)}
                      className="w-full text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      Profile
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBookConsultation(lawyer)}
                      className="w-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 border-0 text-white"
                    >
                      Book <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No lawyers found</h3>
            <p className="text-slate-500 max-w-sm mb-8">We couldn't find any lawyers matching your current filters. Try adjusting your search criteria.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl disabled:opacity-50 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 px-2">
              {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-110'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl disabled:opacity-50 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Lawyer Profile Modal */}
      <AnimatePresence>
        {selectedLawyer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLawyer(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header Image/Gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6 flex justify-between items-end">
                  <div className="flex items-end gap-6">
                    <img
                      src={selectedLawyer.photo}
                      alt={selectedLawyer.name}
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                    />
                    <div className="pb-1">
                      <h2 className="text-2xl font-bold text-slate-900">{selectedLawyer.name}</h2>
                      <p className="text-blue-600 font-medium">{selectedLawyer.specialization}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    {selectedLawyer.verified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-100">
                        <Check className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm">
                      <Briefcase className="w-4 h-4" /> Experience
                    </div>
                    <div className="font-semibold text-slate-900">{selectedLawyer.experience} Years</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm">
                      <MapPin className="w-4 h-4" /> Location
                    </div>
                    <div className="font-semibold text-slate-900">{selectedLawyer.city}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm">
                      <Check className="w-4 h-4" /> Cases Won
                    </div>
                    <div className="font-semibold text-slate-900">{selectedLawyer.casesWon || 'N/A'}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedLawyer.bio}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Practice Court</h3>
                      <p className="text-slate-600">{selectedLawyer.court}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Consultation Fee</h3>
                      <p className="text-blue-600 font-bold text-lg">{selectedLawyer.fee}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <Button
                      onClick={() => handleBookConsultation(selectedLawyer)}
                      className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                    >
                      Book Consultation <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </WaveLayout>
  );
}
