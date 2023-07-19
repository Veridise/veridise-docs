# Installation 

**Important**: For building OrCa, you must use **Python 3.9**.

## Docker

To build the Docker image, run the following command:

```
docker build -t veridise/orca:test .
```

The Docker container can be launched in interactive mode with `bash` using the command below:

```
docker run -it veridise/orca:test bash
```

To run the test suite in the Docker container, use the command:

```
docker run -t veridise/orca:test /bin/bash -c "source /root/.bashrc; cd /root/OrCa-py; python3.9 ./test.py"

```

## Build from Source

All dependencies, with the exception of `spot` and `solc`, can be installed using `pip`. 

### Dependencies installable using pip

Run `pip3.9 install -r requirements.txt` for the following packages: 

* `py-solc-x`
* `py-evm==0.5.0a3`
* `web3==5.31.1` 
* `eth-tester==0.6.0b6`
* `eth-utils==1.10.0` 
* `antlr4-python3-runtime==4.9` 
* `mod` (for Cairo/Starknet arithmetic support in V)
* `cairo-lang`

<details><summary>Error message</summary> 
<code>
In file included from src/curve.c:1: 
  src/curve.h:4:10: fatal error: 'gmp.h' file not found
    #include "gmp.h"
          ^~~~~~~ 
    1 error generated.
    error: command '/usr/bin/clang' failed with exit code 1
</code>
</details>

If you get the above error message, run the following command and then reinstall `cairo-lang`:

For macOS:

```
CFLAGS=-I`brew --prefix gmp`/include LDFLAGS=-L`brew --prefix gmp`/lib pip3.9 install ecdsa fastecdsa sympy
```

For Linux:

```
sudo apt-get install libgmp3-dev
```

### Installing Rust-EVM locally

You need to install Rust-EVM from the Python-RustEVM repo. The code and instructions are found here:
https://github.com/Veridise/Python-RustEVM

The above steps will create a Python Wheel which is installed with Pip and should work as any other Python package.

### Installing solc

You need to install a version of the Solidity compiler greater than 0.8.x.
Installation instructions for `solc` can be found here: https://docs.soliditylang.org/en/v0.8.17/installing-solidity.html,
or you can use [solc-select](https://github.com/crytic/solc-select)

### Installing spot

Installation instructions for `spot` can be found here: https://spot.lrde.epita.fr/install.html.

Unless you explicitly call `./configure` with the flag `--disable-python`, `spot` should also install the necessary Python bindings. As per `spot`'s documentation, if you plan to use the Python bindings, you have to pass the following `--prefix` flag when calling `./configure`:

```
./configure --prefix ~/.local
```

The reason is that `~/.local/lib/python3.9/site-packages`, where `spot`'s Python bindings will be installed, is automatically searched by Python. 

If Python is installed elsewhere on your system, you should call `./configure` with the `--with-pythondir=/path/to/python3.9/site-packages` instead.

However, Python may still have trouble locating `spot` unless you set the `PYTHONPATH` to the `spot`'s installation path: 

```
export PYTHONPATH=${PYTHONPATH}:/path/to/spot/installation
```

**Note**: If the above command doesn't have any effect, you can also set the `PYTHONPATH` by editing the `~/.bash_profile` or the `~/.bashrc`.

For more about customizing or troubleshooting your `spot` installation, see https://gitlab.lrde.epita.fr/spot/spot.

## Testing

### Testing Installation

* To test that your install is working, you can run: `python3.9 orca.py solidity_example/sample_config.json`. You should expect an output similar to: <details><summary>Expected output</summary> <pre> Counterexample found in 13.25118088722229 seconds (162 transactions issued)! <br /> ---------------------------------------------------------------------------- <br /> Deployments <br /> %% <br /> 1. Address 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF deploys StoreVar_0 with constructor(225) at address 0x153b84F377C6C7a7D93Bd9a717E48097Ca6Cfd11 <br /> %% <br /> Transactions <br /> %% <br /> 1. Address 0x1efF47bc3a10a45D4B230B5d10E37751FE6AA718 sends StoreVar_0.set_foo() <br /> 2. Address 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf sends StoreVar_0.alert_foo() <br /> %% </pre> </details> 

* To test that your install works for Cairo contracts, you can run `python3.9 orca.py cairo_example/sample_config.json`. You should expect an output similar to: <details><summary>Expected output</summary> <pre> Counterexample found in 3.05165958404541 seconds (1 transactions issued)! <br /> ------------------------------------------------------------------------- <br /> Deployments <br /> %% <br /> 1. Address 0x5a9c4658c73f7f3451e3879d005062f79ea35dd2b0f52fe9b410bd1af2af4ca deploys Contract_0 with constructor() at address 3515609476962345034402339816506421831587485770792362804317230754085118229102 <br /> %% <br /> Transactions <br /> %% <br /> 1. Address 0x5a9c4658c73f7f3451e3879d005062f79ea35dd2b0f52fe9b410bd1af2af4ca sends Contract_0.int_div(78, 59) <br /> %% <br /> ------------------------------------------------------------------------- </pre> </details>

### Test Suite

To run the entire test suite, simply run `python3.9 test.py` 
