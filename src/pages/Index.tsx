import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Moon, Sun, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/theme-provider";
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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { theme, setTheme } = useTheme();

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

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-glass backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">JobTracker</h1>
                <p className="text-sm text-muted-foreground">Application Manager</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Track Your Career Journey
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 text-gradient">
            Your Dream Job
            <br />
            Awaits
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Organize, track, and manage all your job applications in one beautiful, modern dashboard
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 p-6 glass rounded-2xl animate-slide-in-up">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search companies or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-0 ring-1 ring-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={() => setShowForm(true)}
              className="btn-modern gradient-primary text-white shadow-glow hover:shadow-glow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl animate-scale-in">
              <AddCompanyForm
                onAdd={addCompany}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Companies Grid/List */}
        {filteredCompanies.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
            animate-fade-in
          `}>
            {filteredCompanies.map((company, index) => (
              <div
                key={company.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CompanyCard
                  company={company}
                  onUpdate={updateCompany}
                  onDelete={deleteCompany}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-8 glass rounded-3xl flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-bounce-gentle">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {searchTerm ? 'No matches found' : 'Start Your Journey'}
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {searchTerm 
                ? `No companies match "${searchTerm}". Try a different search term.`
                : 'Add your first company to begin tracking your job application journey'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="btn-modern gradient-primary text-white shadow-glow hover:shadow-glow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Company
              </Button>
            )}
          </div>
        )}

        {/* Stats Card */}
        {companies.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{companies.length}</div>
              <div className="text-muted-foreground">Total Applications</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {Math.round((companies.length * 0.15))}
              </div>
              <div className="text-muted-foreground">Interviews</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-warning mb-2">
                {Math.round((companies.length * 0.05))}
              </div>
              <div className="text-muted-foreground">Offers</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;