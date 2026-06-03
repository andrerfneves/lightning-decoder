export const validateInternetIdentifier = (internetIdentifier) => {
    var re = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]+$/;
    return re.test(internetIdentifier);
}