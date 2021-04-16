/**
 * `name`: 块的名字 \
 * `dummy_input` 使用 `Dummy` 后缀 \
 * `field_input` 使用 `Value` 后缀 \
 * `field_dropdown` 使用 `Drop` 后缀 \
 * `input_value` 使用 `Input` 后缀 \
 * `input_statement` 使用 `Stat` 后缀
 */
const names = {
  triple_maps: {
    name: 'triple_maps',
    prefixesStat: 'prefixes',
    tripleMapsStat: 'triple_maps',
  },
  prefix: {
    name: 'prefix',
    prefixValue: 'prefix',
    fullValueValue: 'value',
  },
  base_prefix: {
    name: 'base_prefix',
    uriValue: 'base_uri',
  },
  logical_source: {
    name: 'logical_source',
    filenameValue: 'filename',
    filetypeDrop: 'filetype',
    iteratorDummy: 'iterator_input',
    iteratorValue: 'iterator',
  },
  triple_map: {
    name: 'triple_map',
    nameValue: 'map_name',
    sourceInput: 'source',
    subjectMapInput: 'subject_map',
    predObjMapsStat: 'predicate_object_maps',
  },
  subject_map: {
    name: 'subject_map',
    templateValue: 'template',
    classesStat: 'classes',
  },
  rr_class: {
    name: 'rr_class',
    classValue: 'class',
  },
  predicate_object_maps: {
    name: 'predicate_object_maps',
    predMapsStat: 'predicate_maps',
    objMapsStat: 'object_maps',
  },
  predicate_map: {
    name: 'predicate_map',
    typeDrop: 'type',
    mapValue: 'value',
  },
  object_map: {
    name: 'object_map',
    typeDrop: 'type',
    mapValue: 'value',
    mapValueDummy: 'value_dummy',
    constantLabel: 'constant',
    referenceLabel: 'reference',
    datatypeDummy: 'datatype_dummy',
    datatypeLabel: 'datatype',
    datatypeValue: 'datatype',
    parentMapDummy: 'parent_dummy',
    parentMapLabel: 'Parent Map',
    parentMapValue: 'parent_map',
    joinConditionStat: 'join_conditions',
    joinConditionLabel: 'Join Conditions',
  },
  join_condition: {
    name: 'join_condition',
    childRefValue: 'child_ref',
    parentRefValue: 'parent_ref',
  },
} as const;

export default names;
