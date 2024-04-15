import { JobSpec, Workflow } from "fluent_github_actions";

/**
 * Generates a GitHub Actions workflow for testing an Elixir pipeline.
 * @returns The generated workflow.
 */
export function generateYaml(): Workflow {
  const workflow = new Workflow("Test");

  const push = {
    branches: ["main"],
  };

  const test: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v1",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run elixir_pipeline",
      },
    ],
  };

  workflow.on({ push }).jobs({ test });

  return workflow;
}
