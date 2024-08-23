import { createSignal } from "solid-js";
import { useAppContext } from "../context";

const Home = () => {
  const [gameName, setGameName] = createSignal("");
  const [gameDescription, setGameDescription] = createSignal("");
  const [gameDatetime, setGameDatetime] = createSignal("");
  const [gameDuration, setGameDuration] = createSignal(0);
  const [tokens, setTokens] = useAppContext();

  const sendGame = async () => {
    let resp = await fetch("http://localhost:8000/api/trains/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens().access,
      },
      body: JSON.stringify({
        name: gameName(),
        description: gameDescription(),
        datetime: gameDatetime(),
        duration: gameDuration(),
      }),
    });
    if (resp.status == 201) {
      console.log("Game created");
    }
  };

  return (
    <div class="w-full flex flex-col content-center p-5 gap-10">
      <div class="flex flex-row justify-between">
        <h1 class="text-xl font-bold">
          <a href="/">CyberSportmans Fabric</a>
        </h1>
      </div>
      <form
        class="flex flex-col gap-5 w-min self-center"
        onSubmit={(e) => {
          e.preventDefault();
          sendGame();
        }}
      >
        <label>
          Game name:
          <input
            type="text"
            name="gameName"
            class="p-1"
            value={gameName()}
            onChange={(e) => {
              setGameName(e.target.value);
              console.log(gameName());
            }}
          />
        </label>
        <label>
          Game description:
          <textarea
            name="gameDescription"
            class="p-1"
            value={gameDescription()}
            onChange={(e) => setGameDescription(e.target.value)}
          />
        </label>
        <label>
          Game datetime
          <input
            type="datetime-local"
            name="gameDatetime"
            class="p-1"
            value={gameDatetime()}
            onChange={(e) => setGameDatetime(e.target.value)}
          />
        </label>
        <label>
          Game duration (in minutes)
          <input
            type="number"
            name="gameDuration"
            class="p-1"
            value={gameDuration()}
            onChange={(e) => setGameDuration(parseInt(e.target.value))}
          />
        </label>

        <button>Create</button>
      </form>
    </div>
  );
};

export default Home;
