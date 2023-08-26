import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

export enum Job {
  test = "test",
}

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const baseCtr = withDevbox(
    client
      .pipeline(Job.test)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", "deps", "_build"],
    })
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
};

export type JobExec = (client: Client, src?: string) => Promise<void>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run your tests",
};