# Keeping it clean 🧹💼

This plugin was created to remove all free tier labels, warnings, and enterprise upgrade reminders from the Mattermost free edition web interface. It is intended to support a clean, self-hosted experience free from branding or ads tied to the original platform. It has now also evolved to provided QOL fixes for some less updated plugins, these fixes take no effect if you don't use such plugins.

Initially, the idea was to allow custom user CSS branding via a plugin settings text box. However, this was discarded out of respect for the Mattermost team, as they've since implemented this feature in the enterprise edition.

To clarify, this plugin is not intended to undermine Mattermost's work. The paid editions are vital to the platform's continued development and the talented team behind it. If you can, consider supporting them. Instead, this plugin provides an alternative for those who cannot purchase a paid edition or are restricted by legal or branding requirements.

Feel free to raise issues for any areas you think the plugin should address but currently doesn't.

**Here is a non-exhaustive showcase of some of the changes made by the plugin:**

![1](https://i.postimg.cc/QNbtDHwf/1.png)
![2](https://i.postimg.cc/HnBs9hXq/2.png)

## Usage 🚀

- [Use this link to download the latest version.](https://github.com/dy0gu/mattermost-plugin-freemium/releases/latest/download/freemium.tar.gz)
- Enable [custom plugin uploads](https://docs.mattermost.com/configure/plugins-configuration-settings.html#upload-plugin) in your configuration.
- Install and enable the plugin using the admin console.

## Compatibility 📀

The plugin has been tested with the following versions:

- **10.x**
- **11.x**

Any new version is likely also compatible out of the box and will be incrementally supported while attempting to maintaining fixes for earlier releases.

Both the `team` and `enterprise` docker images should work with the plugin.

## Development 🛠️

See below for setting up a local workspace to work on the plugin, this section is targeted at developers.

The project structure here consists of a highly modified and optimized version of the [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template). Testing and development workflows have been removed to preserve plugin simplicity. **This means the plugin must be rebuilt and manually uploaded into a Mattermost instance anytime you want to test it**.

The plugin build version will be based on the `version.txt` file that automatically gets bumped by the CI pipeline when a release is made.

A `docker-compose.yaml` file is provided to quickly spin up two (`team` and `enterprise`) local Mattermost instances for testing. It is self-contained with dummy environment variables already set and usually requires no additional configuration.

- ### Requirements 📋

  - Go ([version](api/go.mod#L3))
  - Node ([version](web/package.json#L5))
  - Python ([version](.python-version))

- ### Getting Started 🏁

  - Clone this repository.

  - Refer to each folder for instructions on that particular module.

    - [api](api/README.md)
    - [web](web/README.md)

  - Start instances for testing the plugin upload, using the provided `docker-compose.yaml` file:

    ```shell
    docker compose up --force-recreate
    ```

    The enterprise edition instance will be available at `http://localhost:8065` and the team edition at `http://localhost:8066`.

- ### Build 📦

  - Run the cross-platform build script to automatically create an installable plugin artifact:

    ```shell
    python build.py
    ```

  - The resulting `tar.gz` file is in the format accepted by Mattermost. You can use the provided `docker-compose.yaml` file to quickly spin up a local Mattermost instance for testing. It is self-contained and requires no additional configuration.

- ### Tools 🧰

  - Pre-commit hooks to run project formatting and linting:

    ```shell
    # Needs the dependencies off all modules installed to run correctly!
    pip install lefthook
    lefthook install

    # When using pre-commit hooks, git commands will fail if any files are checked with errors.
    # These files must be added to the staging area and commited again after being fixed up.
    ```

- ### Tips 💡

  - The `api` section in **Go** is currently unused, you can fork the project and refer to the comments in the `web/src/main.tsx` file to see how additional styling or branding can be added or removed, in addition to the changes provided by the plugin.

  - For an example of a plugin manifest with both server and webapp logic see this [template repository](https://github.com/mattermost/mattermost-plugin-starter-template/blob/master/plugin.json) from the official mattermost team, this repository is a heavily modded version of that template.
