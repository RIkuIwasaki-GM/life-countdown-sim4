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
  const [retireAge, setRetireAge] = useState(60);
  const [assets, setAssets] = useState(5000000);
  const [income, setIncome] = useState(300000);
  const [expenses, setExpenses] = useState(250000);
  const [growthRate, setGrowthRate] = useState(3); // 年利%

  const daysLeft = (lifeExpectancy - age) * 365;

  let yearlyData = [];
  let currentAssets = assets;

  for (let year = age; year <= lifeExpectancy; year++) {
    if (year <= retireAge) {
      // 退職までは収入−支出
      currentAssets += (income - expenses) * 12;
    } else {
      // 退職後は寿命までに0円になるよう取り崩す
      const yearsRemaining = lifeExpectancy - year + 1;
      const annualDrawdown = currentAssets / yearsRemaining;
      currentAssets -= annualDrawdown;
    }

    // 毎年、投資による成長を反映（退職後も含む）
    currentAssets *= 1 + growthRate / 100;

    yearlyData.push({ year, assets: Math.max(currentAssets, 0) });
  }

  // 退職後の1日あたり使える金額（投資込みで再計算）
  const retireAssets = yearlyData.find(d => d.year === retireAge)?.assets || currentAssets;
  const retireDays = (lifeExpectancy - retireAge) * 365;
  const dailyBudget = retireDays > 0 ? Math.floor(retireAssets / retireDays) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
        Life Countdown ✕ Die With Zero
      </h1>

      {/* 入力フォーム */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-white/20 p-4 rounded-xl shadow-lg">
        <div>
          <label className="block text-sm mb-1">現在の年齢</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">退職年齢</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={retireAge}
            onChange={(e) => setRetireAge(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">寿命 (想定)</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={lifeExpectancy}
            onChange={(e) => setLifeExpectancy(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">現在の資産 (円)</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={assets}
            onChange={(e) => setAssets(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">月収 (円)</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">月支出 (円)</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">年利 (%)</label>
          <input
            className="p-2 rounded text-black w-full"
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
          />
        </div>
      </div>

      {/* カード表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/30 p-6 rounded-2xl shadow-lg flex flex-col items-center"
        >
          <Hourglass size={48} className="mb-2" />
          <p className="text-3xl font-bold">{daysLeft.toLocaleString()}</p>
          <p className="text-lg">残り寿命（日）</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/30 p-6 rounded-2xl shadow-lg flex flex-col items-center"
        >
          <Banknote size={48} className="mb-2 text-green-400" />
          <p className="text-3xl font-bold">
            ¥{Number(dailyBudget).toLocaleString()} / 日
          </p>
          <p className="text-lg">退職後に毎日使える金額</p>
        </motion.div>
      </div>

      {/* グラフ */}
      <div className="bg-white/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">資産推移（寿命で0円）</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={yearlyData}
            margin={{ top: 20, right: 20, left: 50, bottom: 20 }}
          >
            <Line
              type="monotone"
              dataKey="assets"
              stroke="#4ade80"
              strokeWidth={3}
              dot={false}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="year" stroke="#fff" />
            <YAxis stroke="#fff" tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
