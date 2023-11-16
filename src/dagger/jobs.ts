import Client, { connect } from "../../deps.ts";

export enum Job {
  test = "test",
}

export const exclude = [".git", ".devbox", "deps", "_build"];

export const test = async (src = ".") => {
  await connect(async (client: Client) => {
    const mysql = client
      .container()
      .from("mysql")
      .withEnvVariable("MYSQL_ROOT_PASSWORD", "pass")
      .withEnvVariable("MYSQL_DATABASE", "example_test")
      .withExposedPort(3306)
      .asService();

    const context = client.host().directory(src);
    const baseCtr = client
      .pipeline(Job.test)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "elixir", "mix"]);

    const ctr = baseCtr
      .withServiceBinding("mysql", mysql)
      .withEnvVariable("MYSQL_ROOT_PASSWORD", "pass")
      .withEnvVariable("MYSQL_DATABASE", "example_test")
      .withEnvVariable("MYSQL_HOST", "mysql")
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withMountedCache("/root/.mix", client.cacheVolume("mix"))
      .withMountedCache("/app/deps", client.cacheVolume("deps"))
      .withMountedCache("/app/_build", client.cacheVolume("_build"))
      .withExec(["mix", "local.rebar", "--force"])
      .withExec(["mix", "local.hex", "--force"])
      .withEnvVariable("HEX_HTTP_CONCURRENCY", "1")
      .withEnvVariable("HEX_HTTP_TIMEOUT", "120")
      .withExec(["mix", "deps.get"])
      .withExec(["mix", "ecto.create"])
      .withExec(["mix", "test"]);

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
