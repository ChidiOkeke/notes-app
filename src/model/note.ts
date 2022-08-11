import { DataTypes, Model } from "sequelize";
import db from '../config/database.config'

interface NoteAttributes {
  id: string;
  title: string;
  description: string;
  DueDate: string;
  status: string;
  userId:string
}

export class NoteInstance extends Model<NoteAttributes> {}

NoteInstance.init({
  id: {
    type:DataTypes.UUIDV4,
    primaryKey:true,
    allowNull:false
  },
  title:{
     type:DataTypes.STRING,
     allowNull:false 
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DueDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status:{
    type:DataTypes.STRING,
    allowNull:false 
  },
  userId:{
    type:DataTypes.STRING
  }
},{
    sequelize:db,
    tableName:'notes'
});



