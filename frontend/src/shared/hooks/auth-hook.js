import { useCallback, useEffect, useState } from "react";
let tokenTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback(
    (uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
      );
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.token && new Date(userData.expiration) > new Date()) {
      login(userData.token, userData.userId, new Date(userData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      tokenTimer = setTimeout(logout, tokenExpirationDate.getTime() - new Date().getTime());
    } else {
      clearTimeout(tokenTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { token, userId, login, logout };
};

export default useAuth;
