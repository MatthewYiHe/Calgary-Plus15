import PathFinder from 'geojson-path-finder'
import polygonToLine from '@turf/polygon-to-line'
import explode from '@turf/explode'
import nearest from '@turf/nearest-point'
import geojson from '../Plus15.geojson'

const convertFeatureCollToLineString = (coll) => {
  coll.features = coll.features.map(feature => {
    if (feature) feature.geometry = polygonToLine(feature.geometry).features[0].geometry
    return feature;
  })
  return coll;
}

const collLineString = convertFeatureCollToLineString(geojson);

export const nearestPoint = (point) => nearest(point, explode(geojson));
export const pathFinder = new PathFinder(collLineString);