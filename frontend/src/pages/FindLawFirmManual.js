import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Filter, MapPin, Users, ArrowRight, Star, Globe, Phone, Mail, Award, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { WaveLayout } from '../components/WaveLayout';
import { Button } from '../components/ui/button';
import { dummyLawFirms, states, practiceAreas } from '../data/lawFirmsData';

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

export default function FindLawFirmManual() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    practiceArea: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const firmsPerPage = 9;

  // Search and filter logic
  const filteredFirms = dummyLawFirms.filter(firm => {
    const matchesSearch =
      firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.practiceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      firm.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = !filters.state || firm.state === filters.state;
    const matchesCity = !filters.city || firm.city === filters.city;
    const matchesArea = !filters.practiceArea || firm.practiceAreas.includes(filters.practiceArea);

    return matchesSearch && matchesState && matchesCity && matchesArea;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFirms.length / firmsPerPage);
  const startIndex = (currentPage - 1) * firmsPerPage;
  const endIndex = startIndex + firmsPerPage;
  const currentFirms = filteredFirms.slice(startIndex, endIndex);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ state: '', city: '', practiceArea: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getCities = () => {
    if (!filters.state) return [];
    return states[filters.state] || [];
  };

  return (
    <WaveLayout activePage="find-law-firm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6"
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Top Legal Firms</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Partner with Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Law Firms</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Discover and connect with prestigious law firms specialized in handling complex legal matters for businesses and individuals.
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
                placeholder="Search by firm name, practice area, or location..."
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
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => {
                        handleFilterChange('state', e.target.value);
                        handleFilterChange('city', '');
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
                    <label className="text-sm font-medium text-slate-700">Practice Area</label>
                    <select
                      value={filters.practiceArea}
                      onChange={(e) => handleFilterChange('practiceArea', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Practice Areas</option>
                      {practiceAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
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

        {/* Results Grid */}
        <div className="mb-8 flex items-center justify-between text-slate-600 px-2">
          <p>Showing <span className="font-semibold text-slate-900">{startIndex + 1}-{Math.min(endIndex, filteredFirms.length)}</span> of <span className="font-semibold text-slate-900">{filteredFirms.length}</span> firms</p>
        </div>

        {currentFirms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentFirms.map((firm, index) => (
              <FloatingCard key={firm.id} delay={index * 0.05} className="group flex flex-col h-full">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                  <img
                    src={firm.image}
                    alt={firm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 shadow-sm">{firm.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-200 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {firm.city}, {firm.state}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {firm.practiceAreas.slice(0, 3).map((area, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
                        {area}
                      </span>
                    ))}
                    {firm.practiceAreas.length > 3 && (
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-md">
                        +{firm.practiceAreas.length - 3}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                    {firm.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{firm.lawyersCount} Lawyers</span>
                    </div>
                    <Button
                      onClick={() => setSelectedFirm(firm)}
                      className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                    >
                      View Details
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">No firms found</h3>
            <p className="text-slate-500 max-w-sm mb-8">We couldn't find any law firms matching your current criteria.</p>
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
              className="w-10 h-10 rounded-xl disabled:opacity-50"
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
              className="w-10 h-10 rounded-xl disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Firm Detail Modal */}
      <AnimatePresence>
        {selectedFirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFirm(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64">
                <img
                  src={selectedFirm.image}
                  alt={selectedFirm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedFirm(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedFirm.name}</h2>
                  <div className="flex items-center gap-4 text-slate-200">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedFirm.city}, {selectedFirm.state}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {selectedFirm.lawyersCount} Lawyers</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 p-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About the Firm</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedFirm.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Practice Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFirm.practiceAreas.map((area, idx) => (
                        <div key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Achievements</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                          <Award className="w-5 h-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">Top Legal Firm 2025</p>
                            <p className="text-slate-500 text-xs">Awarded for excellence in corporate law</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                    <h3 className="font-bold text-slate-900">Contact Information</h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">contact@{selectedFirm.name.toLowerCase().replace(/\s/g, '')}.com</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">www.{selectedFirm.name.toLowerCase().replace(/\s/g, '')}.com</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                      Contact Firm
                    </Button>
                  </div>

                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2">Book Consultation</h3>
                    <p className="text-sm text-indigo-700 mb-4">Schedule a meeting with senior partners or specialized teams.</p>
                    <Button variant="outline" className="w-full bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                      Request Availability
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
