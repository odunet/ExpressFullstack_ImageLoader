//Add new data (async)
const createDataBooks = async (collection, data) => {
  let response = await collection.create({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash: data.passwordHash,
    userRole: data.userRole,
    isTutor: data.isTutor,
    isAdmin: data.isAdmin,
  });
  return response;
};

// //Find all data (async)
const findData = async (collection, query = {}) => {
  let data = await collection.find(query);
  return data;
};

//Find one data (async)
const findOneData = async (collection, query = {}) => {
  let data = await collection.find({ id: query });
  return data;
};

//Find one and update data (async)
const findAndUpdate = async (collection, query = {}, newEntry = {}) => {
  let data = await collection.updateOne({ id: parseInt(query) }, newEntry);
  return data;
};

//Find and delete data (async)
const findandDelete = async (collection, query = {}) => {
  let data = await collection.deleteOne({ id: query });
  return data;
};

module.exports = {
  createDataBooks,
  findData,
  findOneData,
  findAndUpdate,
  findandDelete,
};
