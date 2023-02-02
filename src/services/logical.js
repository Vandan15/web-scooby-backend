exports.parseObj = (obj) => {
    let newPayload = {}
    if(Object.keys(obj).length > 0){
        for (let [key, value] of Object.entries(obj)) {
        try{
            newPayload[key] = JSON.parse(typeof value === "string" ? value.trim() : value)
        } catch (err){
            newPayload[key] = typeof value === "string" ? value.trim() : value
        }}
    } 
    return newPayload
}