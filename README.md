<img src="https://github.com/akestoridis/hiveguard/raw/a9bff35964406c9ef4ad5c21f4ea7263747ae3ce/hiveguard-header.png">

# hiveguard

HiveGuard: A distributed system for monitoring the security of Zigbee networks


## Instructions

You can install the HiveGuard command-line interface from its GitHub repository as follows:
```console
$ git clone https://github.com/akestoridis/hiveguard.git
$ cd hiveguard/
$ npm install --omit=dev
```

Then, you can select the HiveGuard backend servers that you would like to launch and define the necessary environment variables by executing the following command:
```console
$ npm run start
```

You can also override the default configuration by providing a configuration file, e.g.:
```console
$ npm run start config.prod.json
```


## Architecture

HiveGuard consists of four components:

1. A retention server, which is archiving compressed pcap files from a set of wireless intrusion detection system (WIDS) sensors.
2. An aggregation server, which is mainly responsible for aggregating data and events from the registered WIDS sensors.
3. An inspection server, which is analyzing aggregated data and events, as well as generating alerts for events that were detected either by a WIDS sensor or during its own analysis routine.
4. A web server, which is statically serving the HiveGuard frontend application to run on the HiveGuard user's web browser.

The following figure provides an overview of the system architecture.

<img src="https://github.com/akestoridis/hiveguard/raw/3599091ad49b3493d4939ab9826b837807c610ea/hiveguard-architecture.png">

The source code of the HiveGuard backend servers can be found in the [akestoridis/hiveguard-backend repository](https://github.com/akestoridis/hiveguard-backend), while the source code of the HiveGuard frontend application can be found in the [akestoridis/hiveguard-frontend repository](https://github.com/akestoridis/hiveguard-frontend).


## Related Publications

* D.-G. Akestoridis and P. Tague, “HiveGuard: A network security monitoring architecture for Zigbee networks,” in *Proc. IEEE CNS’21*, 2021, pp. 209–217, doi: [10.1109/CNS53000.2021.9705043](https://doi.org/10.1109/CNS53000.2021.9705043).


## Acknowledgments

This project was supported in part by the Carnegie Mellon CyLab Security and Privacy Institute and in part by Carnegie Mellon University.


## License

Copyright 2021-2022 Dimitrios-Georgios Akestoridis

This project is licensed under the terms of the Apache License, Version 2.0 (Apache-2.0).
