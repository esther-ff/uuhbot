{
  description = "Bridge bot for discord";

  inputs = { nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable"; };

  outputs = { self, nixpkgs }:
    let
      everySystem = attr:
        builtins.foldl' (accum: elem: accum // { ${elem} = (attr elem); }) { };

      supportedTargets = [ "x86_64-linux" "aarch64-linux" ];

    in rec {
      packages = everySystem (system:
        let pkgs = import nixpkgs { inherit system; };
        in { default = pkgs.callPackage ./default.nix { }; }) supportedTargets;

      nixosModules = {
        bigeon = { config, pkgs, lib, ... }:
          let
            inherit (lib.options) mkEnableOption mkOption;
            inherit (lib) types;
            cfg = config.programs.bigeon;
          in {
            options.programs.bigeon = {
              enable = mkEnableOption "bigeon";

              botToken = mkOption {
                description = "File containing the Discord token for the bot";
                type = types.str;
                default = null;
              };

              discordServerId = mkOption {
                description = "Id of the Discord server containing the bot";
                type = types.int;
                default = null;
              };

              channelName = mkOption {
                description = "Name of the channel handled by the bot";
                type = types.str;
                default = null;
              };

              enableService = mkOption {
                description = "Enable the bot's systemd service";
                type = types.bool;
                default = false;
              };

              minecraftVersion = mkOption {
                description = "Minecraft client version used by the bot";
                type = types.enum [ "1.8.1" ];
                default = "1.8.1";
              };

              minecraftUsername = mkOption {
                description = "Username used by the bot in minecraft";
                type = types.str;
                default = null;
              };

              server = mkOption {
                description = "Server to which the bot connects";
                type = types.str;
                default = null;
              };

              embedColor = mkOption {
                description = "Color used by the bot's embeds";
                type = types.str;
                default = "ff69b4";
              };
            };

            config = lib.modules.mkIf cfg.enable (let
              botPkg = packages.${pkgs.system}.default;
              wrapper = pkgs.writeShellScript "bigeon-wrapped" ''
                echo $HOME
                BIGEON_TOKEN=$(cat /run/secrets/bigeon_discord_token) ${botPkg}/bin/bigeon
              '';

            in {
              environment.etc."bigeon/config.json".text = builtins.toJSON {
                embedColor = cfg.embedColor;
                serverAddress = cfg.server;
                minecraftUsername = cfg.minecraftUsername;
                minecraftVersion = cfg.minecraftVersion;
                discordServerId = cfg.discordServerId;
                channelName = cfg.channelName;
              };

              environment.systemPackages = [ botPkg ];
              systemd.services.bigeon = {
                enable = cfg.enableService;
                # name = "bigeon";
                description = "Bridge bot for discord";
                after = [ "network.target" ];
                wantedBy = [ "default.target" ];

                serviceConfig = {
                  Type = "simple";
                  ExecStart = "${wrapper}";
                };
              };
            });
          };
      };
    };
}
