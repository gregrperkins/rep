{
  /////////////////////////////////////////////////////////////////////////
  // Name, input paths, modules
  /////////////////////////////////////////////////////////////////////////
  "id": "rep",

  "paths": [
    "test",
    "rep"
  ],

  "modules": {
    "rep": {
      "inputs": [
        "rep/emitter.js",
        "rep/model.js",
        "rep/scopablemodel.js"
        ],
      "deps": []
    },

    "person_test": {
      "inputs": "test/person_test.js",
      "deps": ["rep"]
    },
    "locality_test": {
      "inputs": "test/locality_test.js",
      "deps": ["rep"]
    },
    "emitter_test": {
      "inputs": "rep/emitter_test.js",
      "deps": ["rep"]
    }
  },

  /////////////////////////////////////////////////////////////////////////
  // Docs, development options
  /////////////////////////////////////////////////////////////////////////
  "export-test-functions": true,
  "jsdoc-html-output-path": "docs",

  /////////////////////////////////////////////////////////////////////////
  // Compilation options
  /////////////////////////////////////////////////////////////////////////
  "mode": "ADVANCED",
  "level": "VERBOSE"
}
