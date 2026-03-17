import { useState, useCallback } from 'react';

export function useTxStatus() {
    // status can be 'idle', 'pending', 'success', 'failed'
    const [status, setStatus] = useState('idle');
    const [hash, setHash] = useState(null);
    const [error, setError] = useState(null);

    const setLoading = useCallback(() => {
        setStatus('pending');
        setHash(null);
        setError(null);
    }, []);

    const setSuccess = useCallback((txHash) => {
        setStatus('success');
        setHash(txHash);
        setError(null);
    }, []);

    const setFailed = useCallback((errorMessage) => {
        setStatus('failed');
        setHash(null);
        setError(errorMessage);
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setHash(null);
        setError(null);
    }, []);

    return {
        status,
        hash,
        error,
        setLoading,
        setSuccess,
        setFailed,
        reset
    };
}
