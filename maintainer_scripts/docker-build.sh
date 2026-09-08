#! /bin/sh

set -e

IMAGE=docker-build

SCRIPTDIR=$(dirname $0)

cd $SCRIPTDIR
docker build . -t $IMAGE

cd ..
docker run --rm -u `id -u`:`id -g` -v `pwd`:/srv $IMAGE
