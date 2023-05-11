export const validateAPIKey = (apiKey:string | undefined): Boolean => {
    if(apiKey === undefined) {
        return false;
    }
    var regexp= new RegExp("^(?!\s*$).+");
    return regexp.test(apiKey);
};