function Type(data, description) {
  var keys = Object.keys(description)
  description.isValid = function() {
    var valid = true
    keys.forEach(k => valid = valid && description[k](data[k]).isValid())
    return valid
  }
  return description
}

function SubType(data, description) {
  return description
}

function isType(type) {
  return typeof type === 'function'
  // really we need an example for each, and if does not meet the spec, then throw
  // return true &&
  //   type(type.example).hasOwnProperty('basetype') &&
  //   type(type.example).hasOwnProperty('type') &&
  //   type(type.example).hasOwnProperty('isValid') &&
  //   type(type.example).hasOwnProperty('data') &&
  //   true

}

const types = {
  string: (data) => SubType(data, {
    basetype: 'string'
  , type: 'string'
  , isValid() { return typeof data === 'string' }
  , get data() { return ""+data }
  })
, number: (data) => SubType(data, {
    basetype: 'number'
  , type: 'number'
  , isValid() { return typeof data === 'number' }
  , get data() { return +data }
  })
, list: (dataType) => {
   if(!isType(dataType)) { throw new Error(`not a type: ${typeof dataType} - ${dataType}`) }
   return (dataList) =>
      isArray(dataList)
      ? Type(dataList, dataList.map(e => dataType))
      : types.invalidList(dataList)
  }
, invalidList: (data) => SubType(data, {
    basetype: 'object'
  , type: 'invalid list'
  , isValid() { return false }
  , get data() { return data }
  })
, invalid: (data) => SubType(data, {
    basetype: 'type'
  , type: 'invalid type'
  , isValid() { return false }
  , get data() { return data }
  })
}

function isArray(potentialArray) {
  return true &&
    potentialArray !== null &&
    potentialArray !== 0 &&
    potentialArray !== undefined &&
    potentialArray !== false &&
    potentialArray !== '' &&
    typeof potentialArray === 'object' &&
    typeof potentialArray.length === 'number' &&
    !! potentialArray.map &&
    true
}

module.exports = { Type, SubType, types, isArray }
