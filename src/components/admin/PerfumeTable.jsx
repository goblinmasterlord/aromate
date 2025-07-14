import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const PerfumeTable = ({ perfumes, onEdit, onDelete, onSort, sortConfig }) => {
  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-primary-400" />
      : <ArrowDown className="h-4 w-4 text-primary-400" />;
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'characteristics', label: 'Characteristics', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  if (perfumes.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-lg">No perfumes found</p>
        <p className="text-sm mt-2">Try adjusting your filters or add a new perfume</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-background-800">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:text-white' : ''
                }`}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-background-800">
          {perfumes.map((perfume) => (
            <tr key={perfume.id} className="hover:bg-background-800/50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium">{perfume.name}</div>
                  <div className="text-xs text-gray-500">{perfume.concentration}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">{perfume.brand}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs rounded-full bg-background-700 capitalize">
                  {perfume.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">${perfume.price}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{perfume.rating}</span>
                  <span className="text-yellow-400">★</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16">Longevity:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full"
                        style={{ width: `${perfume.characteristics.longevity * 10}%` }}
                      />
                    </div>
                    <span className="text-xs w-6">{perfume.characteristics.longevity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16">Sillage:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-gradient-to-r from-accent-600 to-accent-400 h-2 rounded-full"
                        style={{ width: `${perfume.characteristics.sillage * 10}%` }}
                      />
                    </div>
                    <span className="text-xs w-6">{perfume.characteristics.sillage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16">Intensity:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full"
                        style={{ width: `${perfume.characteristics.intensity * 10}%` }}
                      />
                    </div>
                    <span className="text-xs w-6">{perfume.characteristics.intensity}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(perfume)}
                    className="group relative p-2.5 bg-background-800/50 hover:bg-primary-500/10 rounded-lg transition-all duration-300 overflow-hidden"
                    title="Edit"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 via-primary-600/20 to-primary-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Edit2 className="h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-colors duration-300 relative z-10" />
                  </button>
                  <button
                    onClick={() => onDelete(perfume)}
                    className="group relative p-2.5 bg-background-800/50 hover:bg-red-500/10 rounded-lg transition-all duration-300 overflow-hidden"
                    title="Delete"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-400 transition-colors duration-300 relative z-10" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerfumeTable;