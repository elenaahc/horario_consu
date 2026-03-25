document.addEventListener("DOMContentLoaded", () => {

    // --- MODO OSCURO (DARK MODE) ---
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const headerSubtitle = document.querySelector('header small');

  // 1. Revisar si ya tenía el modo oscuro guardado de antes
  if (localStorage.getItem('themeConsu') === 'dark') {
      body.classList.add('dark-mode');
      themeToggle.textContent = '☀️'; // Cambia el icono al sol
  }

  // 2. Acción al tocar el botón
  themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      
      if (body.classList.contains('dark-mode')) {
          localStorage.setItem('themeConsu', 'dark');
          themeToggle.textContent = '☀️';
      } else {
          localStorage.setItem('themeConsu', 'light');
          themeToggle.textContent = '🌙';
      }
  });
  let semanaOffset = 0;

  const schedules = {
    lunes: [
      { inicio: "14:15", fin: "15:35", actividad: "Gestión del Cuidado en Adulto Mayor\nDocente: Victor Cabezas\nSala: S-02-P06-A", clase: "adulto-mayor" },
      { inicio: "15:46", fin: "16:25", actividad: "Gestión del Cuidado en Adulto Mayor\nDocente: Victor Cabezas\nSala: S-02-P06-A", clase: "adulto-mayor" },
      { inicio: "16:26", fin: "17:55", actividad: "Gestión del Cuidado en la Familia en APS\nDocente: Karis Martínez\nSala: S-01-P03-A", clase: "familia-aps" }
    ],
    martes: [
      { inicio: "09:45", fin: "10:25", actividad: "Gestión del Cuidado en Adulto y Adulto Mayor Hospitalizado\nSala: PA\n(Inicia 27/04)", clase: "hospitalizado", fechaInicio: "2026-04-27", fechaFin: "2026-07-18" },
      { inicio: "11:15", fin: "14:05", actividad: "PRÁCTICA: Gestión del Cuidado en la Familia en APS\nDocente: Karis Martínez\nSala: L-04-P06-A", clase: "familia-aps", fechaInicio: "2026-03-16", fechaFin: "2026-04-11", esEspecial: true },
      { inicio: "15:46", fin: "17:05", actividad: "Gestión del Cuidado en Adulto Mayor\nDocente: Victor Cabezas\nSala: S-02-P05-A", clase: "adulto-mayor" },
      { inicio: "17:15", fin: "18:35", actividad: "Gestión en Salud\nDocente: Nicole Muñoz\nSala: S-04-P05-A", clase: "gestion-salud" }
    ],
    miércoles: [
      { inicio: "14:56", fin: "16:25", actividad: "Gestión del Cuidado en la Familia en APS\nDocente: Karis Martínez\nSala: S-03-P04-A", clase: "familia-aps" },
      { inicio: "16:26", fin: "18:35", actividad: "Gestión del Cuidado en Adulto y Adulto Mayor Hospitalizado\nDocente:  \nSala: S-08-P05-A", clase: "hospitalizado" }
    ],
    jueves: [
      { inicio: "12:45", fin: "13:25", actividad: "Gestión del Cuidado en la Familia en APS\nSala: PA\n(Inicia 27/04)", clase: "familia-aps", fechaInicio: "2026-04-27", fechaFin: "2026-07-18" },
      { inicio: "15:46", fin: "17:05", actividad: "Gestión del Cuidado en Adulto y Adulto Mayor Hospitalizado\nDocente: Marylin Astete\nSala: L-03-P06-A", clase: "hospitalizado", fechaInicio: "2026-03-23", fechaFin: "2026-07-04" },
      { inicio: "17:15", fin: "18:35", actividad: "Gestión en Salud\nDocente: Nicole Muñoz\nSala: S-04-P05-A", clase: "gestion-salud" }
    ],
    viernes: []
  };

  // --- LÓGICA DE FECHAS ---
  function getFechaPorDia(nombreDia, offsetSemanas) {
    const hoy = new Date();
    const indices = { lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5 };
    const diferencia = indices[nombreDia] - hoy.getDay();
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + diferencia + (offsetSemanas * 7));
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }

  function estaEnRango(item, fechaAValidar) {
    if (!item.fechaInicio || !item.fechaFin) return true;
    const inicio = new Date(item.fechaInicio + "T00:00:00");
    const fin = new Date(item.fechaFin + "T23:59:59");
    return fechaAValidar >= inicio && fechaAValidar <= fin;
  }

  // --- RENDERIZADO HORARIO ---
  function renderDayView() {
    const selectedDay = document.getElementById('daySelect').value;
    const tbody = document.querySelector('#scheduleTable tbody');
    const msg = document.getElementById('noScheduleMessage');
    const hoyReal = new Date();
    hoyReal.setHours(0,0,0,0);
    
    tbody.innerHTML = '';
    const items = (schedules[selectedDay] || []).filter(item => estaEnRango(item, hoyReal));

    if (items.length > 0) {
      msg.style.display = 'none';
      items.forEach(item => {
        const aviso = item.esEspecial ? '<br><span class="badge badge-danger mt-1">⚠️ PRÁCTICA</span>' : '';
        tbody.innerHTML += `
          <tr>
            <td class="text-nowrap text-center align-middle">${item.inicio}<br><small class="text-muted">a</small><br>${item.fin}</td>
            <td class="${item.clase} align-middle"><strong>${item.actividad.replace(/\n/g, '<br>')}</strong>${aviso}</td>
          </tr>`;
      });
    } else {
      msg.style.display = 'block';
    }
  }

  function renderWeekView() {
    const container = document.getElementById('weeklyContainer');
    const label = document.getElementById('weekLabel');
    container.innerHTML = '';
    label.textContent = semanaOffset === 0 ? 'Esta Semana' : `Semana ${semanaOffset > 0 ? '+' : ''}${semanaOffset}`;

    ["lunes", "martes", "miércoles", "jueves", "viernes"].forEach(day => {
      const fechaDia = getFechaPorDia(day, semanaOffset);
      const items = (schedules[day] || []).filter(item => estaEnRango(item, fechaDia));
      
      if (items.length > 0) {
        let card = document.createElement('div');
        card.className = 'week-day-card';
        let html = `<div class="week-day-title">${day.toUpperCase()} <small class="text-muted float-right">${fechaDia.toLocaleDateString('es-CL', {day:'numeric', month:'short'})}</small></div>`;
        items.forEach(item => {
          const miniAviso = item.esEspecial ? ' <small class="text-danger font-weight-bold">(Prc.)</small>' : '';
          html += `
            <div class="week-item border-bottom py-2">
              <span class="time small align-self-center"><strong>${item.inicio}</strong></span>
              <span class="text-truncate ml-2" style="max-width: 75%;">${item.actividad.split('\n')[0]}${miniAviso}</span>
            </div>`;
        });
        card.innerHTML = html;
        container.appendChild(card);
      }
    });
  }

  // --- NAVEGACIÓN DE PESTAÑAS ---
  const dayView = document.getElementById('dayView');
  const weekView = document.getElementById('weekView');
  const gradesView = document.getElementById('gradesView');
  
  const dayBtn = document.getElementById('viewDayBtn');
  const weekBtn = document.getElementById('viewWeekBtn');
  const gradesBtn = document.getElementById('viewGradesBtn');
  const msgNoSchedule = document.getElementById('noScheduleMessage');

  function resetTabs() {
    dayView.style.display = 'none';
    weekView.style.display = 'none';
    gradesView.style.display = 'none';
    msgNoSchedule.style.display = 'none';
    
    dayBtn.className = 'btn btn-outline-dark';
    weekBtn.className = 'btn btn-outline-dark';
    gradesBtn.className = 'btn btn-outline-dark';
  }

  dayBtn.onclick = () => { resetTabs(); dayView.style.display = 'block'; dayBtn.className = 'btn btn-dark active'; renderDayView(); };
  weekBtn.onclick = () => { resetTabs(); weekView.style.display = 'block'; weekBtn.className = 'btn btn-dark active'; renderWeekView(); };
  gradesBtn.onclick = () => { resetTabs(); gradesView.style.display = 'block'; gradesBtn.className = 'btn btn-dark active'; };

  document.getElementById('prevWeek').onclick = () => { semanaOffset--; renderWeekView(); };
  document.getElementById('nextWeek').onclick = () => { semanaOffset++; renderWeekView(); };
  document.getElementById('resetWeek').onclick = () => { semanaOffset = 0; renderWeekView(); };
  document.getElementById('daySelect').onchange = renderDayView;

// --- LÓGICA DE CALCULADORA DE NOTAS (LOCALSTORAGE) ---
  const subjectSelect = document.getElementById('subjectSelect');
  const calcContainers = document.querySelectorAll('.calc-container');
  const notasInputs = document.querySelectorAll('.nota-input');

  // Alternar vista de calculadoras
  subjectSelect.addEventListener('change', (e) => {
      calcContainers.forEach(c => c.style.display = 'none');
      document.getElementById(e.target.value).style.display = 'block';
  });

  function cargarNotas() {
      const notasGuardadas = JSON.parse(localStorage.getItem('notasConsu')) || {};
      notasInputs.forEach(input => {
          if (notasGuardadas[input.id]) {
              input.value = notasGuardadas[input.id];
          }
      });
      calcularTodas();
  }

  notasInputs.forEach(input => {
      input.addEventListener('input', function() {
          
          // --- NUEVO: Límite de dígitos y valor máximo ---
          // 1. Limitar a 2 dígitos si es entero (ej: "65"), o 4 caracteres si tiene punto (ej: "55.5")
          if (!this.value.includes('.') && this.value.length > 2) {
              this.value = this.value.slice(0, 2);
          } else if (this.value.includes('.') && this.value.length > 4) {
              this.value = this.value.slice(0, 4);
          }

          // 2. Tope máximo de nota: 70 (evita que ingrese un 80 o 99 por error)
          if (parseFloat(this.value) > 70) {
              this.value = 70;
          }
          // -----------------------------------------------

          const notasGuardadas = JSON.parse(localStorage.getItem('notasConsu')) || {};
          notasGuardadas[this.id] = this.value;
          localStorage.setItem('notasConsu', JSON.stringify(notasGuardadas));
          calcularTodas();
      });
  });

  function calcularTodas() {
      calcularAdultoHosp();
      calcularGestionSalud();
      calcularFamiliaAPS();
      calcularAdultoMayor();
  }

  // --- FUNCIÓN CORREGIDA PARA AMBAS ESCALAS ---
  function obtenerNotaFinal(presentacion, examenInputId, eximidaId) {
      const examen = parseFloat(document.getElementById(examenInputId).value) || 0;
      let notaFinal = 0;
      const eximidaSpan = document.getElementById(eximidaId);
      if (eximidaSpan) eximidaSpan.innerHTML = ""; 
      
      if (presentacion === 0) return 0;

      // EL FIX: Validamos que sea >= 55 (escala 10-70) o que esté entre 5.5 y 7.0 (escala 1-7)
      const estaEximida = (presentacion >= 55) || (presentacion >= 5.5 && presentacion <= 7.0);

      if (estaEximida) {
          notaFinal = presentacion;
          if (eximidaSpan) eximidaSpan.innerHTML = "<br><span class='badge badge-success mt-1'>¡EXIMIDA! 🎉</span>";
      } else {
          notaFinal = (presentacion * 0.70) + (examen * 0.30);
      }
      return notaFinal;
  }

  // --- CALCULADORAS ESPECÍFICAS ---
  function calcularAdultoHosp() {
      const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;

      const catedra = (getVal('ah_c_e1') * 0.20) + (getVal('ah_c_e2') * 0.25) + 
                      (getVal('ah_c_e3') * 0.25) + (getVal('ah_c_e4') * 0.20) + (getVal('ah_c_caso') * 0.10);
      const simulacion = (getVal('ah_s_1') * 0.50) + (getVal('ah_s_2') * 0.50);
      const terreno = getVal('ah_t_1') * 1.0;

      let presentacion = (catedra * 0.60) + (simulacion * 0.10) + (terreno * 0.30);
      let notaFinal = obtenerNotaFinal(presentacion, 'ah_examen', 'ah_eximida');

      document.getElementById('ah_res_pres').textContent = presentacion > 0 ? presentacion.toFixed(1) : '-';
      document.getElementById('ah_res_final').textContent = notaFinal > 0 ? notaFinal.toFixed(1) : '-';
  }

  function calcularGestionSalud() {
      const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;

      let presentacion = (getVal('gs_p1') * 0.30) + (getVal('gs_s2') * 0.15) + 
                         (getVal('gs_p2') * 0.25) + (getVal('gs_p3') * 0.30);
      
      let notaFinal = obtenerNotaFinal(presentacion, 'gs_examen', 'gs_eximida');

      document.getElementById('gs_res_pres').textContent = presentacion > 0 ? presentacion.toFixed(1) : '-';
      document.getElementById('gs_res_final').textContent = notaFinal > 0 ? notaFinal.toFixed(1) : '-';
  }

  function calcularFamiliaAPS() {
      const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;

      const catedra = (getVal('fa_c_p1') * 0.20) + (getVal('fa_c_estudio') * 0.30) + (getVal('fa_c_p2') * 0.50);
      const simulacion = getVal('fa_s_1') * 1.0;
      const terreno = getVal('fa_t_1') * 1.0;

      let presentacion = (catedra * 0.60) + (simulacion * 0.10) + (terreno * 0.30);
      let notaFinal = obtenerNotaFinal(presentacion, 'fa_examen', 'fa_eximida');

      document.getElementById('fa_res_pres').textContent = presentacion > 0 ? presentacion.toFixed(1) : '-';
      document.getElementById('fa_res_final').textContent = notaFinal > 0 ? notaFinal.toFixed(1) : '-';
  }

  function calcularAdultoMayor() {
      const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;

      let presentacion = (getVal('am_p1') * 0.15) + (getVal('am_p2') * 0.20) + 
                         (getVal('am_empa') * 0.25) + (getVal('am_info') * 0.10) + (getVal('am_p3') * 0.30);

      let notaFinal = obtenerNotaFinal(presentacion, 'am_examen', 'am_eximida');

      document.getElementById('am_res_pres').textContent = presentacion > 0 ? presentacion.toFixed(1) : '-';
      document.getElementById('am_res_final').textContent = notaFinal > 0 ? notaFinal.toFixed(1) : '-';
  }

  // --- INICIALIZACIÓN ---
  const todayName = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][new Date().getDay()];
  document.getElementById('daySelect').value = schedules[todayName] ? todayName : "lunes";
  renderDayView();
  cargarNotas(); // Cargar las notas guardadas al inicio
});

