// /home/project/src/pages/stories.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button'; // ✅ FIXED: Added the missing import for the Button
import { Newspaper, FilterX, Quote } from 'lucide-react';

type Story = {
  id: string;
  story_type: string;
  experience_type: string;
  location: string;
  content: string;
  anonymous: boolean;
  created_at: string;
};

const storyTypeLabels = [
  'Patient / Survivor',
  'Caregiver',
  'Family Member',
  'Friend / Supporter',
  'Concerned Citizen',
];

const StoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('approved', true)
        .order('submitted_at', { ascending: false });

      if (!error && data) {
        setStories(data);
        setFilteredStories(data);
      } else {
        console.error('Error fetching stories:', error);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  useEffect(() => {
    let filtered = stories;
    if (filterType) {
      filtered = filtered.filter((story) => story.story_type === filterType);
    }
    if (filterLocation) {
      filtered = filtered.filter((story) => story.location === filterLocation);
    }
    setFilteredStories(filtered);
  }, [filterType, filterLocation, stories]);

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto max-w-7xl py-12 md:py-20 px-4">
        
        <div className="text-center mb-12">
          <div className="mx-auto bg-blue-100 rounded-full p-4 w-fit mb-4">
            <Newspaper className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Real Stories. Real Impact.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Read stories from fellow Singaporeans and regional voices. Every experience shared inspires another to get screened or support a loved one.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 p-4 bg-white rounded-xl shadow-md border">
          <select
            aria-label="Filter by role"
            className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Roles</option>
            {storyTypeLabels.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            aria-label="Filter by location"
            className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option>Singapore</option>
            <option>Malaysia</option>
            <option>Philippines</option>
            <option>Australia</option>
            <option>India</option>
            <option>Other</option>
          </select>
        </div>

        {loading ? (
            <p className="text-center text-gray-500 col-span-full py-10">Loading stories...</p>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border col-span-full">
              <FilterX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Stories Found</h3>
              <p className="text-gray-500 mt-2 mb-6">There are no approved stories that match your current filters.</p>
              <Button asChild>
                  <Link to="/share-your-story">Be the First to Share a Story</Link>
              </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div key={story.id} className="bg-white p-6 shadow-lg rounded-xl flex flex-col border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex-grow">
                  <Quote className="h-8 w-8 text-blue-200 mb-4" />
                  <p className="italic text-gray-800 text-lg leading-relaxed mb-4">"{story.content.length > 200 ? story.content.slice(0, 200) + '…' : story.content}"</p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">
                    — {story.anonymous ? 'Anonymous' : story.story_type}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{story.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;