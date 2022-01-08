#!/bin/bash

usage() {
  echo "usage: extract_gps.sh [-f] <filename>"
  echo "  extract gps file (JSON) from <filename> (MP4)."
  echo "  if json file exists, skip and does NOT rewrite."
  echo "  -f to force overwrite if json file exists."
  exit 1
}

force=0

while getopts f OPT
do
  case $OPT in
    f) force=1
      ;;
    \?) usage
      ;;
  esac
done

shift $((OPTIND - 1))

if [ $# -ne 1 ]; then
  usage
fi

filename=${1}
filehead=${filename%.*}
binname=${filehead}.bin
jsonname=${filehead}.json

if test -e ${binname}; then
  echo "${binname} already exists. skip."
else
  ffmpeg -y -i ${filename} -codec copy -map 0:3:handler_name:"GoPro MET" -f rawvideo ${binname}
fi

if [ ${force} -ne 1 ]; then
  if test -e ${jsonname}; then
    echo "${jsonname} already exists. skip."
    exit 0
  fi
fi

gopro_utils_path=${HOME}/work/gopro_gps_ui
node ${gopro_utils_path}/scripts/to_json.js ${binname} ${jsonname}
