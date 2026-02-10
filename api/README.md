# API 🧩

- Setup dependencies:

    ```shell
    go mod tidy
    ```

- Build the API module for a single architecture:

    ```shell
    # Set the output environment variables:
    # (syntax may differ based on OS/shell used)
    GOOS=windows
    GOARCH=amd64

    # Run the build:
    go build -trimpath -o plugin-windows-amd64.exe
    ```

- See the [build script](../README.md#build-) for a fully automated build & bundling workflow targeting multiple architectures.

- Note that the server sided module of this plugin is disabled since only web injection is required at this time. To enable it, edit the `plugin.json` file and add references to the executables that should be reachable by the Mattermost server.

    ```json
    "server": {
        "executables": {
            "linux-amd64": "api/plugin-linux-amd64",
            "linux-arm64": "api/plugin-linux-arm64",
            "darwin-amd64": "api/plugin-darwin-amd64",
            "darwin-arm64": "api/plugin-darwin-arm64",
            "windows-amd64": "api/plugin-windows-amd64.exe"
        }
    },
    ```
