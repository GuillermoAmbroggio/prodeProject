import { Router } from "express";
import { PaymentsCards, Users } from "../../../models";

const pruebas = Router();

pruebas.get("/cargarBD", async (req, res, next) => {
  try {
    //CREO DATOS SOLO PARA PROBRAR:
    const user1 = await Users.create({
      name: "guille",
      lastname: "ambroggio",
      email: "guille@gmail.com",
      password: "Asd12345",
      role: "admin",
    });

    const paymentCard1 = await PaymentsCards.create({
      customer_id: "1069698391-Etuj64PzbVER2w",
      user_id: "1",
    });

    paymentCard1.$set("user", user1);

    res.send("ok");
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

export default pruebas;
