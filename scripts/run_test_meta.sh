#/bin/bash
for i in {1..15}; do
  ./scripts/run_test.sh 2>&1 | sed -n 's/^.*abcde //p'
done