const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3333;

app.use(express.json());

const customers = [];

function verifyIfExisteAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(404).json({ error: "Customer not found" });
  }

  request.customer = customer;

  return next();
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

// app.use(verifyIfExisteAccountCPF)

app.get("/statement", verifyIfExisteAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

app.post("/deposit", verifyIfExisteAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  console.log(statementOperation);
  customer.statement.push(statementOperation);
  return response.status(201).send();
});

app.listen(PORT);
console.log("Server listening on port " + PORT);
