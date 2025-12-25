import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, TrendingUp, MapPin, Award, Globe, ExternalLink, User } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

const API_URL = '/api/v1/recommend'

function CountryRecommendation() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const criteriaLabels = {
    education_index: 'Education',
    wealth_index: 'Wealth',
    happiness_index: 'Happiness',
    political_stability_index: 'Political Stability',
    healthcare_quality_index: 'Healthcare',
    life_expectancy: 'Life Expectancy',
    internet_penetration: 'Internet',
    gdp_per_capita: 'GDP per Capita',
    population: 'Population',
  }

  const prepareRadarData = (criteria) => {
    return Object.entries(criteria)
      .filter(([key]) => key !== 'population')
      .map(([key, value]) => ({
        criterion: criteriaLabels[key] || key,
        value: (value * 100).toFixed(0),
        fullMark: 100,
      }))
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header with Profile */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 gap-6">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left flex-1"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-deep-purple" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-deep-purple via-violet to-indigo bg-clip-text text-transparent">
              CountryGuide
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Discover your dream country with AI
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 md:min-w-[280px] hover:glass-strong transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            {/* Profile Photo - placeholder, will be replaced when user sends photo */}
            <div className="w-14 h-14 rounded-full gradient-purple flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-deep-purple/50">
              <img 
                src="/profile-photo.jpg" 
                alt="Nurgül Bedir" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <User className="w-7 h-7 text-white" style={{ display: 'none' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">Nurgül Bedir</h3>
              <p className="text-gray-400 text-xs truncate">Computer Engineering Student</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-lavender">
              <span className="px-2 py-1 bg-deep-purple/20 rounded-md">Organizer at GDG Elazığ</span>
            </div>
            <a 
              href="https://linktr.ee/nurgulbedir" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-lavender transition-colors group"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">linktr.ee/nurgulbedir</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-8 mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., I want a safe country with high economic level and good education..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-deep-purple focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full gradient-purple text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Get Recommendations
              </>
            )}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300"
          >
            Error: {error}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Criteria Visualization */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-deep-purple" />
                Criteria Analysis
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={prepareRadarData(data.criteria)}>
                      <PolarGrid stroke="#8B5CF6" strokeOpacity={0.3} />
                      <PolarAngleAxis
                        dataKey="criterion"
                        tick={{ fill: '#A78BFA', fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#A78BFA', fontSize: 10 }}
                      />
                      <Radar
                        name="Value"
                        dataKey="value"
                        stroke="#6D28D9"
                        fill="#8B5CF6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  {Object.entries(data.criteria).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300 text-sm font-medium">
                          {criteriaLabels[key] || key}
                        </span>
                        <span className="text-lavender text-sm font-semibold">
                          {(value * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full gradient-purple rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best Match Hero Card */}
            {data.best_match && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-strong rounded-2xl p-8 glow-purple relative overflow-hidden"
              >
                <div className="absolute inset-0 gradient-purple opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lavender text-sm font-semibold uppercase tracking-wide">
                        Best Match
                      </p>
                      <h3 className="text-3xl font-bold text-white">
                        {data.best_match.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Cluster #{data.best_match.cluster}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-deep-purple" />
                Recommended Countries
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {data.recommendations.map((country, index) => (
                  <motion.div
                    key={country.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="glass rounded-xl p-6 hover:glass-strong transition-all group"
                  >
                    {/* Score Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-lavender transition-colors">
                          {country.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{country.subregion || country.region}</span>
                        </div>
                      </div>
                      <div className="gradient-purple text-white px-3 py-1 rounded-full text-sm font-bold">
                        {country.score}%
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {country.description}
                    </p>

                    {/* Cluster Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xs text-gray-500">
                        Cluster #{country.cluster}
                      </span>
                      {country.capital && (
                        <span className="text-xs text-lavender">
                          {Array.isArray(country.capital) ? country.capital[0] : country.capital}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CountryRecommendation

