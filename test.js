var val = require('./index')
  , tape = require('tape')
  , test = tape
  , log = console.log.bind(console)
  , Type = val.Type
  , SubType = val.SubType
  , types = val.types
  , string = types.string
  , number = types.number
  , list = types.list
  , isArray = val.isArray

describe = (namespace, fn) => {
  namespace.toString = () => namespace.join(' ')
  fn(namespace)
}

describe(['base types'], namespace => (
  test(''+namespace, t => (
    t.ok(true, 'something generic')
  , t.end()
  ))
, namespace.push('strings')
  , test(''+namespace, t => (
      t.ok(string('a string').isValid(), 'string validates')
    , t.ok(string('').isValid(),         'empty string validates')
    , t.notOk(string(4).isValid(),       'string invalidates number')
    , t.end()
    ))
, namespace.splice(-1,1,'numbers')
  , test(''+namespace, t => (
      t.ok(number(234).isValid(),          'number validates')
    , t.ok(number(0).isValid(),            '0 validates')
    , t.ok(number(Infinity).isValid(),     'Infinity string validates')
    , t.ok(number(NaN).isValid(),          'NaN string validates')
    , t.notOk(number('asdf').isValid(),    'number invalidates stringt')
    , t.notOk(number(null).isValid(),      'number invalidates null')
    , t.notOk(number(undefined).isValid(), 'number invalidates undefined')
    , t.notOk(number().isValid(),          'number invalidates no parameter')
    , t.end()
    ))
, namespace.splice(-1,1,'list')
  , namespace.push('validations')
    , test(''+namespace, t => (
        t.ok(list(number)([]).isValid(),       'number empty number list')
      , t.ok(list(string)([]).isValid(),       'number empty string list')
      , t.ok(list(number)([3]).isValid(),      'number single element number list')
      , t.ok(list(string)(['asdf']).isValid(), 'number single element string list')
      , t.end()
      ))
  , namespace.pop()
  , namespace.push('invalidations')
    , test(''+namespace, t => (
        t.ok(isArray([]),  'array is array')
      , t.notOk(isArray(), 'nothingness is not array')
      , t.notOk(list(number)(3).isValid(),         'non list of list type is invalid')
      , t.notOk(list(number)(null).isValid(),      'non list of list type is invalid')
      , t.ok((() => {
          try {
            list('string')
            return false
          } catch(e) {
            return true
          }
        })(), 'creating a list with non-typeraises exception')
      , t.end()
      ))
))

var unto = (a, b) => b(a)

describe(['structured types'], namespace => (
  test(''+namespace, t => (
    t.ok(true, 'something generic')
    , t.end()
  ))
, namespace.push('with single attribute')
  , test(''+namespace, t => (
      unto((data => Type(data, { name: string })), badge => (
        t.ok(badge({name: 'asdf'}).isValid(), 'validates type of attribute')
      , t.notOk(badge({name: 4}).isValid(),   'invalidates type of attribute')
      , t.end()
      ))
    ))
, namespace.splice(-1, 1, 'with two attribute')
  , test(''+namespace, t => (
      unto((data => Type(data, { name: string, age: number })), badge => (
        t.ok(badge({name: 'asdf', age: 3 }).isValid(), 'validates type of attribute')

      , t.notOk(badge({name: 'asdf'}).isValid(),       'invalidates single missing attribute')
      , t.notOk(badge({age: 4}).isValid(),             'invalidates single missing attribute')
      , t.notOk(badge({}).isValid(),                   'invalidates all missing attributes')

      , t.notOk(badge({name: 'asdf', age: 'asdf' }).isValid(), 'one attribute of invlid type')
      , t.notOk(badge({name: 3, age: 3 }).isValid(), 'one attribute of invlid type')
      , t.end()
      ))
    ))
, namespace.splice(-1, 1, 'with nested list')
  , test(''+namespace, t => (
      unto((data => Type(data, { id: string, comments: list(string) })), post => (
        t.ok(post({id: 'asdf', comments: [] }).isValid(), 'validates type of attribute with empty list')
      , t.ok(post({id: 'asdf', comments: ['asdf'] }).isValid(), 'validates type of attribute small list')
      , t.notOk(post({id: 'asdf', comments: ['asdf', 3] }).isValid(), 'invalidates with 1/2 wrong nested elemensts')
      , t.notOk(post({id: 'asdf', comments: [3] }).isValid(), 'invalidates with 1/1 nested elements')
      , t.end()
      ))
    ))
))
