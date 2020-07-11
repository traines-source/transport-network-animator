FROM alekzonder/puppeteer:latest

USER root

RUN apt-get update && apt-get install -yq ffmpeg
RUN yarn global add timecut

USER pptruser