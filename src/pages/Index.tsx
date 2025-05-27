import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import AddCompanyForm from '../components/AddCompanyForm';
import { supabase } from '../lib/supabaseClient';

export interface Company {
id: string;
name: string;
website: string;
role: string;
linkedin: string;
}

const Index = () => {
const [companies, setCompanies] = useState<Company[]>([]);
const [showForm, setShowForm] = useState(false);

useEffect(() => {
const fetchCompanies = async () => {
const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
if (error) {
console.error('Error fetching companies:', error.message);
} else {
setCompanies(data as Company[]);
}
};
fetchCompanies();
}, []);

const addCompany = async (company: Omit<Company, 'id'>) => {
const { data, error } = await supabase.from('companies').insert([company]).select().single();
if (error) {
console.error('Error adding company:', error.message);
} else {
setCompanies([data as Company, ...companies]);
setShowForm(false);
}
};

const updateCompany = async (id: string, updatedCompany: Omit<Company, 'id'>) => {
const { error } = await supabase.from('companies').update(updatedCompany).eq('id', id);
if (error) {
console.error('Error updating company:', error.message);
} else {
setCompanies(companies.map(c => (c.id === id ? { ...updatedCompany, id } : c)));
}
};

const deleteCompany = async (id: string) => {
const { error } = await supabase.from('companies').delete().eq('id', id);
if (error) {
console.error('Error deleting company:', error.message);
} else {
setCompanies(companies.filter(c => c.id !== id));
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
<div className="container mx-auto px-4 py-8">
<div className="text-center mb-8">
<h1 className="text-4xl font-bold text-gray-800 mb-2">Job Application Tracker</h1>
<p className="text-lg text-gray-600">Keep track of companies you're applying to</p>
</div>

    <div className="flex justify-center mb-8">
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        Add New Company
      </button>
    </div>

    {showForm && (
      <AddCompanyForm
        onAdd={addCompany}
        onCancel={() => setShowForm(false)}
      />
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onUpdate={updateCompany}
          onDelete={deleteCompany}
        />
      ))}
    </div>

    {companies.length === 0 && !showForm && (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <Plus size={32} />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No companies yet</h3>
        <p className="text-gray-500">Add your first company to start tracking your applications</p>
      </div>
    )}
  </div>
</div>
);
};

export default Index;
