import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import { redirect } from "@solidjs/router";

import { useAppContext } from "../context";

const Register = () => {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [age, setAge] = createSignal(0);
  const [isTrainer, setIsTrainer] = createSignal(false);

  const registerUser = async () => {
    let resp = await fetch(
      `http://localhost:8000/api/${isTrainer() ? "trainer/" : ""}register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name(),
          email: email(),
          password: password(),
          age: age(),
        }),
      },
    );
    if (resp.status == 201) {
      console.log("User created");
    }
  };

  return (
    <>
      <form
        class="flex flex-col gap-4 m-4"
        onSubmit={(e) => {
          e.preventDefault();
          registerUser();
          return redirect("/");
        }}
      >
        <label>Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={name()}
          onInput={(e) => setName(e.target.value)}
        />
        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
        />
        <label>Age:</label>
        <input
          type="number"
          placeholder="Age"
          value={age()}
          onInput={(e) => setAge(parseInt(e.target.value))}
        />
        <label class="flex flex-col gap-1">
          Role:
          <p>
            <input
              type="radio"
              name="role"
              value="user"
              checked={!isTrainer()}
              onInput={() => setIsTrainer(false)}
            />
            User
          </p>
          <p>
            <input
              type="radio"
              name="role"
              value="trainer"
              checked={isTrainer()}
              onInput={() => setIsTrainer(true)}
            />
            Trainer
          </p>
        </label>
        <button
          type="submit"
          class="bg-primary text-white p-2 rounded-lg w-max self-center"
        >
          Submit
        </button>
      </form>
    </>
  );
};

const Login = () => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const [tokens, setTokens] = useAppContext();

  const authFunc = async (username: string, password: string) => {
    let resp = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    setTokens(await resp.json());
    console.log(tokens());
    redirect("/");
  };
  return (
    <>
      <form
        class="flex flex-col gap-4 m-4"
        onSubmit={(e) => {
          e.preventDefault();
          authFunc(username(), password());
          return redirect("/");
        }}
      >
        <label>Username:</label>
        <input
          type="text"
          placeholder="Username"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          class="bg-primary text-white p-2 rounded-lg w-max self-center"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default function Home() {
  const [isLogin, setIsLogin] = createSignal(true);

  return (
    <>
      <header class="flex flex-row justify-between p-10">
        <h1 class="text-xl font-bold">
          <a href="/">CyberSportmans Fabric</a>
        </h1>
      </header>
      <main>
        <Title>Auth</Title>
        <div class="flex flex-row gap-3 m-5">
          <button
            onClick={() => setIsLogin((l) => !l)}
            class="bg-primary text-white p-2 rounded-lg w-max self-center"
          >
            {isLogin() ? "Register" : "Login"}
          </button>
        </div>
        <Show when={isLogin()} fallback={<Register />}>
          <Login />
        </Show>
      </main>
    </>
  );
}
