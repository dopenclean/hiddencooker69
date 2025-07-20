'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthSession } from './utils/auth';

export default function Home() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (checkAuthSession()) {
      router.push('/automation');
    }
  }, [router]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (password === 'cheeparnayT') {
      // Set session cookie with 24-hour expiration
      const expirationTime = new Date();
      expirationTime.setTime(expirationTime.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
      
      document.cookie = `auth_session=authenticated; expires=${expirationTime.toUTCString()}; path=/; secure; samesite=strict`;
      
      router.push('/automation');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

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
