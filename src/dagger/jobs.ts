import Client, { connect } from "../../deps.ts";

export enum Job {
  test = "test",
}

export const exclude = [".git", ".devbox", "deps", "_build"];

export const test = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const baseCtr = client
      .pipeline(Job.test)
      .container()
      .from("ghcr.io/fluentci-io/devbox:latest")
      .withExec(["mv", "/nix/store", "/nix/store-orig"])
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"]);

    const ctr = baseCtr
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withMountedCache("/root/.mix", client.cacheVolume("mix"))
      .withMountedCache("/app/deps", client.cacheVolume("deps"))
      .withMountedCache("/app/_build", client.cacheVolume("_build"))
      .withExec([
        "sh",
        "-c",
        "mkdir -p .devbox && eval $(devbox shell --print-env) && \
       devbox services up -b && \
       devbox services stop && \
       sed -i 's/mysqld 2/mysqld --user=root 2/' .devbox/virtenv/mysql80/process-compose.yaml",
      ])
      .withExec([
        "sh",
        "-c",
        "devbox services up -b && \
       sleep 3 && \
       eval $(devbox shell --print-env) && \
       mix local.rebar --force && \
       mix local.hex --force && \
       HEX_HTTP_CONCURRENCY=1 HEX_HTTP_TIMEOUT=120 mix deps.get && \
       mix ecto.create && \
       mix test && \
       devbox services stop",
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export type JobExec = (src?: string) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run your tests",
};
