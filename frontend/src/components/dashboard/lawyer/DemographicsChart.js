import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const DemographicsChart = ({ cases = [], darkMode = true, lang = 'en' }) => {
    const activeCount = cases.filter(c => c.status === 'active' || c.status === 'open').length;
    const pendingCount = cases.filter(c => c.status === 'pending').length;
    const closedCount = cases.filter(c => c.status === 'closed' || c.status === 'completed').length;
    const totalCases = cases.length;

    const data = [
        { name: lang === 'hi' ? 'सक्रिय' : 'Active', value: activeCount, color: '#3B82F6' },
        { name: lang === 'hi' ? 'विचाराधीन' : 'Pending', value: pendingCount, color: '#A78BFA' },
        { name: lang === 'hi' ? 'बंद' : 'Closed', value: closedCount, color: darkMode ? '#4B5563' : '#F3F4F6' },
    ];

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`p-6 rounded-[2.5rem] shadow-sm border h-full flex flex-col relative overflow-hidden transition-colors duration-300 hover:shadow-xl ${darkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-blue-50'}`}
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {lang === 'hi' ? 'केस की स्थिति' : 'Case Status'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{totalCases}</h2>
                        <span className="text-xs text-gray-400">{lang === 'hi' ? 'कुल मामले' : 'Total Cases'}</span>
                    </div>
                </div>
                <button className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    <Briefcase className="w-3 h-3" />
                    {lang === 'hi' ? 'सभी समय' : 'All Time'}
                </button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs font-medium relative z-10">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{lang === 'hi' ? 'सक्रिय' : 'Active'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{lang === 'hi' ? 'विचाराधीन' : 'Pending'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{lang === 'hi' ? 'बंद' : 'Closed'}</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px] relative z-0 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="60%"
                            outerRadius="100%"
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                backgroundColor: darkMode ? '#2C2C2C' : '#FFFFFF',
                                color: darkMode ? '#FFF' : '#1F2937',
                                boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: darkMode ? '#E5E7EB' : '#374151' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-x-0 bottom-4 text-center">
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{lang === 'hi' ? 'कुल मामले' : 'Total Cases'}</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{totalCases}</p>
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none rounded-b-[2.5rem] bg-gradient-to-t from-transparent ${darkMode ? 'from-white/5' : 'from-blue-50/50'}`} />
        </motion.div>
    );
};

export default DemographicsChart;
