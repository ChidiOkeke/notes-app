import { DataTypes, Model } from "sequelize";
import db from '../config/database.config'
import { NoteInstance } from "./note";

// interface UsersAttributes {
//   id: string;
//   firstname:string;
//   lastname:string;
//   email:string;
//   phonenumber:string;
//   password:string
// }

// export class UserInstance extends Model<UsersAttributes> {}

// UserInstance.init({
//   id: {
//     type:DataTypes.UUIDV4,
//     primaryKey:true,
//     allowNull:false
//   },
//   firstname:{
//      type:DataTypes.STRING,
//      allowNull:false,
//      validate:{
//          notNull:{
//              msg:'first name is required'
//          },
//          notEmpty:{
//              msg:'Please provide a first name'
//          }
//      }
//   },
//   lastname:{
//     type:DataTypes.STRING,
//     allowNull:false,
//     validate:{
//         notNull:{
//             msg:'last name is required'
//         },
//         notEmpty:{
//             msg:'Please provide a last name'
//         }
//     }
//   },
//   email:{
//     type:DataTypes.STRING,
//     allowNull:false,
//     unique:true,
//     validate:{
//         notNull:{
//             msg:'email is required'
//         },
//         isEmail:{
//             msg:'Please provide a a valid Email'
//         }
//     }
//   },
//   phonenumber:{
//     type:DataTypes.STRING,
//     allowNull:false,
//     unique:true,
//     validate:{
//         notNull:{
//             msg:'phone number is required'
//         },
//         notEmpty:{
//             msg:'Please provide a valid phone number'
//         }
//     } 
//   },
//   password:{
//     type:DataTypes.STRING,
//     allowNull:false,
//     validate:{
//         notNull:{
//             msg:'password is required'
//         },
//         notEmpty:{
//             msg:'Please provide a password'
//         }
//     }
//   }
// },{
//     sequelize:db,
//     tableName:'user'
// });

// UserInstance.hasMany(NoteInstance, {foreignKey:'userId',
// as:'note'
// })

// NoteInstance.belongsTo(UserInstance,{foreignKey:'userId',
// as:'user'}) 

export interface UsersAttributes {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    password: string
}


export class UserInstance extends Model<UsersAttributes> { }

UserInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'first name is required'
            },
            notEmpty: {
                msg: 'Please provide a first name'
            }
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'last name is required'
            },
            notEmpty: {
                msg: 'Please provide a last name'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'email is required'
            },
            isEmail: {
                msg: 'Please provide a a valid Email'
            }
        }
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'phone number is required'
            },
            notEmpty: {
                msg: 'Please provide a valid phone number'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'password is required'
            },
            notEmpty: {
                msg: 'Please provide a password'
            }
        }
    }
}, {
    sequelize: db,
    tableName: 'user'
});

UserInstance.hasMany(NoteInstance, {
    foreignKey: 'userId',
    as: 'note'
})

NoteInstance.belongsTo(UserInstance, {
    foreignKey: 'userId',
    as: 'user'
}) 
