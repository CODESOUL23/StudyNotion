import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/authSlice';
import { setUser } from '../slices/profileSlice';

const useAuthPersistence = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkLoginExpiry = () => {
            const loginTime = localStorage.getItem('loginTime');
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (loginTime && token && user) {
                const currentTime = Date.now();
                const timeDifference = currentTime - parseInt(loginTime);
                const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

                if (timeDifference > twentyFourHours) {
                    // Login expired, clear everything
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('loginTime');
                    dispatch(setToken(null));
                    dispatch(setUser(null));
                } else {
                    // Login still valid, restore session
                    dispatch(setToken(JSON.parse(token)));
                    dispatch(setUser(JSON.parse(user)));
                }
            }
        };

        checkLoginExpiry();
    }, [dispatch]);
};

export default useAuthPersistence;
