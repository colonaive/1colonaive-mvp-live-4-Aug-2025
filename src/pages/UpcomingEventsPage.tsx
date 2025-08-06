import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, MapPin, ExternalLink, Plus, Clock, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Type definition for events (ready for database integration)
interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'Virtual Event' | 'Conference' | 'Workshop' | 'Webinar' | 'Public Event' | 'Training' | 'Campaign' | 'Resource Update' | 'Education' | 'Primary Care' | 'Launch Event' | 'Innovation Fair' | 'CME Webinar' | 'Seminar' | 'Health Policy' | 'Summit';
  description: string;
  location?: string;
  registrationUrl?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  isVirtual: boolean;
  isPublic: boolean;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const UpcomingEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This function will be replaced with actual API call
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/events?status=upcoming&limit=20');
      // const data = await response.json();
      // setEvents(data.events);
      
      // For now, return empty array (no mock data)
      setEvents([]);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      'Virtual Event': 'bg-blue-50 text-blue-600 border-blue-200',
      'Conference': 'bg-purple-50 text-purple-600 border-purple-200',
      'Workshop': 'bg-green-50 text-green-600 border-green-200',
      'Webinar': 'bg-indigo-50 text-indigo-600 border-indigo-200',
      'Public Event': 'bg-orange-50 text-orange-600 border-orange-200',
      'Training': 'bg-teal-50 text-teal-600 border-teal-200',
      'Campaign': 'bg-red-50 text-red-600 border-red-200',
      'Resource Update': 'bg-gray-50 text-gray-600 border-gray-200',
      'Education': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Primary Care': 'bg-emerald-50 text-emerald-600 border-emerald-200',
      'Launch Event': 'bg-pink-50 text-pink-600 border-pink-200',
      'Innovation Fair': 'bg-cyan-50 text-cyan-600 border-cyan-200',
      'CME Webinar': 'bg-violet-50 text-violet-600 border-violet-200',
      'Seminar': 'bg-lime-50 text-lime-600 border-lime-200',
      'Health Policy': 'bg-slate-50 text-slate-600 border-slate-200',
      'Summit': 'bg-amber-50 text-amber-600 border-amber-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pt-32">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Upcoming Events & Updates</h1>
              <p className="text-xl">
                Stay informed about the latest events, resources, and updates in our movement against colorectal cancer.
              </p>
            </div>
          </Container>
        </div>
        <Container>
          <div className="max-w-4xl mx-auto py-12 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Upcoming Events & Updates</h1>
            <p className="text-xl">
              Stay informed about the latest events, resources, and updates in our movement against colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto py-12">
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Unable to Load Events</h3>
                  <p className="text-red-700">{error}</p>
                  <Button 
                    onClick={fetchEvents} 
                    className="mt-3"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Events List */}
          {events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      
                      {/* Date Section */}
                      <div className="md:w-32 flex-shrink-0 text-center p-3 bg-blue-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-blue-600">
                          {formatDate(event.date)}
                        </div>
                        {event.time && (
                          <div className="text-xs text-blue-500 mt-1 flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          {event.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded border border-yellow-200">
                              FEATURED
                            </span>
                          )}
                          {event.isVirtual && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded border border-green-200">
                              Virtual
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        {/* Event Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          {event.maxAttendees && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.currentAttendees || 0}/{event.maxAttendees} registered
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Section */}
                      <div className="flex-shrink-0">
                        {event.registrationUrl ? (
                          <a 
                            href={event.registrationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                          >
                            Register <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <a 
                            href="/contact" 
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                          >
                            Contact Us <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State - Clean and Professional */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Events</h2>
                <p className="text-gray-600 mb-8">
                  We're currently planning exciting new events and educational opportunities. 
                  Check back soon for updates on workshops, webinars, and conferences.
                </p>
                
                {/* Subscription/Notification Options */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Stay Updated</h3>
                    <p className="text-blue-700 text-sm mb-4">
                      Be the first to know when new events are announced
                    </p>
                    <Link to="/signup/champion">
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Join as Champion for Event Updates
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Or follow us on social media for the latest announcements
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action for Event Suggestions */}
          {events.length === 0 && (
            <div className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Have an Event Idea?</h3>
              <p className="text-gray-600 mb-6">
                We're always looking for opportunities to educate and engage our community. 
                If you have suggestions for events or would like to collaborate, we'd love to hear from you.
              </p>
              <Button variant="outline">
                Contact Our Events Team
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default UpcomingEventsPage;