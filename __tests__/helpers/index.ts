export const tryNoError = (fn: () => never): void => {
    try {
        fn()
    // eslint-disable-next-line no-empty
    } catch(_e){}
}