
/** @typedef {import('../interfaces/IUsers.js').User} User */

import { users } from "../utils/populate/users.js";
/**
 * Encontra um usuário pelo nome de usuário.
 * @param {string} username - O nome de usuário a ser procurado.
 * @returns {User|undefined} - Retorna o usuário encontrado ou undefined se não encontrado.
 */
const findByUsername = (username) => {
  return users.find((user) => user.username === username);
};

/**
 * Adiciona um novo usuário.
 * @param {User} user - O usuário a ser adicionado.
 */
const addUser = (user) => {
  users.push(user);
};

/**
 * Remove um usuário pelo nome de usuário.
 * @param {string} username - O nome de usuário do usuário a ser removido.
 * @returns {boolean} - Retorna true se o usuário foi removido, caso contrário, false.
 */
const removeUser = (username) => {
  const index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Atualiza as informações de um usuário.
 * @param {string} username - O nome de usuário do usuário a ser atualizado.
 * @param {Partial<User>} updatedUser - Um objeto contendo as informações atualizadas do usuário.
 * @returns {boolean} - Retorna true se o usuário foi atualizado, caso contrário, false.
 */
const updateUser = (username, updatedUser) => {
  const user = findByUsername(username);
  if (user) {
    Object.assign(user, updatedUser);
    return true;
  }
  return false;
};

/**
 * Obtém todos os usuários.
 * @returns {User[]} - Retorna uma lista de todos os usuários.
 */
const getAllUsers = () => {
  return users;
};

export default{ findByUsername, addUser, removeUser, updateUser, getAllUsers };
