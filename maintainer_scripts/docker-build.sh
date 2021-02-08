#! /bin/sh

set -e

IMAGE=docker-build

SCRIPTDIR=$(dirname $0)

# Use a standard Docker for most things
cd $SCRIPTDIR
docker build . -t $IMAGE

cd ..
docker run -it --rm -u `id -u`:`id -g` -v `pwd`:/srv $IMAGE

# Build the C# docs using a pre-packaged DocFX container based on .NET Framework
cd cs
rm -rf docs && mkdir -p docs && ln -s GS1.html docs/index.html
docker run -it --rm -u `id -u`:`id -g` -v `pwd`:/work -w /work/docfx_project knsit/docfx:latest

