import AsyncStorage from '@react-native-community/async-storage'


const deviceStorage = {
    // our AsyncStorage functions will go here :)
    async saveJWT(value) {

        try {
            await AsyncStorage.setItem('authState', JSON.stringify(value));
        }
        catch (e) {
            console.log('async storage set item error', e)
        }

    },

    loadJWT() { return new Promise(async (resolve, reject) => 
      {
        try {
            const token = await AsyncStorage.getItem('authState')
            if (token) {
                const tokenObj = JSON.parse(token)
                console.log('tokenobj', tokenObj)
                resolve(tokenObj)
            }
            else{
                reject("no token results")
            }

        }
        catch (e) {
            console.log('async storage get item error', e)
            reject(e)
        }
    })},

    async deleteJWT() {
        try {
            await AsyncStorage.removeItem('authState')
        }
        catch (e) {
            console.log('async storage delete error', e)
        }

    },
    logCurrentStorage() {
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                let myStorage = {};
                for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                }

                console.log('CURRENT STORAGE: ', myStorage);
            })
        });
    }


};

export default deviceStorage;