{ buildNpmPackage, fetchNpmDeps, fetchFromGitHub, bun }:

buildNpmPackage {
  name = "bigeon";
  version = "0.0.1";
  npmDepsHash = "sha256-PmJ5d7Ic9qqCNvaLALUzjvUlskfUq0vX8H4iCpCxkXY=";
  makeCacheWritable = true;
  dontNpmBuild = true;

  # src = fetchFromGitHub {
  #   owner = "esther-ff";
  #   repo = "uuhbot";
  #   rev = "5db77c2daa7b9c9e24f42093ad217bcd2b7f6014";
  #   hash = "sha256-MnrXI1OfSHhMz8DlvdL/9doX170HBPK1V28DB1OZb5I=";
  # };
  #

  src = ./.;

  buildInputs = [ bun ];
  buildPhase = ''
    runHook preBuild
    mkdir -p $out
    ${bun}/bin/bun build ./main.ts --target=bun --outfile=$out/bigeon.ts

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin

    echo "${bun}/bin/bun run $out/bigeon.ts --smol" > $out/bin/bigeon
    chmod 744 $out/bin/bigeon
    runHook postInstall
  '';
}

