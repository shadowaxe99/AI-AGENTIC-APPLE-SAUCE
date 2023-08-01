/* eslint-disable import/no-extraneous-dependencies */

const yaml = require('js-yaml')
const fs = require('fs');

const spec = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'))

function isObjEmpty (obj) {
  return Object.keys(obj).length === 0;
}

const components = spec['components']

if (components) {
  Object.keys(components).forEach((key) => {
    // Delete empty component schemas
    if (isObjEmpty(components[key])) {
      delete components[key]
    }
  })

  // Delete components if empty
  if (isObjEmpty(components)) {
    delete spec['components']
  }
}

const paths = spec['paths']

if (paths) {
  Object.keys(paths).forEach((key) => {
    // Delete empty paths
    if (isObjEmpty(paths[key])) {
      delete paths[key]
    }


    Object.keys(paths[key]).forEach((method) => {
      // Delete empty methods
      if (isObjEmpty(paths[key][method])) {
        delete paths[key][method]
      }

      // Delete security if empty
      if (paths[key][method]['security']) {
        if (paths[key][method]['security'].length === 0) {
          delete paths[key][method]['security']
        }
      }
    })
  })
}

fs.writeFileSync('openapi.yaml', yaml.dump(spec, { sortKeys: true, indent: 2, condenseFlow: true, noArrayIndent: true, noCompatMode: true, lineWidth: -1 }))
