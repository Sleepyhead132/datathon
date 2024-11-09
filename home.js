import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, Clock, Coffee, TrendingUp, BarChart2, ChevronDown } from 'lucide-react';

const CustomerBehaviorDashboard = () => {
  // Interactive state management
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hoveredCombination, setHoveredCombination] = useState(null);
  const [hoveredIncome, setHoveredIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animate numbers on load
  useEffect(() => {
    const targetValue = 246;
    let startValue = 0;
    const duration = 1000;
    const increment = targetValue / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= targetValue) {
        setAnimatedValue(targetValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const timeRanges = ['day', 'week', 'month', 'cumulative'];

  const orderTimingData = [
    { hour: '6am', weekday: 45, weekend: 30 },
    { hour: '8am', weekday: 85, weekend: 55 },
    { hour: '10am', weekday: 65, weekend: 85 },
    { hour: '12pm', weekday: 120, weekend: 140 },
    { hour: '2pm', weekday: 70, weekend: 95 },
    { hour: '4pm', weekday: 65, weekend: 85 },
    { hour: '6pm', weekday: 110, weekend: 130 },
    { hour: '8pm', weekday: 90, weekend: 120 },
    { hour: '10pm', weekday: 45, weekend: 75 }
  ];

  const itemCombinations = [
    { combination: 'Coffee + Pastry', count: 450, percentage: 28 },
    { combination: 'Sandwich + Drink', count: 380, percentage: 24 },
    { combination: 'Salad + Soup', count: 320, percentage: 20 },
    { combination: 'Dessert + Coffee', count: 280, percentage: 18 },
    { combination: 'Others', count: 160, percentage: 10 }
  ];

  const foodIncomeData = [
    { category: 'Hot Beverages', income: 45000, percentage: 30 },
    { category: 'Pastries', income: 35000, percentage: 23 },
    { category: 'Sandwiches', income: 28000, percentage: 19 },
    { category: 'Salads', income: 22000, percentage: 15 },
    { category: 'Desserts', income: 20000, percentage: 13 }
  ];

  const customerRetention = [
    { month: 'Jan', newCustomers: 120, returning: 280, total: 400 },
    { month: 'Feb', newCustomers: 150, returning: 310, total: 460 },
    { month: 'Mar', newCustomers: 140, returning: 340, total: 480 },
    { month: 'Apr', newCustomers: 160, returning: 380, total: 540 }
  ];

  const getCumulativeMetrics = () => {
    const totalCustomers = customerRetention.reduce((acc, curr) => acc + curr.total, 0);
    const totalNewCustomers = customerRetention.reduce((acc, curr) => acc + curr.newCustomers, 0);
    const avgDailyCustomers = Math.round(totalCustomers / (customerRetention.length * 30));
    const totalIncome = foodIncomeData.reduce((acc, curr) => acc + curr.income, 0);

    return {
      avgDaily: avgDailyCustomers,
      total: totalCustomers,
      new: totalNewCustomers,
      totalIncome: totalIncome
    };
  };

  const getMetrics = () => {
    if (timeRange === 'cumulative') {
      const cumulative = getCumulativeMetrics();
      return [
        {
          title: 'Total Customers',
          value: cumulative.total.toLocaleString(),
          trend: `${cumulative.new} new`,
          icon: Users,
          detail: `Across ${customerRetention.length} months`
        },
        {
          title: 'Total Income',
          value: `$${(cumulative.totalIncome/1000).toFixed(1)}k`,
          trend: '+15% YoY',
          icon: TrendingUp,
          detail: 'All food categories'
        },
        {
          title: 'Top Category',
          value: 'Hot Beverages',
          trend: '$45k revenue',
          icon: Coffee,
          detail: '30% of total income'
        },
        {
          title: 'Popular Combo',
          value: 'Coffee + Pastry',
          trend: '+12%',
          icon: Coffee,
          detail: '28% of all orders'
        }
      ];
    }

    return [
      {
        title: 'Avg Daily Customers',
        value: animatedValue,
        trend: '+5%',
        icon: Users,
        detail: 'Peak time: 12-2pm'
      },
      {
        title: 'Daily Income',
        value: '$4,850',
        trend: '+8%',
        icon: TrendingUp,
        detail: 'Above weekly average'
      },
      {
        title: 'Popular Combo',
        value: 'Coffee + Pastry',
        trend: '+12%',
        icon: Coffee,
        detail: '28% of orders'
      },
      {
        title: 'Peak Hours',
        value: '12pm-2pm',
        trend: '+15%',
        icon: Clock,
        detail: 'Lunch rush'
      }
    ];
  };

  const metrics = getMetrics();

  const chartTheme = {
    colors: ['#60a5fa', '#f87171', '#34d399', '#a78bfa', '#fbbf24'],
    background: '#1a1a1a',
    text: '#ffffff',
    grid: '#333333'
  };

  const MetricCard = ({ metric, index }) => (
    <Card 
      className={`bg-gray-800 border-gray-700 transform transition-all duration-200 hover:scale-105 cursor-pointer
        ${selectedMetric === index ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => setSelectedMetric(index)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <metric.icon className={`h-8 w-8 transition-colors duration-200 
            ${selectedMetric === index ? 'text-blue-400' : 'text-gray-400'}`} />
          <span className="text-green-400 text-sm">{metric.trend}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
        <p className="text-sm text-gray-400">{metric.title}</p>
        <p className="text-xs text-gray-500 mt-2">{metric.detail}</p>
      </CardContent>
    </Card>
  );

  const TimeRangeSelector = () => (
    <div className="flex items-center gap-2 mb-4">
      {timeRanges.map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-4 py-2 rounded-lg transition-all duration-200
            ${timeRange === range 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-900">
      <TimeRangeSelector />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 transform transition-all duration-200 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order Timing Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderTimingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="hour" stroke={chartTheme.text} />
                  <YAxis stroke={chartTheme.text} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#ffffff' }}
                    animationDuration={200}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weekday" 
                    stroke={chartTheme.colors[0]} 
                    strokeWidth={2}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weekend" 
                    stroke={chartTheme.colors[1]} 
                    strokeWidth={2}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 transform transition-all duration-200 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Popular Item Combinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={itemCombinations}
                    dataKey="percentage"
                    nameKey="combination"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    animationDuration={1000}
                    animationBegin={0}
                    onMouseEnter={(data, index) => setHoveredCombination(index)}
                    onMouseLeave={() => setHoveredCombination(null)}
                  >
                    {itemCombinations.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartTheme.colors[index % chartTheme.colors.length]}
                        opacity={hoveredCombination === null || hoveredCombination === index ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#ffffff' }}
                    animationDuration={200}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 md:col-span-2 transform transition-all duration-200 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Income Distribution by Food Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={foodIncomeData}
                    dataKey="income"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, value }) => `${name} ($${(value/1000).toFixed(1)}k)`}
                    animationDuration={1000}
                    animationBegin={0}
                    onMouseEnter={(data, index) => setHoveredIncome(index)}
                    onMouseLeave={() => setHoveredIncome(null)}
                  >
                    {foodIncomeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartTheme.colors[index % chartTheme.colors.length]}
                        opacity={hoveredIncome === null || hoveredIncome === index ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#ffffff' }}
                    formatter={(value) => `$${(value/1000).toFixed(1)}k`}
                    animationDuration={200}
                  />
                  <Legend formatter={(value) => `${value} (${foodIncomeData.find(item => item.category === value).percentage}%)`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerBehaviorDashboard;