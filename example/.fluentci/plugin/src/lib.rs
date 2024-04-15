use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };

    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "install",
            &format!("elixir@{}", version),
            "mix",
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    dag().set_envs(vec![
        ("HEX_HTTP_CONCURRENCY".into(), "1".into()),
        ("HEX_HTTP_TIMEOUT".into(), "120".into()),
    ])?;

    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["elixir", "mix"])?
        .with_exec(vec!["mix", "local.rebar", "--force"])?
        .with_exec(vec!["mix", "local.hex", "--force"])?
        .with_exec(vec!["mix", "deps.get"])?
        .with_exec(vec!["mix", "ecto.create"])?
        .with_exec(vec!["mix", "test", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn compile(args: String) -> FnResult<String> {
    dag().set_envs(vec![
        ("HEX_HTTP_CONCURRENCY".into(), "1".into()),
        ("HEX_HTTP_TIMEOUT".into(), "120".into()),
    ])?;

    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["elixir", "mix"])?
        .with_exec(vec!["mix", "local.rebar", "--force"])?
        .with_exec(vec!["mix", "local.hex", "--force"])?
        .with_exec(vec!["mix", "deps.get"])?
        .with_exec(vec!["mix", "compile", &args])?
        .stdout()?;
    Ok(stdout)
}
