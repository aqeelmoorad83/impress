'use strict';

var config = {
  sessions: {
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    secret:     'secret',
    length:     64
  }
};

impress.test({
  'api.impress.localIPs': [
    [ [], function(value) { return Array.isArray(value); } ],
  ],
  'api.impress.generateSID': [
    [ config, function(result) { return result.length === 64; } ],
  ],
  'api.impress.crcSID': [
    [ config, generateKey(config.sessions.length - 4, config.sessions.characters), function(result) {
      return result.length === 4;
    } ]
  ],
  'api.impress.validateSID': [
    [ config, 'ag0DEZqImmOPOQxl1DCIJh5KvSr4OX6wE2tDoVybqNrs1jLhimN7zV6mCPyl5b96', true  ],
    [ config, 'ag0DEZqImmOfOQxl1DCIJh5KvSr4OX6wE2tDoVybqNrs1jLhimN7zV6mCPyl5b96', false ],
    [ config, '2XpU8oAewXwKJJSQeY0MByY403AyXprFdhB96zPFbpJxlBqHA3GfBYeLxgHxBhhZ', false ],
    [ config, 'WRONG-STRING', false ],
    [ config, '',             false ],
  ],
  'api.impress.subst': [
    [ 'Hello, @name@',  { name:'Ali' }, '', true,                   'Hello, Ali' ],
    [ 'Hello, @.name@', { person: { name:'Ali' } }, 'person', true, 'Hello, Ali' ],
  ],
  'api.impress.getByPath': [
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.value',            'Gagarin' ],
    [ { item: { subitem: { value: 123       } } }, 'item.subitem.value',                  123 ],
    [ { item: { subitem: { value: true      } } }, 'item.subitem.value',                 true ],
    [ { item: { subitem: { value: false     } } }, 'item.subitem.value',                false ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.none',             undefined ],
    [ { item: { subitem: { value: null      } } }, 'item.subitem.value',                 null ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.none.value',               undefined ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem',       { value: "Gagarin" } ],
  ],
  'api.impress.setByPath': [
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.value', 'Gagarin',             true ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.none',  'Gagarin',             true ],
    [ { item: { subitem: { value: 123       } } }, 'item.subitem.value', 123,                   true ],
    [ { item: { subitem: { value: true      } } }, 'item.subitem.value', true,                  true ],
    [ { item: { subitem: { value: false     } } }, 'item.subitem.value', false,                 true ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.none',  undefined,             true ],
    [ { item: { subitem: { value: null      } } }, 'item.subitem.value', null,                  true ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.none.value',    undefined,            false ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'none.value',         123,                  false ],
    [ { item: { subitem: { value: 'Gagarin' } } }, 'item.subitem',       { value: "Gagarin" },  true ],
  ],
  'api.impress.deleteByPath': [
    [ { item: { surname: 'Gagarin', name: 'Yuri' } }, 'item.name',    true ],
    [ { item: { surname: 'Gagarin', name: 'Yuri' } }, 'item.noname', false ],
    [ { item: { surname: 'Gagarin', name: 'Yuri' } }, 'item',         true ],
    [ { item: { surname: 'Gagarin', name: 'Yuri' } }, 'unknown',     false ],
  ],
  'api.impress.htmlEscape': [
    [ 'text',                         'text' ],
    [ '<tag>',                 '&lt;tag&gt;' ],
    [ 'You &amp; Me',     'You &amp;amp; Me' ],
    [ 'You & Me',             'You &amp; Me' ],
    [ '"Quotation"', '&quot;Quotation&quot;' ],
  ],
  'api.impress.fileExt': [
    [ '/dir/dir/file.txt', 'txt' ],
    [ '/dir/dir/file.txt', 'txt' ],
    [ '\\dir\\file.txt',   'txt' ],
    [ '/dir/dir/file.txt', 'txt' ],
    [ '/dir/file.txt',     'txt' ],
    [ '/dir/file.TXt',     'txt' ],
    [ '//file.txt',        'txt' ],
    [ 'file.txt',          'txt' ],
    [ '/dir.ext/',         'ext' ],
    [ '/dir/',             ''    ],
    [ '/',                 ''    ],
    [ '.',                 ''    ],
    [ '',                  ''    ],
  ],
  'api.impress.isTimeEqual': [
    [ '2014-01-01', '2014-01-01',  true ],
    [ '2014-01-01', '2014-01-02', false ],
    [ '1234-12-12', '1234-12-12',  true ],
    [ '1234-12-12', '4321-12-21', false ],
  ],
  'api.impress.parseHost': [
    [ '',                'no-host-name-in-http-headers' ],
    [ 'domain.com',      'domain.com' ],
    [ 'localhost',       'localhost'  ],
    [ 'domain.com:8080', 'domain.com' ],
  ],
  /*'api.impress.removeBOM': [
    [ new Buffer('\uBBBF\uFEFFabc', 'utf8'), 'abc' ],
    [ new Buffer('\uBBBF\uFEFF', 'utf8'),    ''    ],
    [ new Buffer('\uFEFFabc', 'utf8'),       'abc' ],
    [ new Buffer('\uBBBFabc', 'utf8'),       'abc' ],
    [ new Buffer('\uFEFF', 'utf8'),          ''    ],
    [ new Buffer('\uBBBF', 'utf8'),          ''    ],
    [ new Buffer('abc', 'utf8'),             'abc' ],
    [ 'abc',                                 'abc' ],
  ],*/
  'api.impress.arrayRegExp': [
    [ ['*'],                 '^.*$' ],
    [ ['/css/*','/folder*'], '^((\\/css\\/.*)|(\\/folder.*))$' ],
    [ ['/','/js/*'],         '^((\\/)|(\\/js\\/.*))$' ],
    [ ['/css/*.css'],        '^\\/css\\/.*\\.css$' ],
    [ ['*/css/*'],           '^.*\\/css\\/.*$' ],
  ],
  'api.impress.nowDate': [
    [ new Date('2014-12-12 12:30:15.150'), '2014-12-12' ],
    [ new Date('2014-12-12 12:30:15'),     '2014-12-12' ],
    [ new Date('2014-12-12 12:30'),        '2014-12-12' ],
    [ new Date('2014-12-12'),              '2014-12-12' ],
  ],
  'api.impress.sortCompareConfig': [
    [ 'files.js', 'sandbox.js',       1 ],
    [ 'filestorage.js', 'routes.js', -1 ],
    [ 'unknown.js', 'sandbox.js',     1 ],
    [ 'log.js', 'sandbox.js',         1 ],
    [ 'sandbox.js', 'sandbox.js',     0 ],
    [ 'log.js', 'log.js',             0 ],
    [ 'tasks.js', 'application.js',  -1 ],
  ],
  'api.impress.sortCompareDirectories': [
    [ { name: '/abc' },     { name: 'abc.ext' },  -1 ],
    [ { name: 'ABC.ext' },  { name: '/abc' },      1 ],
    [ { name: 'abc' },      { name: 'ABC.ext' },   1 ],
    [ { name: '/ABC' },     { name: '/abc.ext' }, -1 ],
    [ { name: '/abc.ext' }, { name: '/ABC' },      1 ],
    [ { name: '/abc.ext' }, { name: '/ABC' },      1 ],
    [ { name: '/ABC' },     { name: '/ABC' },      0 ],
    [ { name: 'abc.ext' },  { name: 'abc.ext' },   0 ],
    [ { name: 'abc.ext' },  { name: 'def.ext' },  -1 ],
    [ { name: 'def.ext' },  { name: 'abc.ext' },   1 ],
  ],
  'api.impress.sortCompareByName': [
    [ { name: 'abc' }, { name: 'def' },  -1 ],
    [ { name: 'def' }, { name: 'abc' },   1 ],
    [ { name: 'abc' }, { name: 'abc' },   0 ],
    [ { name: 'def' }, { name: 'def' },   0 ],
    [ { name: 'abc' }, { name: 'a' },     1 ],
    [ { name: 'a' },   { name: 'abc' },  -1 ],
    [ { name: '123' }, { name: 'name' }, -1 ],
  ],
  'api.impress.clearCacheStartingWith': [
    [ { abc: '123', abcd: '1234', abcde: '12345' }, 'abcd',               { abc: '123' } ],
    [ { abc: '123', abcd: '1234', abcde: '12345' }, 'a',                             { } ],
    [ { abc: '123', abcd: '1234' }, 'qwer',                 { abc: '123', abcd: '1234' } ],
    [ { abc: '123', abcd: '1234' }, 'abc',                                           { } ]
  ]
});