import "./Inform.css";
import { useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function Inform() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [placeList, setPlaceList] = useState([]);
  const [placeDetails, setPlaceDetails] = useState("");
  const [crime, setCrime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const classifyNews = async (news) => {
    axios
      .post("http://127.0.0.1:5000/classify-news", {
        news: news,
      })
      .then(async (res) => {
        console.log(`res: ${res.data}`);
        setCrime(await res.data);
      });
  };

  const handleSubmission = async (e) => {
    if (message === "" || location == "") {
      setErrorMessage("Please fill all fields");
    } else {
      setErrorMessage("");
      e.preventDefault();
      toast.success("Submitted Successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      await classifyNews(`${message} ${location}`);
      console.log(`Crime ${crime}`);
      try {
        const docRef = doc(
          db,
          "locations",
          placeDetails["display_name"].replace(/\//g, " ")
        );
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        console.log(placeDetails);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            weight:
              parseInt(
                await docSnap._document.data.value.mapValue.fields.weight
                  .integerValue
              ) + 1,
            robbery:
              crime === "Robbery"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields.robbery
                      .integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields.robbery
                      .integerValue
                  ),
            violence:
              crime === "Violence Against the Person"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields.violence
                      .integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields.violence
                      .integerValue
                  ),
            burglary:
              crime === "Burglary"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields.burglary
                      .integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields.burglary
                      .integerValue
                  ),
            theft_and_handling:
              crime === "Theft and Handling"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .theft_and_handling.integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .theft_and_handling.integerValue
                  ),
            criminal_damage:
              crime === "Criminal Damage"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .criminal_damage.integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .criminal_damage.integerValue
                  ),
            drug:
              crime === "Drugs"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields.drug
                      .integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields.drug
                      .integerValue
                  ),
            fraud:
              crime === "Fraud or Forgery"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields.fraud
                      .integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields.fraud
                      .integerValue
                  ),
            other_offence:
              crime === "Other Notifiable Offences"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .other_offence.integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .other_offence.integerValue
                  ),
            sexual_offence:
              crime === "Sexual Offences"
                ? parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .sexual_offence.integerValue
                  ) + 1
                : parseInt(
                    await docSnap._document.data.value.mapValue.fields
                      .sexual_offence.integerValue
                  ),
          });
          console.log("Document Updated");
        } else {
          var docRef2 = await addDoc(collection(db, "avoid_coordinates"), {
            lon: parseFloat(placeDetails["lat"]),
            lat: parseFloat(placeDetails["lon"]),
          });
          console.log("Avoid coordinates added");
          console.log(docRef2.id);

          await setDoc(
            doc(
              db,
              "locations",
              placeDetails["display_name"].replace(/\//g, " ")
            ),
            {
              coordinates: [
                parseFloat(placeDetails["lon"]),
                parseFloat(placeDetails["lat"]),
              ],
              weight: 1,
              robbery: crime === "Robbery" ? 1 : 0,
              violence: crime === "Violence Against the Person" ? 1 : 0,
              burglary: crime === "Burglary" ? 1 : 0,
              theft_and_handling: crime === "Theft and Handling" ? 1 : 0,
              criminal_damage: crime === "Criminal Damage" ? 1 : 0,
              drug: crime === "Drugs" ? 1 : 0,
              fraud: crime === "Fraud or Forgery" ? 1 : 0,
              other_offence: crime === "Other Notifiable Offences" ? 1 : 0,
              sexual_offence: crime === "Sexual Offences" ? 1 : 0,
            }
          );
          console.log("Successful");
        }
      } catch (err) {
        console.log("Could not save document");
        console.log(err.message);
      }
    }
  };

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
    <div className="info-container">
      <form className="form-container">
        <p>
          Kindly inform us if you have any news.
          <br />
          This will help us securing routes
        </p>
        <input
          className="form-input"
          placeholder="There was ..."
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <div className="search-container">
          <input
            className="form-input-field"
            placeholder="Enter location"
            type="text"
            required
            onChange={async (e) => {
              setLocation(e.target.value);
              setPlaceList([]);
            }}
            value={location}
          />
          <button
            className="form-search-btn"
            type="button"
            onClick={async () => setPlaceList(await getLocation(location))}
          >
            Search
          </button>
        </div>
        {placeList.length > 0 ? (
          <div className="form-list-container">
            <ul className="place-list">
              {placeList.map((place, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setLocation(place.display_name);
                      setPlaceDetails(place);
                      setPlaceList([]);
                    }}
                  >
                    {place.display_name}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {errorMessage !== "" ? (
          <div className="error-message">{errorMessage}</div>
        ) : null}
        <button className="form-submit-btn" onClick={handleSubmission}>
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
