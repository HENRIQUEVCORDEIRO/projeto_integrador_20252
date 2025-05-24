
declare module "prompt-sync" {
    function prompt(config?: { sigint: boolean }): (text: string) => string;
    export = prompt;
}