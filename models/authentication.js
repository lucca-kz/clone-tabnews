import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  let storedUser;
  try {
    storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação nao conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }

  return storedUser;

  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha incorreta.",
        action: "Verifique se a senha digitada esta correta.",
      });
    }
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;
    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email incorreto.",
          action: "Verifique se o email digitado esta correto.",
        });
      }
      throw error;
    }
    return storedUser;
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
