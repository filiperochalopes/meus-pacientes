import * as api from "services/apiClient";
import AppContext from "services/context";

import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

export default ({ children }) => {
  const { loggedIn, setLoggedIn } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedIn) {
      api
        .refreshToken()
        .then(() => {
          setLoggedIn(true);
        })
        .catch((error) => console.log("refresh_token Error: ", error))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loggedIn, setLoggedIn]);

  return loading ? (
    [children]
  ) : loggedIn ? (
    <div className="private_page">{children}</div>
  ) : (
    <Redirect to="/login" />
  );
};
