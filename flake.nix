{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils/v1.0.0";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {

        devShells = {
          default =
            pkgs.mkShell {
              buildInputs = with pkgs; [
                nodejs_22
                nodejs_22.pkgs.npm
              ];
            };
        };
      });
}
