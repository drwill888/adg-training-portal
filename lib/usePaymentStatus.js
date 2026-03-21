import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function usePaymentStatus() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPayment() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
          setPaid(false);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('payments')
          .select('id')
          .eq('email', session.user.email)
          .eq('status', 'completed')
          .limit(1);

        if (data && data.length > 0) {
          setPaid(true);
        }
      } catch (err) {
        console.error('Payment check error:', err);
      }
      setLoading(false);
    }

    checkPayment();
  }, []);

  return { paid, loading };
} 