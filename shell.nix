{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-16_x
    pkgs.nodePackages.npm
  ];

  shellHook = ''
  '';
}
