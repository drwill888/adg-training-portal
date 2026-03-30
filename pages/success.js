import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { colors, fonts } from '../styles/tokens';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cream,
      fontFamily: fonts.body,
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        padding: '40px',
      }}>
        <h1 style={{
          fontFamily: fonts.heading,
          color: colors.navy,
          fontSize: '2.5rem',
          marginBottom: '16px',
        }}>
          Welcome to the 5C Blueprint
        </h1>
        <p style={{ color: colors.navy, fontSize: '1.1rem', lineHeight: '1.6' }}>
          Your payment was successful. You now have full access to all five modules of the 5C Leadership Blueprint.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            marginTop: '24px',
            padding: '12px 32px',
            backgroundColor: colors.gold,
            color: colors.navy,
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
} 