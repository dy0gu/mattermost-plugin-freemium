import os
import json
import shutil
import subprocess
import tarfile
import argparse
from pathlib import Path

class PluginBuilder:
    def __init__(self):
        self.plugin_manifest = Path("plugin.json")
        self.plugin_meta= Path("version.txt")
        self.api_dist = Path("api/dist")
        self.web_dist = Path("web/dist")
        self.resources = Path("resources")
        self.bundle_dist = Path("dist")
        self.plugin_data = self._load_plugin_json()
        self.plugin_version = self._get_plugin_version()
        self.plugin_id = self.plugin_data["id"]
        self.bundle_name = f"{self.plugin_id}.tar.gz"
        self.build_api_enabled = "server" in self.plugin_data
        self.build_web_enabled = "webapp" in self.plugin_data

    def _load_plugin_json(self):
        with open(self.plugin_manifest, "r") as f:
            return json.load(f)

    def _get_plugin_version(self):
        with open(self.plugin_meta, "r") as f:
            return f.read().strip()

    def clean(self):
        """Clean previous build artifacts"""
        if not self.bundle_dist.exists():
            return
        print("Cleaning previous output...")
        for path in [self.bundle_dist, self.api_dist, self.web_dist]:
            if path.exists():
                shutil.rmtree(path)
        print("Previous output cleaned")

    def build_api(self):
        """Build API module for all supported architectures"""
        if not self.build_api_enabled:
            print("API module not included in manifest, skipping build")
            return
        print("Building API module...")
        subprocess.run(["go", "mod", "tidy"], cwd="api", check=True, shell=(os.name == "nt"))
        self.api_dist.mkdir(parents=True, exist_ok=True)

        platforms = [
            ("linux", "amd64", ""),
            ("linux", "arm64", ""),
            ("darwin", "amd64", ""),
            ("darwin", "arm64", ""),
            ("windows", "amd64", ".exe")
        ]
        for goos, goarch, ext in platforms:
            output = self.api_dist.absolute() / f"plugin-{goos}-{goarch}{ext}"
            env = os.environ.copy()
            env.update({
                "GOOS": goos,
                "GOARCH": goarch
            })

            subprocess.run([
                "go", "build",
                "-trimpath",
                "-o", str(output)
            ], cwd="api/src", env=env, check=True, shell=(os.name == "nt"))
        print("API module built")

    def build_web(self):
        """Build web module"""
        if not self.build_web_enabled:
            print("Web module not included in manifest, skipping build")
            return
        print("Building web module...")
        subprocess.run(["npm", "ci", "--silent"], cwd="web", check=True, shell=(os.name == "nt"))
        self.web_dist.mkdir(parents=True, exist_ok=True)

        subprocess.run(["npx", "vite", "build"], cwd="web", check=True, shell=(os.name == "nt"))
        print("Web module built")

    def bundle(self):
        """Create the final plugin bundle"""
        print(f"Bundling plugin...")
        print(f"ID: {self.plugin_id}")
        print(f"VERSION: {self.plugin_version}")

        # Create plugin directory structure
        plugin_dir = self.bundle_dist / Path(self.plugin_id)
        plugin_dir.mkdir(parents=True, exist_ok=True)

        # Update plugin.json with version
        self.plugin_data["version"] = self.plugin_version
        with open(plugin_dir / self.plugin_manifest, "w") as f:
            json.dump(self.plugin_data, f, indent=4)

        # Copy resources to the distribution directory
        shutil.copytree(self.resources, plugin_dir /  self.resources)

        # Copy API and web builds if they exist
        if self.build_api_enabled:
            shutil.copytree(self.api_dist, plugin_dir / self.api_dist.parent.name)
        if self.build_web_enabled:
            shutil.copytree(self.web_dist, plugin_dir / self.web_dist.parent.name)

        # Create tar bundle, setting executable permissions on server binaries
        # (Windows builds don't set the Unix execute bit)
        api_dir_name = self.api_dist.parent.name
        def fix_permissions(info):
            if info.name.startswith(f"{self.plugin_id}/{api_dir_name}/") and info.isfile():
                info.mode = 0o755
            return info

        with tarfile.open(self.bundle_dist / self.bundle_name, "w:gz") as tar:
            tar.add(plugin_dir, arcname=plugin_dir.name, filter=fix_permissions)

        # Remove the non-bundled directories
        shutil.rmtree(plugin_dir)
        if self.build_api_enabled:
            shutil.rmtree(self.api_dist)
        if self.build_web_enabled:
            shutil.rmtree(self.web_dist)

        print(f"Plugin bundled to /{self.bundle_dist} as {self.bundle_name}")

def main():
    parser = argparse.ArgumentParser(description="Simple cross-platform plugin bundler")
    _ = parser.parse_args()

    builder = PluginBuilder()

    builder.clean()
    builder.build_api()
    builder.build_web()
    builder.bundle()

if __name__ == "__main__":
    main()
