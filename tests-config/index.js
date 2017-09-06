// test files
const testsContext = require.context('../src/', true, /_test\/index.js$/);
testsContext.keys().forEach(testsContext);

// source file
const componentsContext = require.context('../src/', true, /^\.\/.*\.js$/);
componentsContext.keys()
    .forEach((file) => {
        if (file.includes('_test/') || file.includes('lib/')) return;
        componentsContext(file);
    });
