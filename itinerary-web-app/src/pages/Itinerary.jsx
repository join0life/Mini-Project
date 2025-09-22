import LNB from "../components/LNB";
import ItineraryList from "../components/ItineraryList";
import "./Itinerary.css";
import { setPageTitle } from "../components/util.jsx";
import { useEffect } from "react";

function Itinerary() {
  useEffect(() => {
    setPageTitle("여행 계획표");
  }, []);

  return (
    <div className="Itinerary">
      <LNB />
      <div className="ItineraryLists">
        <ItineraryList userName={"호빵"} />
        <ItineraryList userName={"단팥"} />
        <ItineraryList userName={"베까"} />
        <ItineraryList userName={"틴틴"} />
      </div>
    </div>
  );
}

export default Itinerary;
