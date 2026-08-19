import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import { UnauthorizedError } from "infra/errors.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  // console.log(userInputValues);

  try {
    const storedUser = await user.findOneByEmail(userInputValues.email);
  } catch (error) {
    throw new UnauthorizedError({
      message: "Dados de autenticação nao conferem.",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }

  console.log("usuario armazenado: ", storedUser);

  // const newUser = await user.create(userInputValues);
  return response.status(401).json({});
}
