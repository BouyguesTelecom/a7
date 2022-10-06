[![Docker Image CI](https://github.com/BouyguesTelecom/a7/actions/workflows/docker-image.yml/badge.svg)](https://github.com/BouyguesTelecom/a7/actions/workflows/docker-image.yml)

[![Unit tests](https://github.com/BouyguesTelecom/a7/actions/workflows/unit-tests.js.yml/badge.svg?branch=main)](https://github.com/BouyguesTelecom/a7/actions/workflows/unit-tests.js.yml)

<div align='center'>

# A7

**Enterprise-grade cloud-native solution for serving immutable static assets**

**[🤿 Dive in!](#getting-started)**

</div>

---

## Motivation

Static resources *(aka assets)* are prevalent in web projects. Yet one could say they have been sidelined for a long time, as handling these assets present particular challenges:

- **Naming:** For most, these resources are few- a bit of a css, fonts and images. For some, these resources are manifold, and teams have to leverage some cognitive ingeniosity to architect and name directories; and either drop files in ill-named folders 🙈 or reinvent the wheel by imagining new conventions.

  🔠 **A7 enforces naming conventions**, based on [semantic versioning](https://semver.org/) and [industry standards](#inspirations).

- **Serving:** Serving these assets is currently handled by: **(a)** the application server itself; and/or **(b)** a static storage service; and/or **(c)** a <abbr title='Content Delivery Network'>CDN</abbr> for nearby-server delivery.

  💁 **A7 is a Docker-ready application server dedicated to static resources**, that is portable and gives you the best of both worlds: use it locally or as a remote service, integrated in a cloud.

- **Caching:** Relying on static storage services or <abbr title='Content Delivery Network'>CDN</abbr> services brings value to the table, part of which is fine-tuned caching mechanism; this is clearly not always the case with custom implementations.

  🐦 **A7 serves assets with immutability as standard** [all through](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Extension_Cache-Control_directives).

... to name a few. A7 also addresses redirections (with [smart redirects](#adopt-smart-routing-conventions)), custom domains handling, CORS support, security, compressed directory download, resources discovery (with an [API](#api-mode)), centralized assets with a focus on reuse.

## Getting started

1. Given a **directory of assets** `<my-assets-dir>` containing all the assets to serve:

   <details id=assets-dir-guidelines><summary>Directory guidelines & structure example</summary><br>

    **Guidelines:**

    1. An **asset** is a static file, whose [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) is readable and operable by a web browser;

    2. An asset must be placed within a **package directory** at the root;

    3. A package directory can be of different flavors, with either:

         - `<package-name>@<package-version>`; or
         - `@<package-scope>/<package-name>@<package-version>`; or
         - `<package-namespace>/<package-name>@<package-version>`.

       In the case of a scoped or namespaced package, the package directory is composed of two folders.

    4. The organization of assets within the package directory is free (the asset files can be contained in file structures of any depth and hierarchy);

    5. There can be a **default path** that refers to one asset as the resource fallback, for when a request does not specify one;

    **Directory structure example:**

    The assets directory must be structured as follows:

    ```r
    <my-assets-dir>/
      foo@1.3.0/            # standard package
        path/to/file.js
      foo@1.3.1/            # patched version
        path/to/file.js
      foo@1.4.0/            # more/most recent release
        path/to/file.js
      @myscope/
        bar@1.0.0/          # scoped package
          dist/file.css
          dist/font.woff2
    ```

   </details>

2. Given an **assets catalog** file that references all the assets:

   <details id=assets-catalog><summary>Assets catalog example</summary><br>

    ```json5
    // <my-assets-dir>/.catalog.json
    [
      {
        "name": "foo@.1.3.0",
        "defaultPath": "dist/file.js"
      },{
        "name": "foo@1.3.1",
        "defaultPath": "dist/file.js"
      },{
        "name": "foo@1.4.0",
        "defaultPath": "dist/file.js"
      },{
        "name": "@myscope/bar@1.0.0",
        "defaultPath": "dist/file.css"
      }
    ]
    ```

   </details>

3. Start a service container:

    ```shell
    $ ASSETS_PATH=<my-assets-dir>
    $ docker run -it \
        -p 45537:45537 \
        -e A7_VOLUME_MOUNT_PATH=$ASSETS_PATH \
        -v $(pwd)/assets:$ASSETS_PATH \
        bouyguestelecom/a7
    ```

4. Access it: **<http://localhost:45537>**

*See the [integrations](#integrations) section for more use cases, such as with docker compose.*

## Use cases

- Host images, illustrations and logotypes;
- Serve a common CSS framework and its webfonts;
- Serve [micro frontend](https://micro-frontends.org/) static applications;
- ... and more.

## Features

### Assets are immutable

An asset is *immutable*: for a given version of the package its content won't change. Ever.

In order to enforce this trait, the [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Extension_Cache-Control_directives) header is used extensively, with the [`immutable`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Extension_Cache-Control_directives) value, indicating that the response body will not change over time.

### Handle every request

When requesting unknown or uncertain content, A7 tries its best to handle requests by:

1. directly serving the requested content (for fully-qualified URLs);
2. indirectly serving the requested content (for URLs with special or missing parts) through a [smart redirect](#adopt-smart-routing-conventions);
3. serving a 404 status page by default.

### Adopt smart routing conventions

**Prerequisite:** Set the `A7_PATH_AUTO_EXPAND` environment variable to `true`.

By relying on [semantic versioning](https://semver.org/) conventions, some [industry standards](#inspirations), and by extending them a bit, A7 supports all the following routing resolutions to the table.

**Also:** Set the `A7_PATH_AUTO_EXPAND_INIT` environment variable to `true` or `always` in order to generate the metadata files in all the assets subdirectories (`true` will generate metadata files if a prior existing file; `always` will generate metadata files systematically and overwrite any prior existing file).

#### Fully qualified URI

> `/foo@1.3.0/path/to/file.js`
> <br>➔ `Status: 200`

Here, we request a URL with complete information about the requested asset (package name, version, and path).

#### URI with missing path

> `/foo@1.3.0`
> <br>➔ `Status: 302; Location: /foo@1.3.0/path/to/file.js`
> <br>&nbsp; &nbsp; ➔ `Status: 200`

Here, we request a URL with a package name, and a precise package version, but no path. In such a situation, the `"defaultPath"` of the matching catalog entry is used.

#### URI with incomplete semver

> `/foo@1.3`
> <br>➔ `Status: 302; Location: /foo@1.3.1/path/to/file.js`
> <br>&nbsp; &nbsp; ➔ `Status: 200`
>
> `/foo@1`
> <br>➔ `Status: 302; Location: /foo@1.4.0/path/to/file.js`
> <br>&nbsp; &nbsp; ➔ `Status: 200`
>
> `/foo@1-snapshot`
> <br>➔ `Status: 302; Location: /foo@1.4.0-snapshot.20201203171530/path/to/file.js`
> <br>&nbsp; &nbsp; ➔ `Status: 200`

Here, we request a URL with a package name, and an imprecise package version, and no path. In such a situation, the `"defaultPath"` of the matching catalog entry is used to complete the path part. The version is also expanded into the latest version that best matches the request.

#### Latest version

> `/foo@latest`
> <br>➔ `Status: 302; Location: /foo@1.4.0/path/to/file.js`
> <br>&nbsp; &nbsp; ➔ `Status: 200`

Here, we request the absolute latest version of a package.

⚠️ This is highly discouraged in production.

#### Scoped & namespaced package

> `/@myscope/bar@1.0.0/dist/file.css`
> <br>➔ `Status: 200`
>
> `/namespaced/baz@2.0.0/dist/file.js`
> <br>➔ `Status: 200`

As packages can be scoped or namespaced, these cases are also handled by the same rules of fully-qualified and incompleted URIs.

#### Unknown URI

> `/unexpected@1`
> <br>➔ `Status: 404`

When requesting something strange, or a missing asset, a 404 HTTP response is returned.

### Browsable

**Prerequisite:** Set the `A7_AUTOINDEX` environment variable to `true`.

> `/foo@1.3.0/`<br>
> `/foo@1.3.0/path/`<br>
> `/foo@1.3.0/path/to/`

Any request ending with the `/` character indexes its own resources and displays them in a browsable web page.

Any request with the `?catalog` query string enables access to the corresponding assets catalog (in JSON mode) and makes exploring resources possible through a basic API endpoint, dedicated to listing all the current directory assets.

### API mode

**Prerequisite:** Set the `A7_META_QUERIES` environment variable to `true`.

Any request containing the `?meta` query string enables the API mode and makes exploring resources possible through a basic API.

### Compressed directories

**Prerequisite:** Set the `A7_ZIP_DIRECTORIES` environment variable to `true`.

Directories can be downloaded in a singled `zip` file. Any request to a directory URI, with the `.zip` extension appended will start downloading the directory in a zip file, on-the-fly.

### CORS

**Prerequisite:** Set the `A7_CORS_ALL` environment variable to `true`. Optionally: set the `A7_META_QUERIES_CORS_ALL` environment variable to `true`.

Make the resources available for use by any domain by relying on the following Cross-Origin Resource Sharing (CORS) configuration:

```json
Access-Control-Allow-Origin: *
```

### Personalization

Make the service yours with two white-label features:

- `A7_TITLE` lets you change the name of the service;
- `A7_ICON` lets you change the icon of the service;
- `A7_BRAND_COLOR` lets you change the color of the top hero banner.

These two properties will appear in the browsing UI.

### Restrict HTTP methods

With `A7_GET_REQUESTS_ONLY`, restrict the usage of HTTP methods to only `HEAD` and `GET`.

### Internal APIs

**Prerequisite:** Set the `A7_AUTOINDEX` environment variable to `true`. Optionally: set the `A7_AUTOINDEX_CORS_ALL` environment variable to `true`.

The `A7_INTERNAL_API` environment variable (true by default) lets you disable the write and search internal APIs used to enhance the browsing UI experience.

Note: writing files to disk requires write permissions on the mounted volume.

## Integrations

### with `Docker` from sources

```shell
docker build -t a7 .
docker run -p 45537:45537 -v $(pwd)/assets:/assets -it a7
open http://localhost:45537
```

### with `docker-compose`

1. Prepare your `docker-compose.yml`:

    ```yaml
    version: "2.0"

    services:
      a7:
        build:
          context: .
        environment:
          - A7_VOLUME_MOUNT_PATH=<my-assets-dir>
          - A7_AUTOINDEX=true
          - A7_AUTOINDEX_CORS_ALL=true
          - A7_ZIP_DIRECTORIES=true
          - A7_META_QUERIES=true
          - A7_META_QUERIES_CORS_ALL=true
          - A7_CORS_ALL=true
          - A7_PATH_AUTO_EXPAND=true
          - A7_PATH_AUTO_EXPAND_INIT=false
          - A7_RUN_SCRIPTS_ONLY=false
          - A7_GET_REQUESTS_ONLY=true
          - A7_INTERNAL_API=true
          - A7_TITLE=A7
          - A7_ICON=📦
        ports:
          - 45537:45537
        volumes:
          - ./assets:<my-assets-dir>
    ```

2. Run it: `docker-compose up`

3. Access it: <http://localhost:45537>

## Inspirations
These two services have been a source of inspiration in the conceptual design of the service:

- [unpkg](https://unpkg.com/#examples)
- [jsdelivr](https://www.jsdelivr.com/features)

## Licenses
* A7 is released under Apache 2.0 licence

### Dependencies
A7 relies on dependencies that are downloaded at build time. These dependencies might have their own licenses, notably:
* Nginx is released under BSD 2-clauses licence
* mod_zip is released under BSD 3-clauses licence
