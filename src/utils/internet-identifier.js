export const validateInternetIdentifier = (internetIdentifier) => {
    const re = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]+$/;
    return re.test(internetIdentifier);
}