import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import autoExternal from 'rollup-plugin-auto-external';
import cleanup from 'rollup-plugin-cleanup';

const config = [
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'cjs'
            },
            {
                name: '',
                file: '',
                format: 'umd',
                globals: {}
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                runtimeHelpers: true,
                presets: [
                    [
                        '@babel/env',
                        {
                            modules: false,
                            targets: {
                                node: '8',
                                browsers: 'last 2 versions'
                            }
                        }
                    ]
                ],
                plugins: [
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-export-namespace-from',
                    ['@babel/plugin-transform-runtime', {
                        'helpers': true,
                        'regenerator': true
                    }]
                ]
            }),
            json(),
            autoExternal(),
            cleanup()
        ]
    }
];

/**
 * Returns the rollup configuration with globals and names set.
 *
 * @param {String} name
 * @param {String} outputFileName
 * @param {Object} globals
 * @param {Boolean} ignoreEsm
 *
 * @returns {Array}
 */
export default (name, outputFileName, globals, ignoreEsm) => {
    // CJS
    config[0].output[0].file = 'dist/' + outputFileName + '.cjs.js';

    // UMD
    config[0].output[1].name = name;
    config[0].output[1].file = 'dist/' + outputFileName + '.umd.js';
    config[0].output[1].globals = globals;

    if (!ignoreEsm) {
        config[1] = {
            input: 'src/index.js',
            output: [
                {
                    file: 'dist/' + outputFileName + '.esm.js',
                    format: 'es'
                }
            ],
            plugins: [
                babel({
                    exclude: 'node_modules/**',
                    plugins: [
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-export-namespace-from'
                    ]
                }),
                json(),
                autoExternal(),
                cleanup()
            ]
        };

        if (name === 'Web3') {
            config[1].input = 'src/Web3.js';
        }
    }

    if (name === 'Web3') {
        config[0].input = 'src/Web3.js';
    }

    return config;
};
