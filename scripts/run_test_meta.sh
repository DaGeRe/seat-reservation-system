#/bin/bash
#if [ -z "$1" ]; then
for i in {1..15}; do
  #./scripts/run_test.sh 2>&1 | sed -n 's/^.*abcde //p'
  #./scripts/run_test.sh "cypress/integration/$1" 2>&1 | sed -n 's/^.*failed //p'
  echo "${i}th iteration"
  ./scripts/run_test.sh "$1"
done
#else
#  ./scripts/run_test.sh "$1"
#fi