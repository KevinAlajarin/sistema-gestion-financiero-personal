import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';

const useTransactions = (initialFilters = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionService.getAll(filters);
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        filters,
        setFilters,
        refresh: fetchTransactions
    };
};

export default useTransactions;