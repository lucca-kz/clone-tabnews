function status(request, response) {
  response
    .status(200)
    .json({ mensagem: "ta dando certo esse carai", chave: 200 });
}

export default status;
