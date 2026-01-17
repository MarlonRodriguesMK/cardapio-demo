import logo from "./assets/logo.png";
import { useMemo, useState } from "react";
import { menu, WHATSAPP_NUMBER } from "./data/menu";
import "./styles.css";

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buildWhatsAppMessage({ cartItems, totals, customer, orderType, address, payment }) {
  const lines = [];

  lines.push("🧾 *Pedido pelo Cardápio Digital*");
  lines.push("");
  if (customer?.trim()) lines.push(`👤 *Cliente:* ${customer.trim()}`);
  lines.push(`📦 *Tipo:* ${orderType === "delivery" ? "Entrega" : "Retirada"}`);
  if (orderType === "delivery" && address?.trim()) lines.push(`📍 *Endereço:* ${address.trim()}`);
  lines.push(`💳 *Pagamento:* ${payment}`);
  lines.push("");
  lines.push("🍽️ *Itens:*");

  cartItems.forEach((it) => {
    lines.push(`- ${it.qty}x ${it.name} — ${formatBRL(it.price * it.qty)}`);
  });

  lines.push("");
  lines.push(`🧮 *Total:* ${formatBRL(totals.total)}`);
  lines.push("");
  lines.push("✅ Pode confirmar, por favor?");

  return lines.join("\n");
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState(menu[0]?.category ?? "");
  const [query, setQuery] = useState("");

  const [cart, setCart] = useState(() => new Map()); // id -> {id,name,price,qty}
  const [customer, setCustomer] = useState("");
  const [orderType, setOrderType] = useState("delivery"); // delivery | pickup
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Pix");

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byCategory = menu.find((c) => c.category === activeCategory) ?? menu[0];
    const items = (byCategory?.items ?? []).filter((i) => {
      if (!q) return true;
      return (i.name + " " + (i.desc ?? "")).toLowerCase().includes(q);
    });
    return { category: byCategory?.category ?? "", items };
  }, [activeCategory, query]);

  const cartItems = useMemo(() => Array.from(cart.values()), [cart]);

  const totals = useMemo(() => {
    const total = cartItems.reduce((acc, it) => acc + it.price * it.qty, 0);
    return { total };
  }, [cartItems]);

  function addToCart(item) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      if (existing) next.set(item.id, { ...existing, qty: existing.qty + 1 });
      else next.set(item.id, { id: item.id, name: item.name, price: item.price, qty: 1 });
      return next;
    });
  }

  function decFromCart(itemId) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(itemId);
      if (!existing) return next;
      const qty = existing.qty - 1;
      if (qty <= 0) next.delete(itemId);
      else next.set(itemId, { ...existing, qty });
      return next;
    });
  }

  function incFromCart(itemId) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(itemId);
      if (!existing) return next;
      next.set(itemId, { ...existing, qty: existing.qty + 1 });
      return next;
    });
  }

  function clearCart() {
    setCart(new Map());
  }

  function sendToWhatsApp() {
    if (cartItems.length === 0) {
      alert("Adicione pelo menos 1 item no carrinho.");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      alert("Digite o endereço para entrega.");
      return;
    }

    const msg = buildWhatsAppMessage({
      cartItems,
      totals,
      customer,
      orderType,
      address,
      payment,
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">
  <img src={logo} alt="Cardápio Express" style={{ width: "28px" }} />
</div>

          <div>
            <div className="title">Cardápio Express</div>
<div className="subtitle">Cardápio digital premium • Pedido no WhatsApp</div>

          </div>
        </div>

        <div className="searchWrap">
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar item (ex: pizza, suco...)"
          />
        </div>
      </header>

      <main className="layout">
        {/* MENU */}
        <section className="panel">
          <div className="panelHeader">
            <h2>Menu</h2>
            <div className="chips">
              {menu.map((c) => (
                <button
                  key={c.category}
                  className={`chip ${activeCategory === c.category ? "chipActive" : ""}`}
                  onClick={() => setActiveCategory(c.category)}
                >
                  {c.category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid">
            {filteredMenu.items.map((item) => (
              <div key={item.id} className="card">
                {item.image && (
  <img src={item.image} alt={item.name} className="cardImg" />
)}

                <div className="cardTop">
                  <div className="cardTitle">{item.name}</div>
                  <div className="price">{formatBRL(item.price)}</div>
                </div>
                <div className="desc">{item.desc}</div>
                <button className="btn" onClick={() => addToCart(item)}>
                  + Adicionar
                </button>
              </div>
            ))}
            {filteredMenu.items.length === 0 && (
              <div className="empty">Nada encontrado nessa categoria.</div>
            )}
          </div>
        </section>

        {/* CARRINHO */}
        <aside className="panel cart">
          <div className="panelHeader">
            <h2>Carrinho</h2>
            <button className="linkBtn" onClick={clearCart}>
              Limpar
            </button>
          </div>

          <div className="cartList">
            {cartItems.length === 0 ? (
              <div className="empty">Seu carrinho está vazio.</div>
            ) : (
              cartItems.map((it) => (
                <div className="cartItem" key={it.id}>
                  <div className="cartInfo">
                    <div className="cartName">{it.name}</div>
                    <div className="cartSub">{formatBRL(it.price)} cada</div>
                  </div>
                  <div className="qty">
                    <button className="qtyBtn" onClick={() => decFromCart(it.id)}>
                      −
                    </button>
                    <div className="qtyNum">{it.qty}</div>
                    <button className="qtyBtn" onClick={() => incFromCart(it.id)}>
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="divider" />

          <div className="form">
            <label className="label">
              Nome (opcional)
              <input
                className="input"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Ex: Marlon"
              />
            </label>

            <div className="row">
              <div className="col">
                <div className="label">Entrega ou Retirada</div>
                <div className="seg">
                  <button
                    className={`segBtn ${orderType === "delivery" ? "segActive" : ""}`}
                    onClick={() => setOrderType("delivery")}
                    type="button"
                  >
                    Entrega
                  </button>
                  <button
                    className={`segBtn ${orderType === "pickup" ? "segActive" : ""}`}
                    onClick={() => setOrderType("pickup")}
                    type="button"
                  >
                    Retirada
                  </button>
                </div>
              </div>

              <div className="col">
                <label className="label">
                  Pagamento
                  <select className="input" value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <option>Pix</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Dinheiro</option>
                  </select>
                </label>
              </div>
            </div>

            {orderType === "delivery" && (
              <label className="label">
                Endereço
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, referência..."
                />
              </label>
            )}

            <div className="totalRow">
              <div>Total</div>
              <div className="total">{formatBRL(totals.total)}</div>
            </div>

            <button className="btnPrimary" onClick={sendToWhatsApp}>
  Peça agora no WhatsApp
</button>


            <div className="footnote">
              Faça seu pedido e participe dos nossos sorteios !
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
