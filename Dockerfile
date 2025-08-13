FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y curl ca-certificates libevent-dev libboost-system1.74.0 libboost-filesystem1.74.0 libboost-chrono1.74.0 libboost-test1.74.0 libboost-thread1.74.0 && rm -rf /var/lib/apt/lists/*

# Definir versão
ENV BITCOIN_VERSION=28.1

# Baixar e instalar o Bitcoin Core
# https://bitcoin.org/bin/bitcoin-core-28.1/bitcoin-28.1-x86_64-linux-gnu.tar.gzy
RUN curl -O https://bitcoin.org/bin/bitcoin-core-${BITCOIN_VERSION}/bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz \
    && tar -xzf bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz \
    && mv bitcoin-${BITCOIN_VERSION}/bin/* /usr/local/bin/ \
    && rm -rf bitcoin-${BITCOIN_VERSION}*

# Criar pasta de dados
RUN mkdir /bitcoin

VOLUME ["/bitcoin"]

ENTRYPOINT ["bitcoind"]
