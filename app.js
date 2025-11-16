const API = "VOTRE_URL_WEBAPP_EXEC"; // <--- Mets ici ton URL /exec de Google Apps Script

// Stocke les produits ajoutés pour le bon
let produits = [];

// Au chargement : récupérer fournisseurs et produits
window.onload = () => {
  loadFournisseurs();
  loadProduits();
};

// Charger les fournisseurs
function loadFournisseurs() {
  fetch(API + "?action=getFournisseurs")
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById("fournisseur");
      sel.innerHTML = data.map(f => `<option>${f[0]}</option>`).join("");
    })
    .catch(err => console.error("Erreur fournisseurs :", err));
}

// Charger les produits
function loadProduits() {
  fetch(API + "?action=getProduits")
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById("produit");
      sel.innerHTML = data.map(p => `<option data-code="${p[0]}">${p[1]}</option>`).join("");
    })
    .catch(err => console.error("Erreur produits :", err));
}

// Ajouter un produit à la liste du bon
function addProduct() {
  const select = document.getElementById("produit");
  const name = select.value;
  const code = select.options[select.selectedIndex].dataset.code;
  const qte = document.getElementById("quantite").value;

  if (!qte || qte <= 0) {
    alert("Quantité invalide !");
    return;
  }

  produits.push({ code, name, qte });
  renderTable();
}

// Afficher les produits dans le tableau
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

// Enregistrer le bon de commande
function saveBC() {
  if (produits.length === 0) {
    alert("Ajoutez au moins un produit !");
    return;
  }

  const dataBase = {
    date: document.getElementById("bcDate").value,
    numero: document.getElementById("bcNumero").value,
    fournisseur: document.getElementById("fournisseur").value
  };

  if (!dataBase.date || !dataBase.numero || !dataBase.fournisseur) {
    alert("Veuillez remplir la date, le numéro et le fournisseur !");
    return;
  }

  // Envoyer chaque produit dans la feuille
  produits.forEach(p => {
    fetch(API, {
      method: "POST",
      body: JSON.stringify({
        action: "saveBC",
        date: dataBase.date,
        numero: dataBase.numero,
        fournisseur: dataBase.fournisseur,
        produit: p.code,
        quantite: p.qte
      })
    }).catch(err => console.error("Erreur saveBC :", err));
  });

  alert("Bon de commande enregistré !");
  produits = [];
  renderTable();
}
