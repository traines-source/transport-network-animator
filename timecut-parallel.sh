#!/bin/bash

TIMECUT_ARGUMENTS="--viewport=3840,2160 --fps=60 --pipe-mode"
LAUNCH_ARGUMENTS="--no-sandbox --disable-setuid-sandbox --allow-file-access-from-files"
WORKERS=3
START_TIME=0
FILE_TYPE=mp4

set -e

usage() { echo "Usage: $0 -i <file to render> -o <output directory> -d <duration> [-s <start time>] [-w <number of workers>]" 1>&2; exit 1; }

while getopts ":i:o:d:s:w:" o; do
    case "${o}" in
        i)
            INPUT=${OPTARG}
            ;;
        o)
            OUTPUT_DIR=${OPTARG}
            ;;
        w)
            WORKERS=${OPTARG}
            ;;
        s)
            START_TIME=${OPTARG}
            ;;
        d)
            DURATION=${OPTARG}
            ;;
        *)
            usage
            ;;
    esac
done

if [ -z "${INPUT}" ] || [ -z "${OUTPUT_DIR}" ] || [ -z "${DURATION}" ]; then
    usage
fi

SLICE_LENGTH=$(($DURATION/$WORKERS))
CURRENT_SLICE_LENGTH=$(($SLICE_LENGTH+$DURATION-$SLICE_LENGTH*$WORKERS))
CURRENT_SLICE_START=$START_TIME

IDENTIFIER=$(basename ${INPUT})

CONTAINER_PREFIX="timecut-worker-"
CONCAT_COMMAND=""

DOCKERFILE="FROM alekzonder/puppeteer:latest\n

USER root\n

RUN apt-get update && apt-get install -yq ffmpeg\n
RUN yarn global add timecut\n

USER pptruser"

echo -e "\n=================" | tee -a timecut-parallel.log
echo "Building image..."
DOCKER_IMAGE=$(echo -e $DOCKERFILE | docker build --quiet -)
echo "Image built."

i=1
while [ "$i" -le "$WORKERS" ]; do
    OUTPUT_FILE=/output/${IDENTIFIER}_${i}.$FILE_TYPE
    CONCAT_COMMAND="${CONCAT_COMMAND}file $OUTPUT_FILE\n"

    docker rm $CONTAINER_PREFIX$i &>/dev/null || echo "No existing container to delete."

    echo "Starting worker $i at $CURRENT_SLICE_START with duration ${CURRENT_SLICE_LENGTH} ..." | tee -a timecut-parallel.log
    
    docker run \
        --name $CONTAINER_PREFIX$i \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        -d \
        -v $(pwd):/app/ \
        -v $(realpath ${OUTPUT_DIR}):/output/ \
        --shm-size=1G \
        --entrypoint timecut \
        ${DOCKER_IMAGE} \
        ${INPUT} --start ${CURRENT_SLICE_START} --duration ${CURRENT_SLICE_LENGTH} ${TIMECUT_ARGUMENTS} --launch-arguments="${LAUNCH_ARGUMENTS}" --output=${OUTPUT_FILE}

    CURRENT_SLICE_START=$(($CURRENT_SLICE_START+$CURRENT_SLICE_LENGTH))
    CURRENT_SLICE_LENGTH=$SLICE_LENGTH
    i=$(($i + 1))

    sleep 40
done

wait_until_workers_finished() {
    
    echo "$(date) Waiting until workers for $IDENTIFIER are finished..."

    while true; do
        sleep 5
        DPS=$(docker ps --format '{{.Names}}')
        if [[ $DPS != *"timecut-worker-"* ]]; then
            echo "$(date) All workers finished, concatenating final video file..."
            docker run \
                --name $CONTAINER_PREFIX-concat \
                -u $(id -u ${USER}):$(id -g ${USER}) \
                --rm \
                -v $(realpath ${OUTPUT_DIR}):/output/ \
                --entrypoint /bin/bash \
                ${DOCKER_IMAGE} \
                -c "ffmpeg -f concat -y -safe 0 -i <(echo -e '$CONCAT_COMMAND') -c copy /output/$IDENTIFIER.$FILE_TYPE"

            echo "Concatenating to $OUTPUT_DIR$IDENTIFIER.$FILE_TYPE finished."
            break
        fi
    done
}

wait_until_workers_finished &>>timecut-parallel.log &
echo "See logs in timecut-parallel.log and docker logs ${CONTAINER_PREFIX}*"

