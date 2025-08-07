import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabase } from '../supabase';
import { toast } from '../utils/toast';
import ShareTheMovement from '../components/common/ShareTheMovement';
import { useAuth } from '../contexts/AuthContext';

const ReferFriendForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [emails, setEmails] = useState<string[]>(['']);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTotalInvites, setNewTotalInvites] = useState(0);

  const sampleMessage = 'Thinking of you! I found this really important, and wanted to share.';
  
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };
  
  const addEmailField = () => {
    if (emails.length < 5) setEmails([...emails, '']);
  };
  
  const removeEmailField = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const validEmails = emails.map(email => email.trim()).filter(email => /\S+@\S+\.\S+/.test(email));
    
    if (validEmails.length === 0) {
      setError('Please enter at least one valid email address.');
      setLoading(false);
      return;
    }
    
    try {
      // Get current user
      if (!user) {
        throw new Error('You must be logged in to refer a friend.');
      }
      
      const referrerName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'A friend';
      
      let successes = 0;
      let failures = 0;
      
      for (const email of validEmails) {
        try {
          // Insert referral record
          const { error: insertError } = await supabase.from('referrals').insert([{
            referrer_id: user.id,
            referred_email: email,
            message: message || null,
            status: 'pending',
            user_id: user.id
          }]);
          
          if (insertError) throw insertError;
          
          // Try to send email via edge function
          try {
            const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-referral-email`;
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
            
            if (!endpoint || !supabaseKey) {
              throw new Error('Email service configuration missing');
            }

            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
              },
              body: JSON.stringify({
                to: email,
                referrerName,
                personalMessage: message || '',
                referralLink: `${window.location.origin}/signup/champion?ref=${user.id}`
              })
            });

            let result;
            try {
              result = await response.json();
            } catch (parseError) {
              console.error('Failed to parse email response:', parseError);
              throw new Error('Invalid response from email service');
            }

            if (!response.ok) {
              throw new Error(result?.error || result?.details || `Email service error (${response.status})`);
            }

            if (!result?.success) {
              throw new Error(result?.error || result?.details || 'Failed to send email');
            }
            
            console.log(`✅ Email sent successfully to ${email}:`, result);
            successes++;
          } catch (emailError) {
            console.error(`❌ Email sending failed for ${email}:`, emailError);
            // Still count as success since the referral was recorded
            successes++;
          }
        } catch (individualError) {
          console.error(`Failed to process referral for ${email}:`, individualError);
          failures++;
        }
      }
      
      if (successes > 0) {
        // Update the user's friends_invited count
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('friends_invited')
            .eq('id', user.id)
            .single();
          
          const currentCount = profileData?.friends_invited || 0;
          const updatedCount = currentCount + successes;
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ friends_invited: updatedCount })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating invitation count:', updateError);
            throw updateError;
          }
          
          // Refresh the profile to get updated counts
          await refreshProfile();
          
          // Get the updated count after refresh
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('friends_invited')
            .eq('id', user.id)
            .single();
            
          setNewTotalInvites(updatedProfile?.friends_invited || updatedCount);
        } catch (countError) {
          console.error('Error updating invitation count:', countError);
        }
        
        // Show success message
        toast.success(`Successfully sent ${successes} invitation${successes !== 1 ? 's' : ''}!`);
      }
      
      if (failures > 0) {
        setError(`Successfully sent ${successes} invitation${successes !== 1 ? 's' : ''}, but ${failures} failed.`);
      }
      
      setLoading(false);
      setSuccess(true);
      setEmails(['']);
      setMessage('');
      
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 md:pt-32">
        <div className="max-w-2xl mx-auto p-4 text-center">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold text-green-600">You're a True Champion!</h1>
            <p className="mt-4 text-lg text-gray-700">{error ? error : `Your invitation${emails.length > 1 ? 's have' : ' has'} been sent!`}</p>
            <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">Your Impact</h3>
              <p className="mt-2 text-5xl font-bold text-blue-600">{newTotalInvites}</p>
              <p className="mt-1 text-lg text-blue-700">Friends Invited</p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => { setSuccess(false); setError(null); }}>Refer More Friends</Button>
                <Button size="lg" variant="outline" onClick={() => navigate(-1)}>Back to Dashboard</Button>
              </div>

              <div className="pt-6 border-t">
                <ShareTheMovement />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold">Become a Lifesaver</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto px-4">Every invitation is a lifeline. You have the power to share knowledge that could save someone you care about.</p>
      </div>
      <div className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Refer Your Friends to Project COLONAiVE</h2>
            <p className="mt-2 text-gray-600">You're not just sending an email; you're starting a conversation that matters. Invite up to 5 friends at a time.</p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <label className="block text-gray-700 font-medium mb-2">Friend's Email(s) <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => handleEmailChange(index, e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        placeholder={`friend${index + 1}@example.com`} 
                      />
                      {emails.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeEmailField(index)} 
                          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {emails.length < 5 && (
                  <button 
                    type="button" 
                    onClick={addEmailField} 
                    className="text-sm text-blue-600 hover:underline mt-2 font-medium"
                  >
                    + Add another friend
                  </button>
                )}
                <div className="my-6">
                  <label className="block text-gray-700 font-medium mb-2">Personal Message (Optional)</label>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    placeholder={sampleMessage} 
                    rows={4} 
                  />
                  <div className="text-right mt-1">
                    <button 
                      type="button" 
                      onClick={() => setMessage(sampleMessage)} 
                      className="text-sm text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Use sample message
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full text-lg py-3"
                >
                  {loading ? 'Sending...' : 'Send Lifesaving Invitations'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReferFriendForm;