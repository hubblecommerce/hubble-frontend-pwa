import _ from 'lodash';

class localStorageHelper {
    static setCreatedAt(entity) {
        return new Promise((resolve) => {
            _.assign(entity, {createdAt: new Date().getTime()});
            resolve(entity);
        })
    }

    static lifeTimeIsValid(entity, lifetime) {

        // Return if createdAt property isn't set
        if(!_.has(entity, 'createdAt')) {
            return false;
        }

        // Add lifetime to created at date
        let endOfLife = entity.createdAt + (lifetime*60*60*1000);
        let now = new Date().getTime();

        // Return true if end of life is bigger than now
        return now < endOfLife;
    }

    static updateCreatedAt(entity) {
        return new Promise((resolve) => {
            entity.createdAt = new Date().getTime();
            resolve(entity);
        })
    }
}

export default localStorageHelper;
