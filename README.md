# Elixir Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Felixir_pipeline&query=%24.version)](https://pkg.fluentci.io/elixir_pipeline)
[![deno module](https://shield.deno.dev/x/elixir_pipeline)](https://deno.land/x/elixir_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
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

```graphql
test(src: String!): String
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "https://pkg.fluentci.io/elixir_pipeline@v0.6.0/mod.ts";

await test();
```
