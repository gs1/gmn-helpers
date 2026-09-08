ARG DOTNET_SDK=8.0
ARG NODE_VERSION=22
ARG DOCFX_VERSION=2.78.5
ARG JDK_VERSION=17


FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_SDK}

ARG NODE_VERSION
ARG DOCFX_VERSION
ARG JDK_VERSION

ARG DEBIAN_FRONTEND=noninteractive


#
#  Java library
#
RUN apt-get update \
 && apt-get install -y --no-install-recommends openjdk-${JDK_VERSION}-jdk junit4 curl ca-certificates \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/*


#
#  JS / Node.js library
#
#  The JS tooling itself is not installed here: it is taken from the pinned
#  versions in js/package-lock.json at build time so that the generated
#  documentation depends only on what the repository records.
#
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/*


#
#  C# documentation
#
#  Installed to a world readable location because the container is run as the
#  invoking user, which cannot read root's home directory.
RUN dotnet tool install --tool-path /opt/docfx docfx --version ${DOCFX_VERSION}
ENV PATH="/opt/docfx:${PATH}"


COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD [""]
