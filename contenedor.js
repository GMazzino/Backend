const Producto = require("./producto.js");
module.exports = class Contenedor {
    static prodFile = require ("fs");
    static prodId = 0;
    static fname;

    constructor (fname){
        this.fname=fname;
    }
    async save (data) {
        try{
            const fileContent = await this.getAll();
            data.id = ++Contenedor.prodId;
            fileContent.push(data);
            await Contenedor.prodFile.promises.writeFile(this.fname,JSON.stringify(fileContent,null,2),"utf-8");
            return Promise.resolve(data.id);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    async getById (id) {
        try{
            const fileContent = await this.getAll();
            const selectedProd = fileContent.find(prod => prod.id===parseInt(id));
            return Promise.resolve(selectedProd!=undefined?selectedProd:null);
        }
        catch(err) {
            return Promise.reject(err);
        }
    }

    async deleteById (id) {
        try{
            const fileContent = await this.getAll();
            if(fileContent.findIndex(prod => prod.id===parseInt(id)) != -1){
                const preserveProd = fileContent.filter(prod => prod.id!==parseInt(id));
                await Contenedor.prodFile.promises.writeFile(this.fname,JSON.stringify(preserveProd,null,2),"utf-8");
            } else {
                return Promise.reject("El ID seleccionado no existe!!");
            }
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    async deleteAll () {
        try{
            await Contenedor.prodFile.promises.writeFile(this.fname,"","utf-8");
            return Promise.resolve(`Contenido de ${this.fname} borrado!!`)
        }
        catch (err) {
            return Promise.reject(err.message);
        }
    }

    async getAll () {
        try{
            const fileContent = [];
            let contentStr = await Contenedor.prodFile.promises.readFile(`./${this.fname}`,"utf-8");
            if (contentStr!=""){
                for (let prod of JSON.parse(contentStr)){
                    fileContent.push(new Producto(prod.title,parseFloat(prod.price), prod.thumbnail, prod.id));
                }
                if (fileContent.length > 0){
                    fileContent.map((prod) => {prod.id>Contenedor.prodId?Contenedor.prodId=prod.id:false;})
                }
                return Promise.resolve(fileContent);
            } else {
                return Promise.resolve([]);
            }
        }
        catch (err) {
            throw err;
        }
    }
}