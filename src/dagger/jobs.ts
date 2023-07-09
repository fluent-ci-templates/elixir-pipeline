import Client from "@dagger.io/dagger";

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("test")
    .container()
    .from("elixir:latest")
    .withDirectory("/app", context, { exclude: [".git"] })
    .withWorkdir("/app")
    .withExec(["mix", "local.rebar", "--force"])
    .withExec(["mix", "local.hex", "--force"])
    .withExec(["mix", "deps.get"])
    .withExec(["mix", "test"]);

  const result = await ctr.stdout();

  console.log(result);
};
