# Running OrCa locally with Hardhat Projects

This page outlines how to fuzz Hardhat projects using OrCa locally (rather than through Saas).


## Getting Started

Before attempting to fuzz your Hardhat project using OrCa, please ensure that your code compiles and can be deployed without error.
To do so, perform the following steps on your Hardhat project locally and ensure that they pass.

```
npm ci
npx hardhat compile
npx hardhat node
npx hardhat run --network localhost <path_to_deploy_script.js>
```

After successfully deploying your hardhat project, terminate the `npx hardhat node` process.

Next, create a `config.json` file to configure OrCa.
The following options are required to run OrCa with any Hardhat project:

* `"deployment_system"` (set to `"hardhat"`)
* `"include_path"` (set to `"node_modules"`)
* `"deployment_script_path"`
* `"src_path"`

Below is a simple example `config.json` file for a Hardhat project.

```
{
    "timeout": 600,
    "specs_path": "specs",
    "spec": "my_property.spec",
    "deployment_system": "hardhat",
    "deployment_script_path": "scripts/deploy.js",
    "src_path": "contracts",
    "include_path": "node_modules",
    "disable_user_proxies": true,
    "num_users": 3,
    "deployment_folder_path": "path/to/my_hardhat_project"
}

```

Finally, use the following command to run OrCa:
```python3.9 orca.py <path_to_config.json>```


## Troubleshooting

TODO: Write me!
Note common errors here.
