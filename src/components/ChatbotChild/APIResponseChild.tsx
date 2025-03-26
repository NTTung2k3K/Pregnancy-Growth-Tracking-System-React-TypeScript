import  { useEffect, useState } from "react";

const APIResponseChild = ({ triggerNextStep }: any) => {
  const [response, setResponse] = useState("Fetching a joke...");

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const res = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
        const data = await res.json();
        setResponse(data.joke || "Couldn't fetch a joke 😢");
        setTimeout(() => triggerNextStep(), 3000); // Move to next step after 3s
      } catch (error) {
        setResponse("Error fetching joke.");
      }
    };

    fetchJoke();
  }, [triggerNextStep]);

  return <div>{response}</div>;
};

export default APIResponseChild;
