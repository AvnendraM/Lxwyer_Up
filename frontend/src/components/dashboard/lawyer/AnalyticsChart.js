import { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, ChevronRight } from 'lucide-react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, addWeeks, isThisWeek } from 'date-fns';
import { motion } from 'framer-motion';

const AnalyticsChart = ({ bookings = [], darkMode = true }) => {
    const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, 1 = next week

    const today = new Date();
    const referenceDate = addWeeks(today, weekOffset);
    const start = startOfWeek(referenceDate, { weekStartsOn: 0 });
    const end = endOfWeek(referenceDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    const chartData = days.map(day => {
        const dayBookings = bookings.filter(b => {
            if (b.date) return b.date === format(day, 'yyyy-MM-dd');
            const bookingDate = b.start_time ? new Date(b.start_time) : null;
            return bookingDate && isSameDay(bookingDate, day);
        });

        const now = new Date();

        const cancelled = dayBookings.filter(b => b.status === 'cancelled').length;

        const active = dayBookings.filter(b => {
            if (b.status === 'cancelled' || b.status === 'completed') return false;
            const timeStr = b.time && b.time.length === 5 ? b.time : (b.time ? b.time.padStart(5, '0') : '00:00');
            const meetingTime = b.start_time ? new Date(b.start_time) : new Date(`${b.date}T${timeStr}`);
            if (isNaN(meetingTime.getTime())) return true;
            return meetingTime > now && (b.status === 'confirmed' || b.status === 'pending' || !b.status || b.status === 'reschedule_proposed');
        }).length;

        const completed = dayBookings.filter(b => {
            if (b.status === 'cancelled') return false;
            if (b.status === 'completed') return true;
            const timeStr = b.time && b.time.length === 5 ? b.time : (b.time ? b.time.padStart(5, '0') : '00:00');
            const meetingTime = b.start_time ? new Date(b.start_time) : new Date(`${b.date}T${timeStr}`);
            if (isNaN(meetingTime.getTime())) return false;
            return meetingTime <= now && (b.status === 'confirmed' || b.status === 'pending' || !b.status || b.status === 'reschedule_proposed');
        }).length;

        return { name: format(day, 'EEE'), active, completed, cancelled };
    });

    // Count bookings falling in the displayed week
    const weekBookings = bookings.filter(b => {
        const d = b.date ? new Date(b.date + 'T00:00:00') : (b.start_time ? new Date(b.start_time) : null);
        return d && d >= start && d <= end;
    });
    const totalBookings = weekBookings.length;
    const cancelledCount = weekBookings.filter(b => b.status === 'cancelled').length;

    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`p-6 rounded-[2.5rem] shadow-sm border h-full flex flex-col transition-colors duration-300 hover:shadow-xl ${darkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-blue-50'}`}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Weekly Appointments</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1.5">
                            <span className={`text-2xl font-bold ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}>{totalBookings}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-500 bg-blue-50'}`}>Total</span>
                        </span>
                        {cancelledCount > 0 && (
                            <span className="flex items-center gap-1.5">
                                <span className={`text-lg font-bold text-red-500`}>{cancelledCount}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full text-red-400 ${darkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>Cancelled</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Week toggle */}
                <div className={`flex items-center gap-1 rounded-xl p-1 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <button
                        onClick={() => setWeekOffset(0)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${weekOffset === 0
                            ? 'bg-blue-600 text-white shadow'
                            : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')
                            }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        This Week
                    </button>
                    <button
                        onClick={() => setWeekOffset(1)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${weekOffset === 1
                            ? 'bg-blue-600 text-white shadow'
                            : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')
                            }`}
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                        Next Week
                    </button>
                </div>
            </div>

            {weekOffset > 0 && (
                <p className={`text-xs mb-3 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
                </p>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Scheduled</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Completed</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> Cancelled</span>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={28}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: darkMode ? '#2C2C2C' : '#F3F4F6', radius: 10 }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                backgroundColor: darkMode ? '#2C2C2C' : '#FFFFFF',
                                color: darkMode ? '#FFF' : '#1F2937',
                                boxShadow: darkMode ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: darkMode ? '#E5E7EB' : '#374151' }}
                            labelStyle={{ color: darkMode ? '#9CA3AF' : '#6B7280' }}
                        />
                        <Bar dataKey="active" stackId="a" fill={darkMode ? '#3B82F6' : '#2563EB'} radius={[0, 0, 4, 4]} name="Scheduled" />
                        <Bar dataKey="completed" stackId="a" fill={darkMode ? '#10B981' : '#059669'} radius={[0, 0, 0, 0]} name="Completed" />
                        <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="Cancelled" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default AnalyticsChart;
