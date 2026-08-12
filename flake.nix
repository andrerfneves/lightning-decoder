{
  description = "Lightning Decoder";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          packageJson = builtins.fromJSON (builtins.readFile ./package.json);
          app = pkgs.buildNpmPackage {
            pname = packageJson.name;
            inherit (packageJson) version;

            src = ./.;
            npmDepsHash = "sha256-TU8anhVBVJUVK9snysRmtmFDs4lzwfjF6v7zdie7QRg=";
            makeCacheWritable = true;
            npmFlags = [ "--legacy-peer-deps" ];

            nodejs = pkgs.nodejs_22;
            nativeBuildInputs = [
              pkgs.pkg-config
              pkgs.python3
            ];

            npm_config_build_from_source = "true";

            installPhase = ''
              runHook preInstall

              mkdir -p $out/share/${packageJson.name}
              cp -r build/* $out/share/${packageJson.name}/

              runHook postInstall
            '';
          };
          serve = pkgs.writeShellApplication {
            name = packageJson.name;
            runtimeInputs = [ pkgs.python3 ];
            text = ''
              host="''${HOST:-127.0.0.1}"
              port="''${PORT:-5173}"

              cd "${app}/share/${packageJson.name}"
              echo "Serving ${packageJson.name} at http://$host:$port/"
              exec python -m http.server "$port" --bind "$host"
            '';
          };
        in
        {
          default = app;
          inherit app serve;
        });

      apps = forAllSystems (system: {
        default = {
          type = "app";
          program = "${self.packages.${system}.serve}/bin/lightning-decoder";
        };
      });

      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.git
              pkgs.gnumake
              pkgs.nodejs_22
              pkgs.pkg-config
              pkgs.python3
            ];
          };
        });
    };
}
