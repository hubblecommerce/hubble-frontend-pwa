import _ from 'lodash';

function orderMapping (payload){
    let obj = {};

    obj.orderNumber = payload.orderNumber;
    obj.id = payload.id;
    obj.createdAt = payload.createdAt;
    obj.status_label = payload.stateMachineState.name;
    obj.totals = payload.positionPrice;
    return obj;
}

export {orderMapping};