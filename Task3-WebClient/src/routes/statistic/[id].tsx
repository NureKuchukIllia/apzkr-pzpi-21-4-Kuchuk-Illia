import { createSignal, createEffect, For } from "solid-js";
import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";

import { useAppContext } from "../../context";

const Home = () => {
  const params = useParams();
  const [tokens, _] = useAppContext();
  const [imgUrl, setImgUrl] = createSignal("");
  const [heartRates, setHeartRates] = createSignal([] as number[]);

  const updateImg = async () => {
    let resp = await fetch(
      `http://localhost:8000/api/trains/${params.id}/end/photo`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    let data = await resp.json();
    setImgUrl(`http://localhost:8000/static/${data.filename}`);

    resp = await fetch(`http://localhost:8000/api/trains/${params.id}/end`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await resp.json();
    console.log(data);
    setHeartRates(data.heard_rates);
  };

  createEffect(updateImg);
  setInterval(updateImg, 10000);

  return (
    <>
      <header class="flex flex-row justify-between p-10">
        <h1 class="text-xl font-bold">
          <a href="/">CyberSportmans Fabric</a>
        </h1>
      </header>
      <main>
        <Title>Statistic</Title>
        <h1>Statistic</h1>
        <p>Statistic page content of {params.id}</p>
        <img src={imgUrl()}></img>
        <ul>
          <li>
            {" "}
            Average heart rates:{" "}
            {heartRates().reduce((a, b) => a + b, 0) / heartRates().length}{" "}
          </li>
        </ul>
      </main>
    </>
  );
};

export default Home;
