import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-node-resolve'
import path from 'path'

const resolve = p => path.resolve(packageDir, p) // 打包路径

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)// 获取打包路径
const pkg = require(resolve(`package.json`)) //获取每个包的package.json
const packageOptions = pkg.buildOptions || {} // 获取打包格式选项
const name = packageOptions.filename || path.basename(packageDir)

const outputConfigs = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: `es`
    },
    cjs: {
        file: resolve(`dist/${name}.cjs.js`),
        format: `cjs`
    },
    global: {
        file: resolve(`dist/${name}.global.js`),
        format: `iife`
    }
}

function createConfig (format, output) {
    output.name = packageOptions.filename
    output.sourcemap = true
    // 生成rollup配置
    return {
        input: resolve('src/index.ts'),
        plugins: [
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            replace()
        ],
        output,
    }
}
export default packageOptions.formats.map(format => createConfig(format, outputConfigs[format]))