export const getCharCodes = (input: string): number[] => {
    return input.split('').map(char => char.charCodeAt(0));
}

export const getStringFromCharArray = (input: number[]): string =>{
    return String.fromCharCode(...input);
}