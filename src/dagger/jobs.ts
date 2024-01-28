import { Directory, dag } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  compile = "compile",
}

export const exclude = [".git", ".devbox", "deps", "_build"];

/**
 * @function
 * @description Compile your code
 * @param {string | Directory} src
 * @returns {Promise<Directory | string>}
 */
export async function compile(
  src: Directory | string
): Promise<Directory | string> {
  const context = await getDirectory(dag, src);
  const baseCtr = dag
    .pipeline(Job.compile)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "elixir", "mix"]);

  const ctr = baseCtr
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withMountedCache("/root/.mix", dag.cacheVolume("mix"))
    .withMountedCache("/app/deps", dag.cacheVolume("deps"))
    .withMountedCache("/app/_build", dag.cacheVolume("_build"))
    .withExec(["mix", "local.rebar", "--force"])
    .withExec(["mix", "local.hex", "--force"])
    .withEnvVariable("HEX_HTTP_CONCURRENCY", "1")
    .withEnvVariable("HEX_HTTP_TIMEOUT", "120")
    .withExec(["mix", "deps.get"])
    .withExec(["mix", "compile"])
    .withExec(["cp", "-r", "_build", "/_build"]);

  await ctr.stdout();

  const id = await ctr.directory("/_build").id();
  return id;
}

/**
 * @function
 * @description Run your tests
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function test(src: Directory | string): Promise<string> {
  const mysql = dag
    .container()
    .from("mysql")
    .withEnvVariable("MYSQL_ROOT_PASSWORD", "pass")
    .withEnvVariable("MYSQL_DATABASE", "example_test")
    .withExposedPort(3306)
    .asService();

  const context = await getDirectory(dag, src);
  const baseCtr = dag
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
    .withMountedCache("/root/.mix", dag.cacheVolume("mix"))
    .withMountedCache("/app/deps", dag.cacheVolume("deps"))
    .withMountedCache("/app/_build", dag.cacheVolume("_build"))
    .withExec(["mix", "local.rebar", "--force"])
    .withExec(["mix", "local.hex", "--force"])
    .withEnvVariable("HEX_HTTP_CONCURRENCY", "1")
    .withEnvVariable("HEX_HTTP_TIMEOUT", "120")
    .withExec(["mix", "deps.get"])
    .withExec(["mix", "ecto.create"])
    .withExec(["mix", "test"]);

  const result = await ctr.stdout();
  return result;
}

export type JobExec = (src: Directory | string) => Promise<Directory | string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.compile]: compile,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run your tests",
  [Job.compile]: "Compile your code",
};
