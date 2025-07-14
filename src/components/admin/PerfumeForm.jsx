import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Package, Calendar, Users, DollarSign, Palette, Hash, Star } from 'lucide-react';
import { fragranceNotes } from '../../data/fragranceNotes';

const PerfumeForm = ({ perfume, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: 'fresh',
    concentration: 'Eau de Toilette',
    gender: 'unisex',
    price: '',
    size: '100ml',
    year: new Date().getFullYear(),
    season: [],
    occasion: [],
    notes: {
      top: [],
      middle: [],
      base: []
    },
    characteristics: {
      longevity: 5,
      sillage: 5,
      intensity: 5
    },
    tags: [],
    rating: 4.5
  });

  const [tagInput, setTagInput] = useState('');
  const [noteSearches, setNoteSearches] = useState({
    top: '',
    middle: '',
    base: ''
  });
  const [activeTab, setActiveTab] = useState('basic');

  const perfumeTypes = ['fresh', 'floral', 'oriental', 'woody', 'fougere', 'chypre', 'gourmand'];
  const concentrations = ['Eau de Cologne', 'Eau de Toilette', 'Eau de Parfum', 'Parfum', 'Extrait de Parfum'];
  const genders = ['masculine', 'feminine', 'unisex'];
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const occasions = ['casual', 'office', 'evening', 'formal', 'sport', 'daily', 'special', 'date', 'party', 'beach', 'work'];

  const allNotes = Object.values(fragranceNotes).flat();

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <Package className="h-4 w-4" /> },
    { id: 'fragrance', label: 'Fragrance', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'characteristics', label: 'Characteristics', icon: <Star className="h-4 w-4" /> },
    { id: 'tags', label: 'Tags & Meta', icon: <Hash className="h-4 w-4" /> }
  ];

  useEffect(() => {
    if (perfume) {
      setFormData(perfume);
    }
  }, [perfume]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNoteAdd = (pyramid, note) => {
    if (!formData.notes[pyramid].includes(note)) {
      handleNestedChange('notes', pyramid, [...formData.notes[pyramid], note]);
      setNoteSearches(prev => ({ ...prev, [pyramid]: '' }));
    }
  };

  const handleNoteRemove = (pyramid, noteIndex) => {
    handleNestedChange('notes', pyramid, formData.notes[pyramid].filter((_, i) => i !== noteIndex));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagIndex) => {
    handleChange('tags', formData.tags.filter((_, i) => i !== tagIndex));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getFilteredNotes = (search) => {
    if (!search) return [];
    return allNotes.filter(note => 
      note.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 10);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-background-900 to-background-950 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-background-800">
        <div className="bg-gradient-to-r from-primary-600/10 via-accent-600/10 to-primary-600/10 backdrop-blur-sm border-b border-background-800">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                {perfume ? 'Edit Perfume' : 'Add New Perfume'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to {perfume ? 'update' : 'create'} a perfume</p>
            </div>
            <button
              onClick={onClose}
              className="group p-3 hover:bg-background-800/50 rounded-xl transition-all duration-300"
            >
              <X className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="flex gap-1 px-6 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-background-900 text-white border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-white hover:bg-background-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary-400" />
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                  placeholder="e.g., Light Blue"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                  placeholder="e.g., Dolce & Gabbana"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-accent-400" />
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                >
                  {perfumeTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Concentration</label>
                <select
                  value={formData.concentration}
                  onChange={(e) => handleChange('concentration', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                >
                  {concentrations.map(conc => (
                    <option key={conc} value={conc}>{conc}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                >
                  {genders.map(gender => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || '')}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                  placeholder="99.99"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                  placeholder="100ml"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value) || '')}
                  className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                  placeholder={new Date().getFullYear()}
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-medium text-gray-300">Seasons</label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map(season => (
                    <button
                      key={season}
                      type="button"
                      onClick={() => handleArrayToggle('season', season)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        formData.season.includes(season)
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20'
                          : 'bg-background-800/50 border border-background-700 text-gray-400 hover:border-primary-500/50 hover:text-white'
                      }`}
                    >
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-medium text-gray-300">Occasions</label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map(occasion => (
                    <button
                      key={occasion}
                      type="button"
                      onClick={() => handleArrayToggle('occasion', occasion)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        formData.occasion.includes(occasion)
                          ? 'bg-gradient-to-r from-accent-600 to-accent-700 text-white shadow-lg shadow-accent-500/20'
                          : 'bg-background-800/50 border border-background-700 text-gray-400 hover:border-accent-500/50 hover:text-white'
                      }`}
                    >
                      {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fragrance' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl p-4 border border-primary-500/20">
                <p className="text-sm text-primary-300">
                  <Sparkles className="inline h-4 w-4 mr-2" />
                  Add fragrance notes to build the perfume's scent pyramid
                </p>
              </div>
              
              {['top', 'middle', 'base'].map(pyramid => (
                <div key={pyramid} className="space-y-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      pyramid === 'top' ? 'bg-blue-400' : pyramid === 'middle' ? 'bg-purple-400' : 'bg-amber-400'
                    }`} />
                    {pyramid.charAt(0).toUpperCase() + pyramid.slice(1)} Notes
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Search and add ${pyramid} notes...`}
                      value={noteSearches[pyramid]}
                      onChange={(e) => setNoteSearches(prev => ({ ...prev, [pyramid]: e.target.value }))}
                      className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                    />
                    
                    {noteSearches[pyramid] && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-background-800 border border-background-700 rounded-xl max-h-48 overflow-y-auto z-10 shadow-xl">
                        {getFilteredNotes(noteSearches[pyramid]).map(note => (
                          <button
                            key={note}
                            type="button"
                            onClick={() => handleNoteAdd(pyramid, note)}
                            className="w-full px-4 py-3 text-left hover:bg-primary-500/10 hover:text-primary-300 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            {note}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.notes[pyramid].map((note, index) => (
                      <span
                        key={index}
                        className="group px-3 py-1.5 bg-gradient-to-r from-background-800 to-background-700 rounded-full text-sm flex items-center gap-2 border border-background-600"
                      >
                        {note}
                        <button
                          type="button"
                          onClick={() => handleNoteRemove(pyramid, index)}
                          className="opacity-60 hover:opacity-100 hover:text-red-400 transition-all duration-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'characteristics' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
                <p className="text-sm text-amber-300">
                  <Star className="inline h-4 w-4 mr-2" />
                  Rate the perfume's performance characteristics
                </p>
              </div>

              {Object.entries(formData.characteristics).map(([key, value]) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300 capitalize">
                      {key}
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                      {value}/10
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) => handleNestedChange('characteristics', key, parseInt(e.target.value))}
                      className="w-full h-2 bg-background-700 rounded-full appearance-none cursor-pointer slider"
                    />
                    <div 
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full pointer-events-none"
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Weak</span>
                    <span>Moderate</span>
                    <span>Strong</span>
                  </div>
                </div>
              ))}

              <div className="space-y-3 pt-4">
                <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                  Rating
                  <span className="text-2xl font-bold text-yellow-400">{formData.rating} ★</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                    className="w-full h-2 bg-background-700 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div 
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full pointer-events-none"
                    style={{ width: `${formData.rating * 20}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  <Hash className="inline h-4 w-4 mr-2" />
                  Add tags to help categorize and search for this perfume
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    className="flex-1 px-4 py-3 bg-background-800/50 border border-background-700 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-background-800 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/20 transition-all duration-300"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="group px-3 py-1.5 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-full text-sm flex items-center gap-2 border border-primary-500/30"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(index)}
                        className="opacity-60 hover:opacity-100 hover:text-red-400 transition-all duration-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4 pt-6 border-t border-background-800">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
            >
              {perfume ? 'Update Perfume' : 'Add Perfume'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-background-800/80 hover:bg-background-700 border border-background-700 rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default PerfumeForm;