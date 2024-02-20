import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      console.log(userId);
      console.log(`${process.env.REACT_APP_SERVER_URL}/places/user/${userId}`);
      try {
        const data = await sendRequest(`${process.env.REACT_APP_SERVER_URL}/places/user/${userId}`);
        setPlaces(data.places);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const onPlaceDeleteHandler = (id) => {
    setPlaces((prevPlaces) => prevPlaces.filter((p) => p.id !== id));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && places && <PlaceList items={places} onDelete={onPlaceDeleteHandler} />}
    </React.Fragment>
  );
};

export default UserPlaces;
