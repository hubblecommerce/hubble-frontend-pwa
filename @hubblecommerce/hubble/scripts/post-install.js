const path = require('path');
const fse = require('fs-extra');

const projectDir = process.env.INIT_CWD || path.resolve('../../', __dirname);

fse.exists(path.join(projectDir, '/store/initialStore.js'), function (exists) {
    if (!exists) {
        fse.copy(
            path.join(projectDir, '/node_modules/@hubblecommerce/hubble/initialStore.js'),
            path.join(projectDir, '/store/initialStore.js')
        );
    }
});

fse.exists(path.join(projectDir, '/.env'), function (exists) {
    if (!exists) {
        fse.copy(
            path.join(projectDir, '/node_modules/@hubblecommerce/hubble/.env_example'),
            path.join(projectDir, '/.env')
        );
    }
});

fse.exists(path.join(projectDir, '/static/sw.js'), function (exists) {
    if (!exists) {
        fse.copy(
            path.join(projectDir, '/node_modules/@hubblecommerce/hubble/sw.js'),
            path.join(projectDir, '/static/sw.js')
        );
    }
});
