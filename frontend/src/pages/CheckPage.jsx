import React, { useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/auth.context";
import M from "materialize-css";

export const CheckPage = () => {
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const symbOne = React.useRef(null);
  const symbTwo = React.useRef(null);

  React.useEffect(() => {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems, {});
  }, []);

  const checkHandler = async () => {
    if (!symbOne.current.value && !symbTwo.current.value) {
      window.M.toast({
        html: "Specify values in all fields.",
      });
    } else {
      try {
        M.toast({
          html: `Loading data...`,
          classes: "blue-grey",
        });
        const data = await request(
          "api/check",
          "POST",
          {
            pair: symbOne.current.value,
            interval: symbTwo.current.value,
            owner: auth.code,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        const { check, lastCheck } = data;
        console.log("Check: ", check);
        console.log("lastCheck: ", lastCheck);
        if (!lastCheck) {
          M.toast({
            html: `Starting price tracking. Current value: ${check.price}`,
            classes: "blue darken-1",
          });
        } else {
          let priceDifference;
          lastCheck.price === check.price
            ? (priceDifference = 0)
            : (priceDifference = +(
                ((lastCheck.price - check.price) /
                  ((lastCheck.price + check.price) / 2)) *
                100
              ).toFixed(2));
          priceDifference === 0
            ? M.toast({
                html: `Don't worry, price is the same: ${check.price}\n(Interval: ${check.interval})`,
                classes: "blue darken-1",
              })
            : priceDifference < 0
            ? M.toast({
                html: `Good for you, price went up: +${Math.abs(
                  priceDifference
                )}%\n(Interval: ${check.interval})`,
                classes: "light-green",
              })
            : M.toast({
                html: `I hate to say it, price went down: ${priceDifference}%\n(Interval: ${check.interval})`,
                classes: "red darken-1",
              });
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  };

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: "2rem" }}>
        <div className="row s12">
          <div className="card check-card">
            <div className="input-field col s6">
              <select ref={symbOne}>
                <option value="" disabled selected>
                  Choose market
                </option>
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/BTC">ETH/BTC</option>
                <option value="XRP/BTC">XRP/BTC</option>
                <option value="BTC/BRL">BTC/BRL</option>
                <option value="ETH/RUB">ETH/RUB</option>
                <option value="ZEC/USDT">ZEC/USDT</option>
                <option value="BTC/EUR">BTC/EUR</option>
                <option value="SRM/BIDR">SRM/BIDR</option>
                <option value="BTC/USDC">BTC/USDC</option>
                <option value="YFII/USDT">YFII/USDT</option>
              </select>
              <label>Market</label>
            </div>
            <div className="input-field col s6">
              <select ref={symbTwo}>
                <option value="" disabled selected>
                  Choose Interval
                </option>
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="12h">12 hours</option>
                <option value="1d">1 day</option>
                <option value="3d">3 days</option>
              </select>
              <label>Interval</label>
            </div>
            <a
              className="waves-effect waves-light btn-large check-button"
              onClick={checkHandler}
            >
              Check!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
