#!/bin/bash


if [[ -z "$1" ]]; then
  N=5
else
  N=$1;
fi

echo "Note: You must run it in the Node.js folder with `main` up-to-date";

commits_last_n_years () {
  START_DATE=$(date '+%Y');
  LOCAL_START_DATE=$START_DATE;
  for i in $(seq 1 $(($1))); do
    DATE=$(($START_DATE-i));
    LOCAL_START_DATE=$(($DATE+1))
    count=$(git rev-list --count HEAD --since="Jan 1 $DATE"  --before="Jan 1 $LOCAL_START_DATE")
    echo "Between Jan 1 $DATE ~ Jan 1 $LOCAL_START_DATE = $count";
  done
}

commits_last_n_years $N;
