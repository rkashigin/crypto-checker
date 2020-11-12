import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ChecksPage } from "./pages/ChecksPage";
import { CheckPage } from "./pages/CheckPage";
import { AuthPage } from "./pages/AuthPage";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/history" exact>
          <ChecksPage />
        </Route>
        <Route path="/check" exact>
          <CheckPage />
        </Route>
        <Redirect to="/check" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
