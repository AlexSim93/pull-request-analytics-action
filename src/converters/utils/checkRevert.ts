export const checkRevert = (branch: string) => {
    return /^revert-\d+/.test(branch);
};
