import { useState } from "react";
import { motion } from "framer-motion";
import { Hourglass, Banknote } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LifeCountdownDemo() {
  const [age, setAge] = useState(30);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [assets, setAssets] = useState(5000000);
  const [income, setIncome] = useState(300000);
  const [expenses, setExpenses] = useState(250000);
  const [growthRate, setGrowthRate] = useState(3);

  const daysLeft = (lifeExpectancy - age) * 365;

  const yearlyData = [];
  let currentAssets = assets;
  for (let year = age; year <= lifeExpectancy; year++) {
    currentAssets += income * 12 - expenses * 12;
    currentAssets *= 1 + growthRate / 100;
    yearlyData.push({ year, assets: Math.max(currentAssets, 0) });
  }

  const dailyBudget = (currentAssets / daysLeft).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
        Life Countdown ✕ 資産シミュレーション
      </h1>

      {/* 入力フォーム */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 bg-white/20 p-4 rounded-xl shadow-lg">
        <input className="p-2 rounded text-black" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} placeholder="年齢" />
        <input className="p-2 rounded text-black" type="number" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Number(e.target.value))} placeholder="想定寿命" />
        <input className="p-2 rounded text-black" type="number" value={assets} onChange={(e) => setAssets(Number(e.target.value))} placeholder="現在資産(円)" />
        <input className="p-2 rounded text-black" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} placeholder="月収(円)" />
        <input className="p-2 rounded text-black" type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} placeholder="月支出(円)" />
        <input className="p-2 rounded text-black" type="number" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} placeholder="年利(%)" />
      </div>

      {/* カード表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/30 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <Hourglass size={48} className="mb-2" />
          <p className="text-3xl font-bold">{daysLeft.toLocaleString()}</p>
          <p className="text-lg">日 残り</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/30 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <Banknote size={48} className="mb-2 text-green-400" />
          <p className="text-3xl font-bold">¥{Number(dailyBudget).toLocaleString()}</p>
          <p className="text-lg">1日あたり</p>
        </motion.div>
      </div>

      {/* グラフ */}
      <div className="bg-white/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">資産推移シミュレーション</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlyData}>
            <Line type="monotone" dataKey="assets" stroke="#4ade80" strokeWidth={3} dot={false} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="year" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}