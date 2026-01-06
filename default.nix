{ stdenv, fetchFromGitHub, bun }:

stdenv.mkDerivation {
  name = "bigeon";
  version = "0.0.1";

  src = fetchFromGitHub {
    owner = "esther-ff";
    repo = "uuhbot";
    rev = "master";
    hash = "sha256-u9nSCa5gzsuYmRhJJrpkb+nK1NHZFjC3uTy32cg8jSE=";
  };

  buildInputs = [ bun ];

  installPhase = ''
    runHook preInstall
    bun build $src/main.ts --target=bun --minify --outfile=$out/.bigeon.ts 
    echo "${bun} run $out/.bigeon.ts --smol" > $out/bin/bigeon
    chmod 744 $out/bin/bigeon
    runHook postInstall
  '';
}

