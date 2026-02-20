"use client";
import React, { act } from "react";
import {
  ConsolidatedDisplayData,
  useActionProcessor,
} from "../hooks/useActionProcessor";
import { getById, getLocation } from "../utils/action";

interface Rick {
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface Location{
  name: string;
  type: string;
  dimension: string;
}

type ConsolidateData = Rick | Location;

export const GetRick = () => {
  const [data, setData] = React.useState<ConsolidatedDisplayData<ConsolidateData> | null>(
    null
  );
  const [id, setId] = React.useState("");
  const { actionState, handlerAction, isPending } = useActionProcessor<
    Rick,
    { id: string }
  >({
    action: getById,
    initialActionState: null,
    globalSetter: setData,
    name: "get-rick",
  });
  const {
    actionState: actionStateLocation,
    handlerAction: handlerActionLocation,
    isPending: isPendingLocation,
  } = useActionProcessor<
    Location,
    { id: string }
  >({
    action: getLocation,
    initialActionState: null,
    globalSetter: setData,
    name: "get-location",
  });
  return (
    <div>
      <h1>Get Rick</h1>
      <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={()=> handlerAction({id: id})}>Get Rick</button>
      <button onClick={()=> handlerActionLocation({id: id})}>Get Location</button>
      {isPending && <p>Loading...</p>}
      {isPendingLocation && <p>Loading...</p>}
      {data && data.success && (
        <div>
          <h1>Se ha obtenido el rick</h1>
          {data.items && (
            <div>
              {/* <h1>{data.items.name}</h1>
              <p>{data.items.status}</p>
              <p>{data.items.species}</p>
              <p>{data.items.gender}</p>
              <img src={data.items.image} alt={data.items.name} /> */}
              {
                Object.keys(data.items).map((key) => {
                  if (typeof data.items[key] !== "object"){
                    return <p key={key}>{key}: {data.items[key]}</p>
                  }
                })
              }
            </div>
          )}
        </div>
      )}
      {data && !data.success && (
        <div>
          <h1>No se ha obtenido el rick</h1>
          <p>{data.error?.message}</p>
        </div>
      )}
    </div>
  );
};
