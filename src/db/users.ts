import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type:String, required: true},
    authentication: {
        password: {type: String, required: true, select: false}, //select false evita proporcionar a toda la API los datos de autenticación
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false}

    }
})

//Convertimos el esquema en modulo
export const UserModel = mongoose.model('User', UserSchema);


//Creación de acciones para controladores
export const getUsers = () => UserModel.find();

export const getUserByEmail = (email : string) => UserModel.findOne({email});

export const getUserBySessionToken = (sessionToken : string ) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});

export const getUserById = (id:string) => UserModel.findById(id);

export const createUser = (values: Record<string,any>) => new UserModel(values).save().then((user)=>user.toObject());

export const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id : id});

export const updateUserById = (id:string, values: Record<string,any>) => UserModel.findByIdAndUpdate(id, values);