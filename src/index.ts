import * as os from 'os';
import * as childProcess from 'child_process';
import * as path from 'path';

export interface TokeiStat {
    blanks: number;
    code: number;
    comments: number;
    lines: number;
    name: string;
}

export interface TokeiResult {
    blanks: number;
    code: number;
    comments: number;
    stats: TokeiStat[]
}

export default function tokei(
    paths: string[] | string,
    exclude?: string[] | string
) : Promise<{[language: string] : TokeiResult}> {
    if(!Array.isArray(paths)) paths = [paths];
    if(!Array.isArray(exclude)) exclude = [exclude];
    const executableName = os.platform() === 'win32' ? 'win32.exe' : os.platform();
    const child = childProcess.spawn(
        path.resolve(__dirname, `../binaries/${executableName}`),
        [...paths, '--output', 'json', '--exclude', ...exclude]
    );
    let output = '';
    child.stdout.on('data', (data) => {
        output += data;
    });
    let error = '';
    child.stderr.on('data', (data) => {
        error += data;
    });
    return new Promise((resolve, reject) => {
        child.on('exit', (code) => {
            if(code !== 0){
                console.log(error);
            }
            try {
                const parsed = JSON.parse(output);
                return resolve(parsed);
            } catch (e) {
                return reject(e);
            }
        });
        child.on('error', (err) => {
            return reject(err);
        })
    })
}
