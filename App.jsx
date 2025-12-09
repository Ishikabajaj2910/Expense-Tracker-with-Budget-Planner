import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function ExpenseTracker() {
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryBudgets, setCategoryBudgets] = useState({
    Food: 0,
    Entertainment: 0,
    Transport: 0,
    Utilities: 0,
    Others: 0
  });
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');

  const categories = ['Food', 'Entertainment', 'Transport', 'Utilities', 'Others'];
  const categoryEmojis = {
    Food: '🍔',
    Entertainment: '🎮',
    Transport: '🚗',
    Utilities: '💡',
    Others: '📦'
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget - totalSpent;
  const spentPercentage = budget > 0 ? ((totalSpent / budget) * 100).toFixed(1) : 0;
  const avgPerDay = transactions.length > 0 ? (totalSpent / 30).toFixed(2) : 0;

  const handleSetBudget = () => {
    const value = parseFloat(budgetInput);
    if (value > 0) {
      setBudget(value);
      setBudgetInput('');
    }
  };

  const handleAddTransaction = () => {
    if (description && amount && parseFloat(amount) > 0) {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date,
        timestamp: new Date().getTime()
      };
      setTransactions([...transactions, newTransaction]);
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSetCategoryBudget = (cat, value) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [cat]: parseFloat(value) || 0
    });
  };

  const getCategorySpent = (cat) => {
    return transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getFilteredTransactions = () => {
    let filtered = filterCategory === 'All' 
      ? transactions 
      : transactions.filter(t => t.category === filterCategory);

    return filtered.sort((a, b) => {
      switch(sortBy) {
        case 'Newest First':
          return b.timestamp - a.timestamp;
        case 'Oldest First':
          return a.timestamp - b.timestamp;
        case 'Highest Amount':
          return b.amount - a.amount;
        case 'Lowest Amount':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 p-6 min-h-screen">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider text-slate-300">Category Budgets</h2>
            <div className="space-y-4">
              {categories.map(cat => {
                const spent = getCategorySpent(cat);
                const catBudget = categoryBudgets[cat];
                const percentage = catBudget > 0 ? (spent / catBudget) * 100 : 0;
                
                return (
                  <div key={cat} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoryEmojis[cat]}</span>
                        <span className="font-medium">{cat}</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">₹{catBudget}</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Set budget"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-cyan-400"
                      onChange={(e) => handleSetCategoryBudget(cat, e.target.value)}
                    />
                    <div className="text-sm text-slate-400">
                      Spent: ₹{spent} ({percentage.toFixed(0)}% used)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Budget Overview Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Total Budget</div>
              <div className="text-4xl font-bold mb-4 text-cyan-400">₹{budget}</div>
              <div className="text-slate-500 text-sm">{spentPercentage}% allocated</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Spent</div>
              <div className="text-4xl font-bold mb-4 text-orange-400">₹{totalSpent}</div>
              <div className="text-slate-500 text-sm">{spentPercentage}% of budget</div>
              <div className="text-slate-500 text-sm">₹{avgPerDay}/day average</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Remaining</div>
              <div className="text-4xl font-bold text-emerald-400">₹{remaining}</div>
            </div>
          </div>

          {/* Monthly Budget Section */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              📅 Monthly Budget
            </h2>
            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Set Budget Amount</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter amount..."
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSetBudget}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all"
                >
                  Set Budget
                </button>
              </div>
            </div>
          </div>

          {/* Add Transaction Section */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Lunch at cafe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <button
              onClick={handleAddTransaction}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all"
            >
              Add Transaction
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">📊 Transaction History</h2>
              <span className="text-slate-400">{getFilteredTransactions().length} transactions</span>
            </div>

            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-slate-400 text-sm mb-2">Filter by Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCategory('All')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterCategory === 'All'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterCategory === cat
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Sort by</label>
                <div className="flex flex-wrap gap-2">
                  {['Newest First', 'Oldest First', 'Highest Amount', 'Lowest Amount'].map(sort => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        sortBy === sort
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {getFilteredTransactions().length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-lg">No transactions yet</div>
                <div className="text-sm">Add your first transaction to get started!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {getFilteredTransactions().map(transaction => (
                  <div
                    key={transaction.id}
                    className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700/50 transition-all border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{categoryEmojis[transaction.category]}</span>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-slate-400">
                          {transaction.category} • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-orange-400">₹{transaction.amount}</span>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}