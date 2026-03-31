import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { colors, fonts } from '../styles/tokens';
import Button from '../components/ui/Button';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.navy,
      fontFamily: fonts.body,
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        padding: '40px',
      }}>
        <h1 style={{
          fontFamily: fonts.heading,
          color: colors.cream,
          fontSize: '2.5rem',
          marginBottom: '16px',
        }}>
          Welcome to the 5C Blueprint
        </h1>
        <p style={{ color: '#c8cdd6', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Your payment was successful. You now have full access to all five modules of the 5C Leadership Blueprint.
        </p>
        <Button onClick={() => router.push('/dashboard')} style={{ marginTop: 24 }}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
