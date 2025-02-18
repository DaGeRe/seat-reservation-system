#/bin/bash
for i in {1..100}; do
  ./scripts/run_test.sh 2>&1 | sed -n 's/^.*abcde //p'
done