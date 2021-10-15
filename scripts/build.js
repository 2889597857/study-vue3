const execa = require('execa');
const fs = require('fs');

const dirs = fs
    .readdirSync("packages")
    .filter(path => fs.statSync(`packages/${path}`).isDirectory())// 判断是否为文件夹


async function build (target) {
    await execa(
        'rollup',
        [
            '-c',
            '--environment',
            `TARGET:${target}`,
        ],
        {
            stdio: "inherit"
        }
    )
}

// 并行打包所有文件
async function runParallel (dirs, itemFunc) {
    const result = []
    for (const item of dirs) {
        result.push(itemFunc(item))
    }
    return Promise.all(result)
}
runParallel(dirs, build)
    .then(() => console.log('成功'))
    .catch(err => console.log(err))