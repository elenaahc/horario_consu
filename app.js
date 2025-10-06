document.addEventListener("DOMContentLoaded", () => {

  const schedules = {
    lunes: [
      { hora: "14:15 - 14:55", actividad: "Intervenciones Educativas en Salud \n Sala: S-03-P03-A \n Docente: Valeska Norambuena", clase: "intervenciones" },
      { hora: "14:56 - 15:35", actividad: "Intervenciones Educativas en Salud \n Sala: S-03-P03-A \n Docente: Valeska Norambuena", clase: "intervenciones" },
      { hora: "15:46 - 16:25", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P03-A \n Docente: Rayen Oliva", clase: "bases-fisiopatologicas" },
      { hora: "16:26 - 17:05", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P03-A \n Docente: Rayen Oliva", clase: "bases-fisiopatologicas" },
      { hora: "17:15 - 17:55", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P03-A \n Docente: Rayen Oliva", clase: "bases-fisiopatologicas" },
      { hora: "17:56 - 18:35", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P03-A \n Docente: Rayen Oliva", clase: "bases2-fisiopatologicas" },
      { hora: "18:40 - 19:20", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P03-A \n Docente: Rayen Oliva", clase: "bases2-fisiopatologicas" },
    ],
    martes: [
      { hora: "14:15 - 14:55", actividad: "Intervenciones Educativas en Salud \n Sala: S-03-P03-A \n Docente: Valeska Norambuena", clase: "intervenciones2" },
      { hora: "14:56 - 15:35", actividad: "Intervenciones Educativas en Salud \n Sala: S-03-P03-A \n Docente: Valeska Norambuena", clase: "intervenciones2" },
      { hora: "15:46 - 16:25", actividad: "Fundamentos en Salud Pública \n Sala: S-03-P03-A \n Docente: Madison Cid", clase: "fundamentos-salud" },
      { hora: "16:26 - 17:05", actividad: "Fundamentos en Salud Pública \n Sala: S-03-P03-A \n Docente: Madison Cid", clase: "fundamentos-salud" },
      { hora: "17:15 - 17:55", actividad: "Gestión del Cuidado en Salud Mental \n Sala: S-03-P03-A \n Docente: Guillermo Ormeño", clase: "gestion-salud-mental" },
      { hora: "17:56 - 18:35", actividad: "Gestión del Cuidado en Salud Mental \n Sala: S-03-P03-A \n Docente: Guillermo Ormeño", clase: "gestion-salud-mental" },
      { hora: "18:40 - 19:20", actividad: "Gestión del Cuidado en Salud Mental \n Sala: S-03-P03-A \n Docente: Guillermo Ormeño", clase: "gestion-salud-mental" },
    ],
    miércoles: [
    //   { hora: "14:15 - 14:55", actividad: "Inglés Básico I \n Sala: S-03-P05-A \n Docente: Valentina Mendoza", clase: "ingles-basico" },
    //   { hora: "14:56 - 15:35", actividad: "Inglés Básico I \n Sala: S-03-P05-A \n Docente: Valentina Mendoza", clase: "ingles-basico" },
      { hora: "15:46 - 16:25", actividad: "Fundamentos en Salud Pública \n Sala: S-02-P05-A \n Docente: Madison Cid", clase: "fundamentos-salud" },
      { hora: "16:26 - 17:05", actividad: "Fundamentos en Salud Pública \n Sala: S-02-P05-A \n Docente: Madison Cid", clase: "fundamentos-salud" },
      { hora: "17:15 - 17:55", actividad: "Fundamentos en Salud Pública \n Sala: S-02-P05-A \n Docente: Madison Cid", clase: "fundamentos-salud" },
    ],
    jueves: [
      { hora: "14:15 - 14:55", actividad: "Proceso de Enfermería \n Sala: L-07-P06-A \n Docente: Isela Robertson", clase: "proceso-enfermeria" },
      { hora: "14:56 - 15:35", actividad: "Proceso de Enfermería \n Sala: L-07-P06-A \n Docente: Isela Robertson", clase: "proceso-enfermeria" },
    ],
    viernes: [
    //   { hora: "14:15 - 14:55", actividad: "Inglés Básico I \n Sala: S-03-P05-A \n Docente: Valentina Mendoza", clase: "ingles-basico" },
    //   { hora: "14:56 - 15:35", actividad: "Inglés Básico I \n Sala: S-03-P05-A \n Docente: Valentina Mendoza", clase: "ingles-basico" },
      { hora: "15:46 - 16:25", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P05-A \n Docente: Rayen Oliva", clase: "bases-fisiopatologicas" },
      { hora: "16:26 - 17:05", actividad: "Bases Fisiopatológicas para el Cuidado \n Sala: S-03-P05-A \n Docente: Rayen Oliva", clase: "bases-fisiopatologicas" },
      { hora: "17:15 - 17:55", actividad: "Gestión del Cuidado en Salud Mental \n Sala: S-03-P05-A \n Docente: Guillermo Ormeño", clase: "gestion2-salud-mental" },
      { hora: "17:56 - 18:35", actividad: "Gestión del Cuidado en Salud Mental \n Sala: S-03-P05-A \n Docente: Guillermo Ormeño", clase: "gestion2-salud-mental" },
    ],
  };

  
  function updateSchedule() {
    const selectedDay = document.getElementById('daySelect').value;
    const scheduleTableBody = document.querySelector('#scheduleTable tbody');
    const noScheduleMessage = document.getElementById('noScheduleMessage');

    scheduleTableBody.innerHTML = '';
    noScheduleMessage.style.display = 'none';

    if (schedules[selectedDay] && schedules[selectedDay].length > 0) {
      schedules[selectedDay].forEach(item => {
        const row = scheduleTableBody.insertRow();
        const cellHour = row.insertCell(0);
        const cellActivity = row.insertCell(1);
        cellHour.textContent = item.hora;
        cellActivity.textContent = item.actividad;
        cellActivity.classList.add(item.clase);
      });
    } else {
      noScheduleMessage.style.display = 'block';
    }
  }

  const daysMap = { 1: "lunes", 2: "martes", 3: "miércoles", 4: "jueves", 5: "viernes" };
  const today = new Date().getDay();
  const currentDay = daysMap[today] || "lunes";

  document.getElementById('daySelect').value = currentDay;
  updateSchedule();

  document.getElementById('daySelect').addEventListener("change", updateSchedule);
});
