import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBox from "../../components/search/Search";
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
  const [displayMap, setDisplayMap] = useState("");
  const [currentMap, updateCurrentMap] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMap();
    if (currentMap.length) getMap();
  }, [currentMap]);

  const getMap = async () => {
    setLoading(true);
    axios
      .post("http://127.0.0.1:5000/iframe", {
        pickup:
          currentMap == "" ? "" : [currentMap[0]["lon"], currentMap[0]["lat"]],
        dropoff:
          currentMap == "" ? "" : [currentMap[1]["lon"], currentMap[1]["lat"]],
      })
      .then((res) => {
        setDisplayMap(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="body-continer">
        <div className="main-container">
          {loading ? (
            <div className="spinner-container">
              <ClipLoader
                color={"#ffffff"}
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <div
              className="map-container"
              dangerouslySetInnerHTML={{ __html: displayMap }}
            />
          )}
          <h2 className="search-container">
            <SearchBox updateCurrentMap={updateCurrentMap} />
          </h2>
        </div>
      </div>
    </>
  );
}
