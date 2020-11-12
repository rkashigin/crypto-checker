import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState(null);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setCode(id);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        code: id,
        token: jwtToken,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setCode(null);

    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.code);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, code, ready };
};
