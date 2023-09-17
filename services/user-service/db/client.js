const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (data) => {
  const checkUid = data.uid;
  const isThereExistingUser = await prisma.appUsers.findUnique({
    where: {
      uid: checkUid
    }
  }).then((user) => {
    return (user !== null);
  });

  if (isThereExistingUser) {
    return null;
  }

  const newUser = await prisma.appUsers.create({
    data: data
  });

  return newUser;
}
const getUserByUid = async (uid) => {
  // Will return null if no such user exists
  const result = await prisma.appUsers.findUnique({
    where: {
      uid: uid,
    },
  });
  return result;
}

const updateUserByUid = async (uid, data) => {
  const updatedResult = await prisma.appUsers.update({
    where: {
      uid: uid
    },
    data: data
  });
  return updatedResult;
}

const deleteUserByUid = async (uid) => {
  await prisma.appUsers.delete({
    where: {
      uid: uid
    },
  });
}

module.exports = { createUser, getUserByUid, updateUserByUid, deleteUserByUid };