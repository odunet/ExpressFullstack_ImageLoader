//Add new data (async)
const createData = async (collection, data) => {
  let response = await collection.create({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    userName: data.userName,
    passwordHash: data.passwordHash,
    isAdmin: data.isAdmin,
    base64ImageSrc: data.base64ImageSrc,
    binaryImageSrc: data.binaryImageSrc,
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
  createData,
  findData,
  findOneData,
  findAndUpdate,
  findandDelete,
};
