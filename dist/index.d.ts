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
    stats: TokeiStat[];
}
export default function tokei(paths: string[] | string, exclude?: string[] | string): Promise<{
    [language: string]: TokeiResult;
}>;
