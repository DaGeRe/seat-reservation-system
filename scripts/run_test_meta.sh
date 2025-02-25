#/bin/bash
for i in {1..15}; do
  echo "${i}th iteration"
  ./scripts/run_test.sh "$1"
done