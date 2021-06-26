#!/bin/bash
# muestra el tamaño ocupado por cada key
get_size() {
  k=$1
  r=$(redis-cli MEMORY USAGE "$k")
  echo $r
}

redis_cmd="redis-cli"

for k in `$redis_cmd keys "*"`;
do
  echo $k
  get_size $k
done
