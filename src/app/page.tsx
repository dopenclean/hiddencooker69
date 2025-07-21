'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthSession } from './utils/auth';

export default function Home() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (checkAuthSession()) {
      setShowOptions(true);
    }
  }, [router]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (password === 'cheeparnayT') {
      // Set session cookie with 24-hour expiration
      const expirationTime = new Date();
      expirationTime.setTime(expirationTime.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
      
      document.cookie = `auth_session=authenticated; expires=${expirationTime.toUTCString()}; path=/; secure; samesite=strict`;
      
      // Show options instead of redirecting directly
      setShowOptions(true);
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const handleZenithClick = () => {
    router.push('/automation');
  };

  const handleFaroClick = () => {
    router.push('/automation2');
  };

  // Show options after successful authentication
  if (showOptions) {
    return (
      <div className="homepage">
        <div className="container">
          <div className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>
              Choose Your Path
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="button"
                onClick={handleZenithClick}
                style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
              >
                Zenith
              </button>
              <button 
                className="button"
                onClick={handleFaroClick}
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem',
                  backgroundColor: '#22c55e',
                  cursor: 'pointer'
                }}
              >
                Faro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="container">
        <div className="card">
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoComplete="off"
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" className="button">
              Grant Access
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
