# Elixir Pipeline

[![deno module](https://shield.deno.dev/x/elixir_pipeline)](https://deno.land/x/elixir_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/elixir-pipeline)](https://codecov.io/gh/fluent-ci-templates/elixir-pipeline)

A ready-to-use CI/CD Pipeline for Elixir projects.


## 🚀 Usage

Run the following command in your project root:

```bash
dagger run fluentci elixir_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t elixir
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

## Jobs

| Job   | Description      |
| ----- | ---------------- |
| test  | Run your tests   |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import Client, { connect } from "@dagger.io/dagger";
import { Dagger } from "https://deno.land/x/elixir_pipeline/mod.ts";

const { test } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
  });
}

pipeline();
```
