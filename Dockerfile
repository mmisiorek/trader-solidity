 FROM ubuntu:17.10

RUN apt-get update 
RUN yes | apt-get install npm 
RUN npm install -g solc truffle 

RUN useradd -ms /bin/bash solidity
WORKDIR /home/solidity
RUN mkdir code

WORKDIR /home/solidity/code
USER solidity