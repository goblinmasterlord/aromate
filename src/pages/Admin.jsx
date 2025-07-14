import { useState, useEffect } from 'react';
import { Plus, Search, Download, Upload, Filter } from 'lucide-react';
import { perfumes as initialPerfumes } from '../data/perfumes';
import PerfumeTable from '../components/admin/PerfumeTable';
import PerfumeForm from '../components/admin/PerfumeForm';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import FilterPanel from '../components/admin/FilterPanel';
import Pagination from '../components/admin/Pagination';

const Admin = () => {
  const [perfumes, setPerfumes] = useState(initialPerfumes);
  const [filteredPerfumes, setFilteredPerfumes] = useState(perfumes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [perfumeToDelete, setPerfumeToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    gender: '',
    season: '',
    minPrice: '',
    maxPrice: '',
    concentration: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    let result = [...perfumes];

    if (searchQuery) {
      result = result.filter(perfume =>
        perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perfume.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perfume.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filters.type) {
      result = result.filter(perfume => perfume.type === filters.type);
    }
    if (filters.gender) {
      result = result.filter(perfume => perfume.gender === filters.gender);
    }
    if (filters.season) {
      result = result.filter(perfume => perfume.season.includes(filters.season));
    }
    if (filters.concentration) {
      result = result.filter(perfume => perfume.concentration === filters.concentration);
    }
    if (filters.minPrice) {
      result = result.filter(perfume => perfume.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(perfume => perfume.price <= parseFloat(filters.maxPrice));
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'characteristics') {
          aValue = (a.characteristics.longevity + a.characteristics.sillage + a.characteristics.intensity) / 3;
          bValue = (b.characteristics.longevity + b.characteristics.sillage + b.characteristics.intensity) / 3;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredPerfumes(result);
    setCurrentPage(1);
  }, [perfumes, searchQuery, filters, sortConfig]);

  const paginatedPerfumes = filteredPerfumes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);

  const handleAddPerfume = () => {
    setEditingPerfume(null);
    setIsFormOpen(true);
  };

  const handleEditPerfume = (perfume) => {
    setEditingPerfume(perfume);
    setIsFormOpen(true);
  };

  const handleDeletePerfume = (perfume) => {
    setPerfumeToDelete(perfume);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (perfumeToDelete) {
      setPerfumes(perfumes.filter(p => p.id !== perfumeToDelete.id));
      setIsDeleteModalOpen(false);
      setPerfumeToDelete(null);
    }
  };

  const handleSavePerfume = (perfumeData) => {
    if (editingPerfume) {
      setPerfumes(perfumes.map(p => p.id === editingPerfume.id ? { ...perfumeData, id: editingPerfume.id } : p));
    } else {
      const newId = Math.max(...perfumes.map(p => p.id)) + 1;
      setPerfumes([...perfumes, { ...perfumeData, id: newId }]);
    }
    setIsFormOpen(false);
    setEditingPerfume(null);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(perfumes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'perfumes_export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setPerfumes(importedData);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Perfume Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage your perfume inventory</p>
        </div>

        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search perfumes by name, brand, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background-800 border border-background-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`group relative px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2.5 overflow-hidden ${
                showFilters 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25' 
                  : 'bg-background-800/80 backdrop-blur-sm border border-background-700 hover:border-primary-500/50 text-gray-300 hover:text-white'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Filter className={`h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              <span className="relative">Filters</span>
              {Object.values(filters).some(f => f) && (
                <span className="relative bg-white/20 backdrop-blur text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {Object.values(filters).filter(f => f).length}
                </span>
              )}
            </button>
            
            <button
              onClick={handleAddPerfume}
              className="group relative px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 flex items-center gap-2.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative">Add Perfume</span>
            </button>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={exportData}
                className="group relative p-3 bg-background-800/80 backdrop-blur-sm border border-background-700 rounded-xl hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
                title="Export data"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Download className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300 relative z-10" />
              </button>

              <label className="group relative p-3 bg-background-800/80 backdrop-blur-sm border border-background-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
                     title="Import data">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Upload className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300 relative z-10" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {showFilters && (
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters}
            perfumes={perfumes}
          />
        )}

        <div className="bg-background-900 rounded-xl border border-background-800 overflow-hidden">
          <div className="p-4 border-b border-background-800">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">
                Showing {paginatedPerfumes.length} of {filteredPerfumes.length} perfumes
                {filteredPerfumes.length < perfumes.length && ` (${perfumes.length} total)`}
              </p>
              {sortConfig.key && (
                <p className="text-sm text-gray-500">
                  Sorted by {sortConfig.key} ({sortConfig.direction})
                </p>
              )}
            </div>
          </div>

          <PerfumeTable
            perfumes={paginatedPerfumes}
            onEdit={handleEditPerfume}
            onDelete={handleDeletePerfume}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {isFormOpen && (
          <PerfumeForm
            perfume={editingPerfume}
            onSave={handleSavePerfume}
            onClose={() => {
              setIsFormOpen(false);
              setEditingPerfume(null);
            }}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmationModal
            title="Delete Perfume"
            message={`Are you sure you want to delete "${perfumeToDelete?.name}" by ${perfumeToDelete?.brand}? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setPerfumeToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;