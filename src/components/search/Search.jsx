import { useState } from "react";
import "./Search.css";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const routeLocations = [];

function SearchBox(props) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupPlaceList, setPickupPlaceList] = useState([]);
  const [dropoffPlaceList, setDropoffPlaceList] = useState([]);

  const { updateCurrentMap } = props;

  const getLocation = async (searchText) => {
    var places = [];
    const params = {
      q: searchText,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    await fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        places = JSON.parse(result);
      })
      .catch((err) => console.log(`err: ${err}`));
    return places;
  };

  return (
    <div className="section-container">
      <div className="search-container">
        <input
          className="input-field"
          placeholder="Enter pickup location"
          type="text"
          required
          onChange={(e) => {
            updateCurrentMap("");
            setPickupLocation(e.target.value);
            setPickupPlaceList([]);
          }}
          value={pickupLocation}
        />
        <button
          className="search-btn"
          type="submit"
          onClick={async () =>
            setPickupPlaceList(await getLocation(pickupLocation))
          }
        >
          Search
        </button>
      </div>
      {pickupPlaceList.length > 0 ? (
        <div className="list-container">
          <ul className="place-list">
            {pickupPlaceList.map((place, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    routeLocations[0] = place;
                    setPickupLocation(place.display_name);
                    setPickupPlaceList([]);
                  }}
                >
                  {place.display_name}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="search-container">
        <input
          className="input-field"
          placeholder="Enter dropoff location"
          type="text"
          required
          onChange={(e) => {
            updateCurrentMap("");
            setDropoffLocation(e.target.value);
            setDropoffPlaceList([]);
          }}
          value={dropoffLocation}
        />
        <button
          className="search-btn"
          type="submit"
          onClick={async () =>
            setDropoffPlaceList(await getLocation(dropoffLocation))
          }
        >
          Search
        </button>
      </div>
      {dropoffPlaceList.length > 0 ? (
        <div className="list-container">
          <ul className="place-list">
            {dropoffPlaceList.map((place, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    routeLocations[1] = place;
                    setDropoffLocation(place.display_name);
                    setDropoffPlaceList([]);
                  }}
                >
                  {place.display_name}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <button
        className="submit-btn"
        type="submit"
        onClick={() => {
          console.log(routeLocations);
          updateCurrentMap(routeLocations);
        }}
      >
        Generate Safe Route
      </button>
    </div>
  );
}

export default SearchBox;
