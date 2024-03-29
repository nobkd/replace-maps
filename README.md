# Replace Maps

[<img alt="Light blue icon with white border. Shape is a pin for the current position on a map." src="icons/icon.svg" width="128" align="right" />][link-latest-release]

[![CI GitHub Workflow Status][badge-status-ci]][link-workflow-ci]
[![MPL-2.0 License][badge-license]][link-license]
[![Mozilla Add-on Version][badge-amo]][link-amo]

**Replace Google Maps iFrames with OpenStreetMap**

[!['Get Firefox Add-On'-Badge][icon-amo]][link-amo]

## Capabilities

- replace Google Maps embeds with Leaflet map. Using API calls to:
  - [Nominatim Search](https://nominatim.org/release-docs/develop/api/Search/)
  - [OSM Tiles](https://www.openstreetmap.org/)
  - [ArcGIS World Imagery Tiles](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/)
- disable extension for hostnames

## How it Works

This browser extension intercepts web requests from frames in a page.
If the request URL matches the syntax to a Google Maps map, the response will be replaced.
The search parameters of the request are decoded and converted to compatible syntax.
As a result, the response is an extension page that contains a [Leaflet](https://leafletjs.com/) + [OSM](https://www.openstreetmap.org/) + [ArgGIS](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/) map.

You can turn the extension off for every hostname by using the browser action button or by using the settings page.

### Extension Flowchart

```mermaid
flowchart TD

subgraph action [Browser Action]
actionclick(Action Icon) -->|add / remove| storage[(Disabled Hostnames)]
settings(Settings Page) -->|add / remove| storage
end


subgraph reqres [Request-Response Sytem]
    req([Frame Request]) --> url{Matches\nGoogle Maps\nURL?}
    url -->|no| nomatch([Continue Original Request])

    url -->|yes| match{Hostname\nDisabled?}
    storage -->|provide hostnames| match
    match -->|no| res([Redirect to extension map page])
    match -->|yes| nomatch

end

res -->|use params| params

subgraph dec [Search-Param Decoding]
    params(Search Params) -->|has q| q([readQ])
    q -->|with title| pos[Marker/s]
    params -->|has z| zoom[Zoom]

    params -->|has pb| pb([readPB])
    pb -->|has| minfo[Marker Info]
    pb -->|has| marea[Map Area]

    minfo -->|has\nsearch string| q
    minfo -->|has\n0x...:0x...| cid[CID]
    cid -.->|unknown usage| pos
    minfo -->|has\nDMS coords| dms([parseDMS])
    dms --> pos

    pb -->|has| mtype[Map Type]

    marea -->|has\ncoords| mcoords[Map Coords]
    marea -->|has\naltitude| mzoom([getMapZoom])
    mzoom --> zoom

    pos --> mdata[(Map Data)]
    mtype --> mdata
    mcoords --> mdata
    zoom --> mdata
end

mdata -->|use map data| mview([Load Leaflet Map])
```

### Known issues

- Sometimes the zoom level is completely wrong
- Not working when a website does not use an iFrame / embed
- Not working when iFrame uses only CIDs
- No routes, just positions
- If insufficient information is gathered, the map stays blank

<!-- Badges & Links -->
[badge-license]: https://img.shields.io/github/license/nobkd/replace-maps
[badge-amo]: https://img.shields.io/amo/v/replace-maps
[badge-status-ci]: https://img.shields.io/github/actions/workflow/status/nobkd/replace-maps/ci.yml?label=ci

[icon-logo]: icons/icon.svg
[icon-amo]: icons/get-firefox-addon.svg

[link-license]: LICENSE
[link-latest-release]: https://github.com/nobkd/replace-maps/releases/latest
[link-workflow-ci]: https://github.com/nobkd/replace-maps/actions/workflows/ci.yml
[link-amo]: https://addons.mozilla.org/addon/replace-maps/
