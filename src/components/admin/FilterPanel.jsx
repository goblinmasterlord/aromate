import { X, Sparkles, Droplets, Calendar, DollarSign, Users, FlaskConical } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, perfumes }) => {
  const perfumeTypes = perfumes?.length ? [...new Set(perfumes.map(p => p.type))].sort() : [];
  const genders = perfumes?.length ? [...new Set(perfumes.map(p => p.gender))].sort() : [];
  const seasons = perfumes?.length ? [...new Set(perfumes.flatMap(p => p.season))] : [];
  const concentrations = perfumes?.length ? [...new Set(perfumes.map(p => p.concentration))] : [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      gender: '',
      season: '',
      minPrice: '',
      maxPrice: '',
      concentration: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(f => f).length;

  const filterGroups = [
    {
      icon: <Sparkles className="h-4 w-4" />,
      label: "Type",
      key: "type",
      options: perfumeTypes,
      value: filters.type,
      placeholder: "All Types"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Gender",
      key: "gender",
      options: genders,
      value: filters.gender,
      placeholder: "All Genders"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Season",
      key: "season",
      options: seasons,
      value: filters.season,
      placeholder: "All Seasons"
    },
    {
      icon: <FlaskConical className="h-4 w-4" />,
      label: "Concentration",
      key: "concentration",
      options: concentrations,
      value: filters.concentration,
      placeholder: "All Concentrations"
    }
  ];

  return (
    <div className="mb-6 bg-gradient-to-br from-background-900 to-background-800 rounded-xl border border-background-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-background-700 bg-background-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Droplets className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Filter Perfumes</h3>
              <p className="text-sm text-gray-500">
                {activeFiltersCount > 0 
                  ? `${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`
                  : 'Apply filters to refine your search'
                }
              </p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {filterGroups.map((group) => (
            <div key={group.key} className="group">
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                <span className="text-gray-500">{group.icon}</span>
                {group.label}
              </label>
              <select
                value={group.value}
                onChange={(e) => handleFilterChange(group.key, e.target.value)}
                className="w-full px-4 py-2.5 bg-background-800/50 border border-background-700 rounded-lg focus:outline-none focus:border-primary-500 hover:border-background-600 transition-colors"
              >
                <option value="">{group.placeholder}</option>
                {group.options.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background-800/30 rounded-lg p-4 border border-background-700">
            <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-300">
              <DollarSign className="h-4 w-4 text-gray-500" />
              Price Range
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-background-800/50 border border-background-700 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-background-800/50 border border-background-700 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                />
              </div>
              <span className="text-gray-500 text-sm">USD</span>
            </div>
          </div>
          
          <div className="bg-primary-500/10 rounded-lg p-4 border border-primary-500/20 flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-300">Quick Stats</p>
              <p className="text-xs text-primary-200/70">
                {perfumes?.length || 0} total perfumes • 
                {' '}{perfumeTypes.length} types • 
                {' '}${perfumes?.length ? Math.round(perfumes.reduce((acc, p) => acc + (p.price || 0), 0) / perfumes.length) : 0} avg price
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;