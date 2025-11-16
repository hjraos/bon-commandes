const API = "https://script.google.com/macros/s/AKfycbxgGT_mZOgGR1SMJIQ_G47iKFm7N94j9aajA9-UoASp4L4ZDdBmlXgilns5dEcwUB0d/exec";

// Chargement des fournisseurs & produits
window.onload = () => {
  loadFournisseurs();
  loadProduits();
};

function loadFournisseurs() {
  fetch(API + "?action=getFournisseurs")
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById("fournisseur");
      sel.innerHTML = data.map(f => `<option>${f[0]}</option>`).join("");
    });
}

function loadProduits() {
  fetch(API + "?action=getProduits")
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById("produit");
      sel.innerHTML = data.map(p => `<option data-code="${p[0]}">${p[1]}</option>`).join("");
    });
}

let produits = [];

function addProduct() {
  const select = document.getElementById("produit");
  const name = select.value;
  const code = select.options[select.selectedIndex].dataset.code;
  const qte = document.getElementById("quantite").value;

  produits.push({ code, name, qte });
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#tableProduits tbody");
  tbody.innerHTML = produits.map(p => `
    <tr>
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${p.qte}</td>
    </tr>
  `).join("");
}

function saveBC() {
  if (produits.length === 0) {
    alert("Ajoutez au moins un produit !");
    return;
  }

  const data = {
    action: "saveBC",
    date: document.getElementById("bcDate").value,
    numero: document.getElementById("bcNumero").value,
    fournisseur: document.getElementById("fournisseur").value,
    // On enregistre un produit par ligne dans le sheet
  };

  produits.forEach(p => {
    fetch(API, {
      method: "POST",
      body: JSON.stringify({
        action: "saveBC",
        date: data.date,
        numero: data.numero,
        fournisseur: data.fournisseur,
        produit: p.code,
        quantite: p.qte
      })
    });
  });

  alert("Bon de commande enregistré !");
  produits = [];
  renderTable();
}
