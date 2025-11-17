2025-11-17T21:10:39.798832605Z	Cloning repository...
2025-11-17T21:10:40.388721835Z	From https://github.com/mathwaksu-byte/MathwaV2
2025-11-17T21:10:40.389169932Z	 * branch            6b4de67b906a9753f1981c4a3345abc04794b43f -> FETCH_HEAD
2025-11-17T21:10:40.38920131Z	
2025-11-17T21:10:40.429810822Z	HEAD is now at 6b4de67 Cloudflare Pages: use static import of built server in functions and JS file to avoid TS typing issues
2025-11-17T21:10:40.430147625Z	
2025-11-17T21:10:40.515646296Z	
2025-11-17T21:10:40.515870716Z	Using v2 root directory strategy
2025-11-17T21:10:40.538894752Z	Success: Finished cloning repository files
2025-11-17T21:10:42.471863803Z	Checking for configuration in a Wrangler configuration file (BETA)
2025-11-17T21:10:42.472317723Z	
2025-11-17T21:10:43.57324248Z	No wrangler.toml file found. Continuing.
2025-11-17T21:10:43.641162903Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2025-11-17T21:10:43.641594455Z	Installing project dependencies: npm clean-install --progress=false
2025-11-17T21:10:51.48745218Z	
2025-11-17T21:10:51.48804863Z	added 655 packages, and audited 656 packages in 7s
2025-11-17T21:10:51.488391783Z	
2025-11-17T21:10:51.488754807Z	181 packages are looking for funding
2025-11-17T21:10:51.488948048Z	  run `npm fund` for details
2025-11-17T21:10:51.527916513Z	
2025-11-17T21:10:51.528277151Z	10 vulnerabilities (7 moderate, 3 high)
2025-11-17T21:10:51.52830075Z	
2025-11-17T21:10:51.528494265Z	To address issues that do not require attention, run:
2025-11-17T21:10:51.528657551Z	  npm audit fix
2025-11-17T21:10:51.528781171Z	
2025-11-17T21:10:51.528902726Z	Some issues need review, and may require choosing
2025-11-17T21:10:51.528943236Z	a different dependency.
2025-11-17T21:10:51.529481003Z	
2025-11-17T21:10:51.529635204Z	Run `npm audit` for details.
2025-11-17T21:10:51.557257803Z	Executing user command: npm run build
2025-11-17T21:10:51.939685403Z	
2025-11-17T21:10:51.940096026Z	> mathwa-client@1.0.0 build
2025-11-17T21:10:51.940353567Z	> remix build
2025-11-17T21:10:51.940467663Z	
2025-11-17T21:10:52.642082673Z	[33mThe CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.[39m
2025-11-17T21:10:52.743718782Z	[7m[34m info [39m[27m building...[90m (NODE_ENV=production)[39m
2025-11-17T21:10:52.756871869Z	[7m[33m warn [39m[27m Fetcher persistence behavior is changing in React Router v7
2025-11-17T21:10:52.75714936Z	[33m┃[39m [90mYou can use the `v3_fetcherPersist` future flag to opt-in early.[39m
2025-11-17T21:10:52.757159036Z	[33m┃[39m [90m-> https://remix.run/docs/en/2.13.1/start/future-flags#v3_fetcherPersist[39m
2025-11-17T21:10:52.75731762Z	[33m┗[39m
2025-11-17T21:10:52.757472727Z	[7m[33m warn [39m[27m Route discovery/manifest behavior is changing in React Router v7
2025-11-17T21:10:52.757570093Z	[33m┃[39m [90mYou can use the `v3_lazyRouteDiscovery` future flag to opt-in early.[39m
2025-11-17T21:10:52.757702656Z	[33m┃[39m [90m-> https://remix.run/docs/en/2.13.1/start/future-flags#v3_lazyRouteDiscovery[39m
2025-11-17T21:10:52.757864975Z	[33m┗[39m
2025-11-17T21:10:52.757982092Z	[7m[33m warn [39m[27m Relative routing behavior for splat routes is changing in React Router v7
2025-11-17T21:10:52.758087141Z	[33m┃[39m [90mYou can use the `v3_relativeSplatPath` future flag to opt-in early.[39m
2025-11-17T21:10:52.758617427Z	[33m┃[39m [90m-> https://remix.run/docs/en/2.13.1/start/future-flags#v3_relativeSplatPath[39m
2025-11-17T21:10:52.758623013Z	[33m┗[39m
2025-11-17T21:10:52.75883979Z	[7m[33m warn [39m[27m Data fetching is changing to a single fetch in React Router v7
2025-11-17T21:10:52.758856399Z	[33m┃[39m [90mYou can use the `v3_singleFetch` future flag to opt-in early.[39m
2025-11-17T21:10:52.759348473Z	[33m┃[39m [90m-> https://remix.run/docs/en/2.13.1/start/future-flags#v3_singleFetch[39m
2025-11-17T21:10:52.759461746Z	[33m┗[39m
2025-11-17T21:10:52.759467094Z	[7m[33m warn [39m[27m The format of errors thrown on aborted requests is changing in React Router v7
2025-11-17T21:10:52.759470577Z	[33m┃[39m [90mYou can use the `v3_throwAbortReason` future flag to opt-in early.[39m
2025-11-17T21:10:52.759473842Z	[33m┃[39m [90m-> https://remix.run/docs/en/2.13.1/start/future-flags#v3_throwAbortReason[39m
2025-11-17T21:10:52.759657629Z	[33m┗[39m
2025-11-17T21:10:53.597552266Z	[7m[34m info [39m[27m built[90m (853ms)[39m
2025-11-17T21:10:53.788033021Z	Finished
2025-11-17T21:10:54.702763751Z	Checking for configuration in a Wrangler configuration file (BETA)
2025-11-17T21:10:54.703335525Z	
2025-11-17T21:10:55.824308146Z	Found Functions directory at /functions. Uploading.
2025-11-17T21:10:55.830142243Z	 ⛅️ wrangler 3.101.0
2025-11-17T21:10:55.830356643Z	-------------------
2025-11-17T21:10:57.161663291Z	[33m▲ [43;33m[[43;30mWARNING[43;33m][0m [1m						The package "node:stream" wasn't found on the file system but is built into node.[0m
2025-11-17T21:10:57.162114941Z	
2025-11-17T21:10:57.162247952Z	  						Your Worker may throw errors at runtime unless you enable the "nodejs_compat" compatibility flag. Refer to [4mhttps://developers.cloudflare.com/workers/runtime-apis/nodejs/[0m for more details. Imported from:
2025-11-17T21:10:57.162589824Z	  						 - ../build/index.js
2025-11-17T21:10:57.16261587Z	  - ../node_modules/@remix-run/node/dist/stream.js
2025-11-17T21:10:58.742944Z	Failed: generating Pages Functions failed. Check the logs above for more information. If this continues for an unknown reason, contact support: https://cfl.re/3WgEyrH