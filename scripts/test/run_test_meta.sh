#/bin/bash
for i in {1..15}; do
  echo "${i}th iteration"
  ./scripts/test/run_test.sh "$1"
done