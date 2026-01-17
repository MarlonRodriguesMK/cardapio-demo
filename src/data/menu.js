import pizzaCalabresa from "../assets/pizza-calabresa.jpg";
import pizzaFrango from "../assets/pizza-frango.jpg";
import pizza4Queijos from "../assets/pizza-4queijos.jpg";
import xburger from "../assets/xburger.jpg";
import xsalada from "../assets/xsalada.jpg";
import xbacon from "../assets/xbacon.jpg";
import refri from "../assets/refri.jpg";
import suco from "../assets/suco.jpg";
import agua from "../assets/agua.jpg";

export const WHATSAPP_NUMBER = "5516993883427";

export const menu = [
  {
    category: "Pizzas",
    items: [
      { id: "pz-1", name: "Pizza Calabresa", desc: "Mussarela, calabresa e cebola", price: 44.9, image: pizzaCalabresa },
      { id: "pz-2", name: "Pizza Frango c/ Catupiry", desc: "Frango desfiado e catupiry", price: 49.9, image: pizzaFrango },
      { id: "pz-3", name: "Pizza 4 Queijos", desc: "Mussarela, gorgonzola, parmesão, provolone", price: 52.9, image: pizza4Queijos },
    ],
  },
  {
    category: "Lanches",
    items: [
      { id: "ln-1", name: "X-Burger", desc: "Hambúrguer, queijo, alface e tomate", price: 22.9, image: xburger },
      { id: "ln-2", name: "X-Salada", desc: "Hambúrguer, queijo, alface, tomate, milho", price: 24.9, image: xsalada },
      { id: "ln-3", name: "X-Bacon", desc: "Hambúrguer, queijo e bacon crocante", price: 27.9, image: xbacon },
    ],
  },
  {
    category: "Bebidas",
    items: [
      { id: "bb-1", name: "Refrigerante Lata", desc: "350ml", price: 6.9, image: refri },
      { id: "bb-2", name: "Suco Natural", desc: "500ml", price: 9.9, image: suco },
      { id: "bb-3", name: "Água", desc: "500ml", price: 3.5, image: agua },
    ],
  },
];
