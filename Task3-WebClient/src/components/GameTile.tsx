import { Component, createSignal, Show } from "solid-js";
import { GameModel } from "../models";
import Button from "../components/Button";
import { useAppContext } from "../context";

export interface GameTileProps {
  game: GameModel;
  joined: boolean;
}

const GameTile: Component<GameTileProps> = (props) => {
  const [tokens, _] = useAppContext();
  const [textBtn, setTextBtn] = createSignal("Join");
  const addToTrain = async () => {
    let resp = await fetch(
      `http://localhost:8000/api/trains/${props.game.id}/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens().access,
        },
      },
    );
  };

  return (
    <div class="border-4 rounded-3xl border-primary p-20 w-2/3 self-center">
      <div class="flex flex-row justify-between">
        <p>{props.game.name}</p>
        <p>
          {props.game.datetime} + {props.game.duration} seconds
        </p>
      </div>
      <div>
        <p class="text-left">{props.game.description}</p>
        <p class="text-right">{props.game.trainerId}</p>
      </div>
      <Show
        when={props.joined}
        fallback={
          <Button
            text={textBtn()}
            onClick={() => {
              addToTrain();
              setTextBtn("Joined");
            }}
          />
        }
      >
        <div class="flex flex-row gap-2">
          <Button text="Joined" onClick={() => {}} />
          <a href={`/statistic/${props.game.id}`}>View Statistic</a>
        </div>
      </Show>
    </div>
  );
};

export default GameTile;
