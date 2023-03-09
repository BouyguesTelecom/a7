# Integration tests

Integration tests are handled via [httpYac](https://httpyac.github.io/).

## Getting started

```shell
$ cd test/integration

$ docker-compose up -d
[+] Running 4/4
 ⠿ Container a7-default-1                  Started
 ⠿ Container a7-without-meta-queries-1     Started
 ⠿ Container a7-without-zip-directories-1  Started
 ⠿ Container a7-without-autoindex-1        Started

$ ./run.sh
[...]
35 requests processed (30 succeeded, 5 failed)
```
