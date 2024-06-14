# collect.sh

A script to list Node.js experimental APIs from nodejs/node docs

## Usage

```console
$ pwd
/Users/rafaelgss/repos/os/node
$ ../nodejs-stats/experimental-features/collect.sh
...
doc/api/worker_threads.md: ### `port.hasRef()`
> Stability: 1 - Experimental

* Returns: {boolean}

If true, the `MessagePort` object will keep the Node.js event loop active.
```

If you want o have only the API name pass `PRINT_SECTION=0` as env var:

```console
$ PRINT_SECTION=0 ../nodejs-stats/experimental-features/collect.sh
...
doc/api/vm.md: ## `vm.measureMemory([options])`

doc/api/wasi.md: # WebAssembly System Interface (WASI)

doc/api/webcrypto.md: #### Ed25519/Ed448/X25519/X448 key pairs

doc/api/worker_threads.md: ### `port.hasRef()`
```
