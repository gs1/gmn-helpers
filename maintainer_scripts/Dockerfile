ARG DISTRO=focal
ARG RELEASE=20.04
ARG DOTNET_SDK=3.1
ARG NVM_VERSION=0.35.3
ARG NODE_VERSION=12.18.0


FROM ubuntu:${DISTRO}

ARG DISTRO
ARG RELEASE
ARG DOTNET_SDK
ARG NVM_VERSION
ARG NODE_VERSION

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get install -y --no-install-recommends apt-utils curl ca-certificates \
 && apt-get install -y software-properties-common apt-transport-https gnupg2 \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/*


#
#  C# library
#
RUN apt-key adv --fetch-keys https://packages.microsoft.com/keys/microsoft.asc \
 && add-apt-repository -y "deb [arch=amd64] https://packages.microsoft.com/ubuntu/${RELEASE}/prod ${DISTRO} main" \
 && apt-get update \
 && apt-get install -y --no-install-recommends dotnet-sdk-${DOTNET_SDK}

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
 && add-apt-repository -y "deb https://download.mono-project.com/repo/ubuntu stable-${DISTRO} main" \
 && apt-get update \
 && apt-get install -y --no-install-recommends mono-devel


#
#  Java library
#
RUN apt-get update \
 && apt-get install -y --no-install-recommends default-jdk junit4


#
#  JS / Node.js library
#
ENV NVM_DIR "/nvm"
RUN mkdir $NVM_DIR
RUN curl -sL https://raw.githubusercontent.com/creationix/nvm/v$NVM_VERSION/install.sh | bash -

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm i -g jest-cli \
 && npm i -g jsdoc


COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD [""]

