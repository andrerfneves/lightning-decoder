export const validateInternetIdentifier = (internetIdentifier) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(internetIdentifier);
}