//src\pages\SellingPage.jsx
import { useState } from 'react';

export default function SellingPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send email to backend or save email)
    alert(`Thank you for subscribing with email: ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white">
      <div className="text-center p-8 space-y-6">
        <h1 className="text-5xl font-extrabold">Coming Soon</h1>
        <p className="text-xl">We're working hard to bring something great to you.</p>
        <p className="mt-4 text-lg">Stay tuned for updates!</p>
        
        {/* Call to Action: Email Subscription */}
        <div className="mt-8">
          <p className="mb-4">Sign up to be notified when we launch:</p>
          <form onSubmit={handleSubmit} className="flex justify-center">
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded-l-lg text-gray-800"
            />
            <button 
              type="submit" 
              className="p-3 bg-yellow-500 text-gray-800 font-semibold rounded-r-lg hover:bg-yellow-400"
            >
              Notify Me
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}