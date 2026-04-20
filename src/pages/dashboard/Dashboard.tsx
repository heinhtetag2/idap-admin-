import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const expensesData = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
  { name: 'Jul', value: 4300 },
];

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto w-full px-6 md:px-8 xl:px-12 py-8 bg-[#FAF9F6]"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#2C2627]">{t('Dashboard')}</h1>
          <p className="text-sm text-[#8A8284] mt-1">{t('Welcome back. Here is what is happening today.')}</p>
        </div>
        <div className="flex gap-3">
          <select className="appearance-none pl-4 pr-10 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm font-medium text-[#2C2627] focus:outline-none focus:border-[#4C2D33] shadow-none cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
            <option>Last month</option>
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Revenue', value: '$45,231.89', trend: '+20.1%', isPositive: true, icon: DollarSign },
          { title: 'Total Expenses', value: '$12,450.00', trend: '+4.5%', isPositive: false, icon: CreditCard },
          { title: 'Active Users', value: '2,350', trend: '+15.2%', isPositive: true, icon: Users },
          { title: 'Conversion Rate', value: '3.8%', trend: '-1.2%', isPositive: false, icon: Activity }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white border border-[#EAE5E3] rounded-md p-5 flex flex-col justify-center shadow-none hover:border-[#D5C9C6] transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-[#8A8284]">{t(stat.title)}</span>
              <div className="p-2 bg-[#F5F2F0] rounded-md text-[#5A5254] group-hover:bg-[#4C2D33] group-hover:text-white transition-colors">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-[#2C2627]">{stat.value}</span>
            </div>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.isPositive ? 'text-[#2E7D32]' : 'text-[#D93D4A]'}`}>
              {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.trend} <span className="text-[#8A8284] ml-1 font-normal">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white border border-[#EAE5E3] rounded-md p-6 shadow-none"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#2C2627]">{t('Revenue Overview')}</h2>
              <p className="text-sm text-[#8A8284]">{t('Monthly revenue performance')}</p>
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4C2D33" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4C2D33" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F2F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8A8284' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8A8284' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C2627', borderRadius: '6px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#EAE5E3', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4C2D33" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expenses Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white border border-[#EAE5E3] rounded-md p-6 shadow-none"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#2C2627]">{t('Expenses Overview')}</h2>
              <p className="text-sm text-[#8A8284]">{t('Monthly expenses tracking')}</p>
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F2F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8A8284' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8A8284' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C2627', borderRadius: '6px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#F5F2F0' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {
                    expensesData.map((entry, index) => (
                      <Cell key={`expense-cell-${index}-${entry.name}`} fill={index === expensesData.length - 1 ? '#4C2D33' : '#EAE5E3'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}