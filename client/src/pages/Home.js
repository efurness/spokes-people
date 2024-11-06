import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import "bulma/css/bulma.min.css";
import "./index.css";
// import { stat } from "fs";

export default function Home() {
  const [positions, setPositions] = useState([]);
  const [freeBikes, setFreeBikes] = useState({});
  // let freeBikes = [];
  useEffect(() => {
    getData();
    setInterval(() => {
      getData();
    }, 3 * 60 * 1000);
  }, []);

  // const currentDate = new Date();
  // const thirtySecondsAgo = new Date(currentDate.getTime() - 30000);
  // console.log(isRecentlyUpdated(thirtySecondsAgo.toISOString()));

  useEffect(() => {
    const iframe = document.querySelector("iframe");
    iframe?.remove();
  }, [positions]);

  function createUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  async function getData() {
    let bikes = [];
    try {
      const response = await fetch("https://api.citybik.es/v2/networks/");
      const networks = await response.json();
      const usNetworks = networks.networks
        .filter((network) => network.location.country === "US")
        .slice(0, 20);
      const api = "https://api.citybik.es";
      const fetchPromises = usNetworks.map((network) => {
        if (network.id !== "boulder" && network.id !== "denver") return;

        return fetch(api + network.href)
          .then((response) => response.json())
          .then((data) => {
            const stations = data.network.stations;
            for (let j = 0; j < stations.length; j++) {
              const station = stations[j];
              let count = "noChange";
              if (freeBikes[station.name]) {
                if (station.free_bikes > freeBikes[station.name]) {
                  count = "increase";
                }
                if (station.free_bikes < freeBikes[station.name]) {
                  count = "decrease";
                }
              }

              freeBikes[station.name] = station.free_bikes;
              setFreeBikes(freeBikes);
              bikes.push({
                name: station.name,
                count: count,
                location: { lat: station.latitude, lon: station.longitude },
                emptySlots: station.empty_slots,
                availableBikes: station.free_bikes,
                timestamp: stations[j].timestamp,
                uuid: createUUID(),
              });
            }
          });
      });
      await Promise.all(fetchPromises);
      setPositions(bikes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div>
      <section className="hero has-background-info is-align-items-center">
        <div className="hero-body">
          <p className="title has-text-light">
            Spokes
            <img src="./coolBike.png" alt="bike" width="80" height="100"></img>
            Boulder
          </p>
        </div>
      </section>

      <div className="container">
        <div className="title is-parent">
          <article className="title is-child notification is-info-light">
            <div className="content">
              <p className="title ">Find bikes near you!</p>
              <div className="container">
                {" "}
                <MapView positions={positions} />
              </div>
            </div>
          </article>
        </div>
      </div>
      <footer className="footer has-background-info">
        <div className="content has-text-centered has-text-light">
          <p>
            CSS by
            <strong className="has-text-light"> Bulma</strong> site by{" "}
            <a
              className="has-text-primary"
              href="https://github.com/efurness/spokes-people.git"
            >
              {" "}
              &nbsp; Current project by Ellen Furness
            </a>
            &nbsp; 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
