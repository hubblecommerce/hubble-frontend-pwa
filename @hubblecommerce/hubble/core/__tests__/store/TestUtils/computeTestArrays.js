export async function generateTestArray(expectedData){
    let tempArray = []
    for ( let temp in expectedData){
        let tempElem
        let tempChildArray= []
        
        if(expectedData[temp] != null && typeof expectedData[temp] == 'object'){
            for(let tempChild in expectedData[temp]){
                tempElem = [
                    tempChild,
                    typeof expectedData[temp][tempChild],
                    expectedData[temp][tempChild]
                ]
                tempChildArray.push(tempElem)
            }
            tempElem = [
                temp,
                tempChildArray
            ]
        }
        else{
            tempElem = [
                temp,
                typeof expectedData[temp],
                expectedData[temp]
            ]
        }
        tempArray.push(tempElem)
    }

    return tempArray
}