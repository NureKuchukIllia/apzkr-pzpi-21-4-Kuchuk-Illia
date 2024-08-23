import { Title } from "@solidjs/meta";
import { createSignal, For, Show, createEffect } from "solid-js";
import { redirect } from "@solidjs/router";
import GameTile from "../components/GameTile";
import Button from "../components/Button";
import { GameModel } from "../models";
import { useAppContext } from "../context";

export default function Home() {
  const [games, setGames] = createSignal([] as GameModel[]);
  const [joined, setJoined] = createSignal([] as number[]);
  const [tokens, setTokens, deleteTokens] = useAppContext();
  const [isTrainer, setIsTrainer] = createSignal(false);
  setGames([
    {
      id: 1,
      name: "Game 1",
      description: "Game 1 description",
      datetime: "2021-09-01T12:00:00",
      duration: 60,
      trainerId: 1,
    },
  ]);
  createEffect(async () => {
    let resp = await fetch("http://localhost:8000/api/trains/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens().access,
      },
    });
    if (resp.status == 200) {
      let data = await resp.json();
      console.log(data);
      setGames(data);
    }

    resp = await fetch("http://localhost:8000/api/me/trainings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens().access,
      },
    });
    if (resp.status == 200) {
      let data = await resp.json();
      console.log(data);
      setJoined(data);
    }
    resp = await fetch("http://localhost:8000/api/me/is_trainer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens().access,
      },
    });
    let data = await resp.json();
    console.log(data);
    setIsTrainer(data.isTrainer);
  }, 0);

  return (
    <>
      <header class="flex flex-row justify-between p-10">
        <h1 class="text-xl font-bold">
          <a href="/">CyberSportmans Fabric</a>
        </h1>
        <ul>
          <li class="flex flex-row gap-3">
            <Show
              when={tokens().access != ""}
              fallback={
                <a
                  href="/auth"
                  class="bg-primary text-white p-2 rounded-lg w-max self-center"
                >
                  Auth
                </a>
              }
            >
              <a
                href="/about"
                class="bg-primary text-white p-2 rounded-lg w-max self-center"
              >
                About
              </a>
              <Button onClick={deleteTokens} text="Logout" />
            </Show>
          </li>
        </ul>
      </header>
      <main>
        <Title>Home</Title>
        <div class="flex flex-col gap-10">
          <For each={games()}>
            {(game) => (
              <GameTile joined={joined().includes(game.id)} game={game} />
            )}
          </For>
          <Show when={isTrainer()}>
            <a href="/new-game" class="self-center">
              <Button text="Make new train" onClick={() => {}} />
            </a>
          </Show>
        </div>
      </main>
    </>
  );
}
