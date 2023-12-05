
//Dao con Memory
export default class UserDao {
    constructor(){
        this.data= [];//poner la info en array
    }
    async getAll(){
        return this.data;
    }
    async save(data){
        this.data.push(data)
    }
}