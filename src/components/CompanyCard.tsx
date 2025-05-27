
import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink, Linkedin, Save, X } from 'lucide-react';
import { Company } from '../pages/Index';

interface CompanyCardProps {
  company: Company;
  onUpdate: (id: string, company: Omit<Company, 'id'>) => void;
  onDelete: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: company.name,
    website: company.website,
    role: company.role,
    linkedin: company.linkedin,
  });

  const handleSave = () => {
    onUpdate(company.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: company.name,
      website: company.website,
      role: company.role,
      linkedin: company.linkedin,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full text-xl font-bold border-b-2 border-blue-200 focus:border-blue-500 outline-none pb-1 bg-transparent"
            placeholder="Company Name"
          />
          
          <input
            type="url"
            value={editData.website}
            onChange={(e) => setEditData({ ...editData, website: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            placeholder="Website URL"
          />
          
          <input
            type="text"
            value={editData.role}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            placeholder="Role/Position"
          />
          
          <input
            type="text"
            value={editData.linkedin}
            onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            placeholder="LinkedIn URL or Profile"
          />
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 truncate pr-2">
              {company.name}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(company.id)}
                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-700 min-w-[60px]">Role:</span>
              <span className="ml-2">{company.role || 'Not specified'}</span>
            </div>

            {company.website && (
              <div className="flex items-center text-gray-600">
                <span className="font-medium text-gray-700 min-w-[60px]">Website:</span>
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate"
                >
                  <span className="truncate">{company.website}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {company.linkedin && (
              <div className="flex items-center text-gray-600">
                <span className="font-medium text-gray-700 min-w-[60px]">LinkedIn:</span>
                <a
                  href={company.linkedin.startsWith('http') ? company.linkedin : `https://linkedin.com/in/${company.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate"
                >
                  <Linkedin size={16} />
                  <span className="truncate">{company.linkedin}</span>
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyCard;
