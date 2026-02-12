{
  description = "Flake for Web Development with Next.js";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages."${system}";
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        name = "nextjs";

        nativeBuildInputs = with pkgs; [
          nodejs_24

          typescript-language-server
          tailwindcss-language-server
          playwright-driver.browsers
        ];

        shellHook = ''
          export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
          export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
          export PLAYWRIGHT_HOST_PLATFORM_OVERRIDE="ubuntu-24.04"

          echo -e "\033[0;32mDone!\033[0m"
        '';
      };
    };
}
