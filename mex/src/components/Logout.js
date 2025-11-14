import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { logout } from '../reducers/authReducer';


export const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  return null; // Рендеринг пустого компонента, так как перенаправление осуществляется с помощью Navigate
};