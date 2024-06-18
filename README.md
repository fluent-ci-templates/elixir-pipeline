# Elixir Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/elixir_pipeline)](https://pkg.fluentci.io/elixir_pipeline)
[![deno module](https://shield.deno.dev/x/elixir_pipeline)](https://deno.land/x/elixir_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/elixir)](https://jsr.io/@fluentci/elixir)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/elixir-pipeline)](https://codecov.io/gh/fluent-ci-templates/elixir-pipeline)

A ready-to-use CI/CD Pipeline for Elixir projects.


## 🚀 Usage

Run the following command in your project root:

```bash
fluentci run elixir_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t elixir
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/elixir-pipeline@main
```

## Jobs

| Job     | Description      |
| ------- | ---------------- |
| compile | Compile your code |
| test    | Run your tests   |

```typescript
compile(src: Directory | string): Promise<Directory | string>
test(src: Directory | string): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "jsr:@fluentci/elixir";

await test(".");
```
