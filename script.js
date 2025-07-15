const ramosPorSemestre = {
  "Primer semestre": [
    ["Química General y Orgánica", "DQUI1050", []],
    ["Morfología Básica", "DMOR0030", []],
    ["Antropología", "FORI0001", []],
    ["Biología Celular", "DBIO1084", []],
    ["Bases de la Enfermería y su Rol en el Liderazgo", "ENFEA003", []],
    ["Psicología Evolutiva", "ENFEA004", []]
  ],
  "Segundo semestre": [
    ["Bioquímica General", "DBIO1092", ["DQUI1050"]],
    ["Microbiología General", "DBIO1097", ["DBIO1084"]],
    ["Integrado Fisiología-Fisiopatología 1", "DMOR0022", ["DBIO1084"]],
    ["Salud Digital", "FACU0004", []],
    ["IAAS (Calidad y Seguridad)", "ENFEB003", []],
    ["Salud Intercultural", "ENFEB004", []]
  ],
  "Tercer semestre": [
    ["Integrado Fisiología-Fisiopatología 2", "DMOR0023", ["DMOR0022"]],
    ["Farmacología General", "BDIO1098", ["DMOR0022"]],
    ["Salud Poblacional", "DSPU0012", []],
    ["Enfermería en el Curso de la Vida", "ENFEC004", []],
    ["Educación para la Salud", "ENFEC005", []],
    ["Comunicación Interdisciplinar", "ENFEC006", []]
  ],
  "Cuarto semestre": [
    ["Gestión del Cuidado del Adulto 1", "ENFED005", ["ENFEC004"]],
    ["Ética", "FORI0002", ["FORI0001"]],
    ["Bases de práctica basada en evidencia", "ENFED006", []],
    ["Administración para la gestión del cuidado", "ENFED007", []],
    ["HITO Evaluativo Integrativo 1", "ENFED008", ["ENFEC004", "ENFEC005", "ENFEC006", "DMOR0023", "BDIO1098"]]
  ],
  "Quinto semestre": [
    ["Persona y sociedad", "FORI0003", ["FORI0002"]],
    ["Gestión del cuidado del adulto 2", "ENFEE004", ["ENFED005"]],
    ["Bioestadística y Salud", "DCEX0015", []],
    ["Epidemiología", "DSPU0014", ["DSPU0012"]],
    ["Medioambiente, salud y enfermería", "ENFEE005", ["ENFED007"]],
    ["Gestión de proyectos en Salud", "ENFEE006", ["ENFED007"]]
  ],
  "Sexto semestre": [
    ["Electivo 1: Formación Integral", "ELECFORI01", []],
    ["Gestión del cuidado en la persona mayor", "ENFEF005", ["ENFEE004"]],
    ["Enfermería en Salud Mental y Psiquiatría", "ENFEF006", ["ENFEE004"]],
    ["Liderazgo y toma de decisiones en salud", "ENFEF007", ["ENFEE005"]],
    ["Metodología de la Investigación", "DSPU0013", []]
  ],
  "Séptimo semestre": [
    ["Electivo 2: Formación Integral", "ELECFORI02", []],
    ["Gestión del cuidado en la niñez y adolescencia", "ENFEG003", ["ENFEE004"]],
    ["Enfermería en Salud Familiar y Comunitaria", "ENFEG004", ["ENFEF006"]],
    ["Gerencia y Gobernanza para la Gestión en Salud", "ENFEG005", ["ENFEF007"]],
    ["Bioética", "DEBI0001", []],
    ["Proyecto de Investigación", "ENFEG006", ["DSPU0013"]]
  ],
  "Octavo semestre": [
    ["Electivo 3: Formación Integral", "ELECFORI03", []],
    ["Enfermería de Urgencia", "ENFEH002", ["ENFEG003"]],
    ["Enfermería en Oncología y Cuidados Paliativos", "ENFEH003", ["ENFEG004"]],
    ["Liderazgo para la Gestión del Cambio en Equipos de Salud", "ENFEH004", ["ENFEG005"]],
    ["Práctica Basada en la Evidencia", "ENFEH005", ["ENFEG006"]],
    ["HITO Evaluativo Integrativo 2", "ENFEH006", ["ENFEG003", "ENFEG004", "ENFEG005", "ENFEG006"]]
  ],
  "Noveno semestre": [
    ["Gestión de Carrera y Desarrollo Profesional", "ELECDEE03", []],
    ["Internado Clínico Asistencial", "ENFEI003", ["ENFEH006"]],
    ["Electivo Disciplinar 1", "ELECENFE01", ["ENFEH006"]]
  ],
  "Décimo semestre": [
    ["Internado en Salud Familiar y Comunitaria", "ENFEJ001", ["ENFEH006"]],
    ["Internado de Gestión en Salud", "ENFEJ002", ["ENFEH006"]],
    ["Electivo Disciplinar 2", "ELECENFE02", ["ENFEH006"]]
  ]
};

// Lógica JS igual que antes ↓

let aprobados = new Set();
let desbloqueados = new Set();

const malla = document.getElementById("malla");
const detalle = document.getElementById("detalle");

function inicializarDesbloqueados() {
  desbloqueados.clear();
  for (const sem in ramosPorSemestre) {
    for (const [nombre, codigo, prereqs] of ramosPorSemestre[sem]) {
      if (prereqs.length === 0) desbloqueados.add(codigo);
    }
  }
}

function prerrequisitosAprobados(prereqs) {
  return prereqs.every(cod => aprobados.has(cod));
}

function actualizarDesbloqueados() {
  let cambio = false;
  for (const semestre in ramosPorSemestre) {
    for (const [nombre, codigo, prereqs] of ramosPorSemestre[semestre]) {
      if (!desbloqueados.has(codigo) && prerrequisitosAprobados(prereqs)) {
        desbloqueados.add(codigo);
        cambio = true;
      }
    }
  }
  if (cambio) renderMalla();
}

function crearTarjeta(nombre, codigo, prereqs) {
  const div = document.createElement("div");
  div.className = "ramo";
  div.textContent = `${nombre}\n(${codigo})`;

  if (!desbloqueados.has(codigo)) div.classList.add("bloqueado");
  if (aprobados.has(codigo)) div.classList.add("aprobado");

  div.addEventListener("click", () => {
    if (!aprobados.has(codigo)) {
      aprobados.add(codigo);
      actualizarDesbloqueados();
      renderMalla();
      mostrarDetalle(nombre, codigo, prereqs);
    } else {
      mostrarDetalle(nombre, codigo, prereqs);
    }
  });

  return div;
}

function mostrarDetalle(nombre, codigo, prereqs) {
  detalle.classList.remove("hidden");
  const requisitos = prereqs.length > 0 ? prereqs.join(", ") : "Ninguno";
  detalle.innerHTML = `
    <strong>${nombre} (${codigo})</strong><br>
    Estado: ${aprobados.has(codigo) ? "✅ Aprobado" : "⏳ Pendiente"}<br>
    Prerrequisitos: ${requisitos}
  `;
}

function renderMalla() {
  malla.innerHTML = "";
  for (const semestre in ramosPorSemestre) {
    const contenedor = document.createElement("div");
    contenedor.className = "semestre";

    const titulo = document.createElement("h2");
    titulo.textContent = semestre;
    contenedor.appendChild(titulo);

    const contenedorRamos = document.createElement("div");
    contenedorRamos.className = "ramos";

    for (const [nombre, codigo, prereqs] of ramosPorSemestre[semestre]) {
      const tarjeta = crearTarjeta(nombre, codigo, prereqs);
      contenedorRamos.appendChild(tarjeta);
    }

    contenedor.appendChild(contenedorRamos);
    malla.appendChild(contenedor);
  }
}

inicializarDesbloqueados();
renderMalla();
