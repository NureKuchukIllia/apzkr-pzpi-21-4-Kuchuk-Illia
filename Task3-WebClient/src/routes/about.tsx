import { Title } from "@solidjs/meta";
import { For, createSignal, createEffect } from "solid-js";
import { useAppContext } from "../context";
import { GameModel } from "../models";
import GameTile from "../components/GameTile";

const About = () => {
  const [tokens, setTokens, deleteTokens] = useAppContext();
  const [games, setGames] = createSignal([] as GameModel[]);

  createEffect(async () => {
    let resp = await fetch("http://localhost:8000/api/me/trainings", {
      headers: {
        Authorization: `Bearer ${tokens().access}`,
      },
      method: "GET",
    });
    const data = await resp.json();

    resp = await fetch("http://localhost:8000/api/trains", {
      headers: {
        Authorization: `Bearer ${tokens().access}`,
      },
      method: "GET",
    });
    const gamesData = await resp.json();
    gamesData.filter((game: GameModel) => {
      if (data.includes(game.id)) {
        setGames((prev) => [...prev, game]);
      }
    });
  });

  return (
    <>
      <header class="flex flex-row justify-between p-10">
        <h1 class="text-xl font-bold">
          <a href="/">CyberSportmans Fabric</a>
        </h1>
      </header>
      <div>
        <Title>Profile</Title>
        <h1>Games: </h1>
        <For each={games()} fallback={<div>Loading...</div>}>
          {(game) => <GameTile game={game} joined={true} />}
        </For>
      </div>
    </>
  );
};

export default About;
