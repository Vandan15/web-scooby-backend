
exports.allInOne = async(model, queryName, criteria, updateObject, projections, options) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data
            if(queryName !== "create" && queryName !== "insertMany") {
                data = await model[queryName](criteria).select(projections)
            } else {
                data = await model[queryName](criteria)
            }
            resolve(data)
        } catch(err){
            reject(err)
        }
    })
}