import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/auth.context";
import { Loader } from "../components/Loader";
import { ChecksList } from "../components/ChecksList";

export const ChecksPage = () => {
  const [checks, setChecks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const fetchChecks = useCallback(async () => {
    try {
      const fetched = await request("/api/check", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setChecks(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && <ChecksList checks={checks} />}</>;
};
