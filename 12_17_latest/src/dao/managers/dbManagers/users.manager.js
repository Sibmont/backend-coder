import usersModel from "./models/users.model.js";

export default class Users {
  constructor() {
    console.log("Working with DB Manager");
  }

  getAll = async () => {
    const result = await usersModel.find();
    return result;
  };

  getByEmail = async (email) => {
    const result = await usersModel.findOne(email).lean();
    return result;
  };

  save = async (user) => {
    const result = usersModel.create(user);
    return result;
  };
}
