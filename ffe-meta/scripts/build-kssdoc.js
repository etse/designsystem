const path = require('path');
const fs = require('fs');
const jsonfile = require('jsonfile');
const kss = require('kss');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const getKSSDoc = configFile => {
    const baseDir = path.dirname(configFile);

    const resolvePackageJson = p => {
        if (p === baseDir || p === '/') {
            return false;
        }

        const n = path.join(p, 'package.json');

        if (fs.existsSync(n)) {
            const { name, version } = jsonfile.readFileSync(n);
            return {
                name,
                version,
                path: p,
            };
        }

        return resolvePackageJson(path.dirname(p));
    };

    const resolveSource = source => {
        const { name, version, ...pkg } = resolvePackageJson(source.path);

        return {
            name,
            version,
            file: {
                repo: path.relative(baseDir, source.path),
                package: path.relative(pkg.path, source.path),
                line: source.line,
            },
        };
    };

    return jsonfile.readFile(configFile).then(({ source }) =>
        kss({
            json: true,
            source: source.map(d => path.resolve(baseDir, d)),
        }).then(d =>
            d.sections.map(section => ({
                ...section,
                source: resolveSource(section.source),
            })),
        ),
    );
};

getKSSDoc(path.resolve(__dirname, '../../kss-config.json'))
    .then(obj => `module.exports = ${JSON.stringify(obj)};`)
    .then(code => writeFile(path.resolve(__dirname, '../kssdoc.js'), code));
