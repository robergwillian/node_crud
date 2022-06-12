const express = require("express");
const { request } = require("http");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3333;

app.use(express.json());

const customers = [];

function verifyIfExisteAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  request.customer = customer;

  return next();
}

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send();
});

// app.use(verifyIfExisteAccountCPF)

app.get("/statement", verifyIfExisteAccountCPF, (req, res) => {
  const { customer } = request;
  return res.json(customer.statement);
});

app.listen(PORT);
console.log("Server listening on port " + PORT);
