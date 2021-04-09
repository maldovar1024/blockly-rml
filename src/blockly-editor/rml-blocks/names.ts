/**
 * `dummy_input` 使用 `Dummy` 后缀 \
 * `field_input` 使用 `Value` 后缀 \
 * `field_dropdown` 使用 `Drop` 后缀 \
 * `input_value` 使用 `Input` 后缀 \
 * `input_statement` 使用 `Stat` 后缀
 */
const names = Object.freeze({
  triple_maps: {
    prefixesStat: 'prefixes',
    tripleMapsStat: 'triple_maps',
  },
  prefix: {
    prefixValue: 'prefix',
    fullValueValue: 'value',
  },
  logical_source: {
    filenameValue: 'filename',
    filetypeDrop: 'filetype',
    iteratorDummy: 'iterator_input',
    iteratorValue: 'iterator',
  },
  triple_map: {
    nameValue: 'map_name',
    sourceInput: 'source',
    subjectMapInput: 'subject_map',
    predObjMapsStat: 'predicate_object_maps',
  },
  subject_map: {
    templateValue: 'template',
    classesStat: 'classes',
  },
  rr_class: {
    classValue: 'class',
  },
  predicate_object_maps: {
    predMapsStat: 'predicate_maps',
    ObjMapsStat: 'object_maps',
  },
  predicate_map: {
    typeDrop: 'type',
    mapValue: 'value',
  },
  object_map: {
    typeDrop: 'type',
    mapValue: 'value',
  },
});

export default names;
