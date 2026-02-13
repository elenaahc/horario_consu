document.addEventListener("DOMContentLoaded", () => {
  let semanaOffset = 0;

  const schedules = {
    lunes: [
      { 
        inicio: "14:15", fin: "15:35", 
        actividad: "Gestión del Cuidado en Adulto Mayor\nDocente: Victor Cabezas", 
        clase: "adulto-mayor" 
      }, 
      { 
        inicio: "15:46", fin: "16:25", 
        actividad: "Gestión del Cuidado en Adulto Mayor\nDocente: Victor Cabezas", 
        clase: "adulto-mayor" 
      }, 
      { 
        inicio: "16:26", fin: "17:55", 
        actividad: "Gestión del Cuidado en la Familia en APS\nDocente: Karis Martínez", 
        clase: "familia-aps" 
      } 
    ],
    martes: [
      { 
        inicio: "09:45", fin: "10:25", 
        actividad: "Gestión del Cuidado en Adulto y Adulto Mayor Hospitalizado\n(Inicia 27/04)", 
        clase: "hospitalizado",
        fechaInicio: "2026-04-27", 
        fechaFin: "2026-07-18" 
      }, 
      { 
        inicio: "11:15", fin: "14:05", 
        actividad: "PRÁCTICA: Gestión del Cuidado en la Familia en APS\nSala: L-04-P06-A", 
        clase: "familia-aps",
        fechaInicio: "2026-03-16", 
        fechaFin: "2026-04-11",
        esEspecial: true 
      }, 
      { 
        inicio: "15:46", fin: "17:05", 
        actividad: "Gestión del Cuidado en Adulto Mayor\nDocente: Victor Cabezas", 
        clase: "adulto-mayor" 
      }, 
      { 
        inicio: "17:15", fin: "18:35", 
        actividad: "Gestión en Salud\nDocente: Nicole Muñoz", 
        clase: "gestion-salud" 
      } 
    ],
    miércoles: [
      { 
        inicio: "14:56", fin: "16:25", 
        actividad: "Gestión del Cuidado en la Familia en APS\nDocente: Karis Martínez", 
        clase: "familia-aps" 
      }, 
      { 
        inicio: "16:26", fin: "18:35", 
        actividad: "Gestión del Cuidado en Adulto y Adulto Mayor Hospitalizado\nDocente: Madison Cid", 
        clase: "hospitalizado" 
      }
    ],
    jueves: [
      { 
        inicio: "12:45", fin: "13:25", 
        actividad: "Gestión del Cuidado en la Familia en APS\n(Inicia 27/04)", 
        clase: "familia-aps",
        fechaInicio: "2026-04-27", 
        fechaFin: "2026-07-18" 
      }, 
      { 
        inicio: "15:46", fin: "17:05", 
        actividad: "Gestión del Cuidado en Adulto y Adulto Mayor Hospitalizado\nDocente: Marylin Astete\nSala: L-03-P06-A", 
        clase: "hospitalizado",
        fechaInicio: "2026-03-23", 
        fechaFin: "2026-07-04"
      },
      { 
        inicio: "17:15", fin: "18:35", 
        actividad: "Gestión en Salud\nDocente: Nicole Muñoz", 
        clase: "gestion-salud" 
      } 
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

  // --- RENDERIZADO ---
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
        const aviso = item.esEspecial ? '<br><span class="badge badge-danger">⚠️ PRÁCTICA</span>' : '';
        tbody.innerHTML += `
          <tr>
            <td class="text-nowrap">${item.inicio}<br><small class="text-muted">a</small><br>${item.fin}</td>
            <td class="${item.clase}"><strong>${item.actividad.replace(/\n/g, '<br>')}</strong>${aviso}</td>
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
          const miniAviso = item.esEspecial ? ' <small class="text-danger">(Prc.)</small>' : '';
          html += `
            <div class="week-item border-bottom py-1">
              <span class="time small"><strong>${item.inicio}-${item.fin}</strong></span>
              <span class="text-truncate ml-2" style="max-width: 70%;">${item.actividad.split('\n')[0]}${miniAviso}</span>
            </div>`;
        });
        card.innerHTML = html;
        container.appendChild(card);
      }
    });
  }

  // --- EVENTOS ---
  document.getElementById('viewDayBtn').onclick = () => {
    document.getElementById('dayView').style.display = 'block';
    document.getElementById('weekView').style.display = 'none';
    renderDayView();
  };

  document.getElementById('viewWeekBtn').onclick = () => {
    document.getElementById('dayView').style.display = 'none';
    document.getElementById('weekView').style.display = 'block';
    renderWeekView();
  };

  document.getElementById('prevWeek').onclick = () => { semanaOffset--; renderWeekView(); };
  document.getElementById('nextWeek').onclick = () => { semanaOffset++; renderWeekView(); };
  document.getElementById('resetWeek').onclick = () => { semanaOffset = 0; renderWeekView(); };
  document.getElementById('daySelect').onchange = renderDayView;

  // Init
  const todayName = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][new Date().getDay()];
  document.getElementById('daySelect').value = schedules[todayName] ? todayName : "lunes";
  renderDayView();
});
