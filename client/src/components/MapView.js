import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { Icon } from "leaflet";
// import LocationMarker from "./LocationMarker";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { CREATE_FAVORITE } from "../utils/mutations";
import "./index.css";
function isRecentlyUpdated(timeStamp) {
  const unixTimestamp = Date.parse(timeStamp);
  const currentTime = Date.now();
  const difference = currentTime - unixTimestamp;
  if (difference < 45000) {
    return true;
  } else {
    return false;
  }
}

const MapView = ({ positions }) => {
  // const { loading, data } = useQuery(QUERY_USER);
  // const [addFavorite, { error }] = useMutation(CREATE_FAVORITE);

  // const user = data?.me || data?.user || {};
  let icon;
  const bikeBlue = new Icon({
    iconUrl: "./bikePurple.png",
    iconSize: [25, 25],
  });
  const bikeRed = new Icon({
    iconUrl: "./bikeRed.png",
    iconSize: [25, 25],
  });

  const bikeGreen = new Icon({
    iconUrl: "./bikeGreen.png",
    iconSize: [25, 25],
  });

  const newBikeIn = new Icon({
    iconUrl: "./bike-in.png",
    iconSize: [35, 35],
  });

  const newBikeOut = new Icon({
    iconUrl: "./bike-out.png",
    iconSize: [35, 35],
  });

  const handleFavorite = async (event) => {
    event.preventDefault();
    const lat = parseFloat(event.target.dataset.lat);
    const lon = parseFloat(event.target.dataset.lon);
    const name = event.target.dataset.name;
    console.log(lat, lon);
    //add favorite mutation
    try {
      // const {data} = await addFavorite({
      //   variables: {
      //     lat,
      //     lon,
      //     name
      //   }
      // })
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MapContainer
      center={[40.00811, -105.26385]}
      zoom={14}
      scrollWheelZoom={true}
      className="container is-centered"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors<li>Bike back&nbsp;&nbsp; <img src="./bike-in-sm.png">&nbsp;&nbsp; | &nbsp; Bike out &nbsp; <img src="./bike-out-sm.png">&nbsp;</li>
       <ul> <li><strong>6 +<img src="./bikeGreenSm.png">&nbsp;&nbsp;| &nbsp; up to 5 &nbsp;<img src="./bikePurpleSm.png">&nbsp; &nbsp;|&nbsp;&nbsp; 0 bikes<img src="./bikeRedSm.png"></strong</li></ul>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.map((position) => {
        let polygon = <></>;
        if (position.availableBikes === 0) {
          icon = bikeRed;
        }
        if (position.availableBikes <= 5 && position.availableBikes > 0) {
          icon = bikeBlue;
        }
        if (position.availableBikes >= 6) {
          icon = bikeGreen;
        }

        if (position.count === "increase" || position.count === "decrease") {
          // let color = "";
          let changeIcon;
          if (position.count === "increase") {
            // color = "#4fff33";
            changeIcon = newBikeIn;
          }
          if (position.count === "decrease") {
            // color = "#ff3368";
            changeIcon = newBikeOut;
          }

          polygon = (
            <Marker
              position={[position.location.lat, position.location.lon]}
              key={`marker_${position.uuid}_${Date.now()}`}
              icon={changeIcon}
            ></Marker>
          );

          //     polygon2 = (
          //       <CircleMarker
          //         center={[position.location.lat, position.location.lon]}
          //         radius={12}
          //         key={`circle_${position.uuid}`}
          //         pathOptions={{ color: color }}
          //       />
          //     );
          // */
        }
        return (
          <>
            <Marker
              position={[position.location.lat, position.location.lon]}
              key={position.uuid}
              icon={icon}
            >
              <Popup key={`popup_${position.uuid}`}>
                <h4 className="has-text-centered	">{position.name}</h4>
                <h6 className="has-text-centered	">
                  Available bikes: {position.availableBikes}
                  <br />
                  {/* Empty slots: {position.emptySlots}< br /> */}
                  Latitude: {position.location.lat}
                  <br />
                  Longitude: {position.location.lon}
                  <br />
                </h6>
                {/* {user?.username && (
              <button
                data-lat={position.location.lat}
                data-lon={position.location.lon}
                data-name={position.name}
                onClick={handleFavorite}
                className="button is-info"
              >
                Add to favorites
              </button>
            )} */}
              </Popup>
            </Marker>
            {polygon}
          </>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
