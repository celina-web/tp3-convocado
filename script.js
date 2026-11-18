/**
 * Convocado: Script de Interacción, Accesibilidad, Simulación y Demo Móvil
 * Grupo 13 · IFTS 29 · 2026
 * Sin dependencias externas · Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     Animaciones de entrada al hacer scroll
     ========================================================================== */
  document.querySelectorAll('.diagram-node').forEach((node) => {
    node.classList.add('anim-scale-in');
  });

  const scrollAnimatedElements = document.querySelectorAll(
    '.anim-fade-up, .anim-fade-up-slow, .anim-fade-left, .anim-scale-in'
  );
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = motionPreference.matches;

  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    function syncHeroVideoPlayback() {
      if (motionPreference.matches) {
        heroVideo.pause();
        return;
      }

      heroVideo.play().catch((error) => {
        console.error('No se pudo reproducir el video de fondo del hero.', error);
      });
    }

    syncHeroVideoPlayback();
    motionPreference.addEventListener('change', syncHeroVideoPlayback);
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    scrollAnimatedElements.forEach((element) => element.classList.add('in-view'));
  } else {
    document.documentElement.classList.add('js-scroll-animations');

    const scrollAnimationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -32px 0px',
      threshold: 0.12
    });

    scrollAnimatedElements.forEach((element) => scrollAnimationObserver.observe(element));
  }

  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    function updateBackToTopVisibility() {
      const isVisible = window.scrollY > 320;
      backToTopBtn.classList.toggle('is-visible', isVisible);
      backToTopBtn.setAttribute('aria-hidden', String(!isVisible));
      backToTopBtn.tabIndex = isVisible ? 0 : -1;
    }

    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    updateBackToTopVisibility();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ==========================================================================
     1. Gestión de Modo Nocturno (Dark Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  function updateThemeButton(theme) {
    if (!themeToggleBtn) return;
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    const textSpan = themeToggleBtn.querySelector('.theme-text');
    if (textSpan) {
      textSpan.textContent = isDark ? 'Claro' : 'Noche';
    }
  }

  const currentTheme = rootElement.getAttribute('data-theme') || 'light';
  updateThemeButton(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = rootElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      rootElement.setAttribute('data-theme', activeTheme);
      localStorage.setItem('convocado-theme', activeTheme);
      updateThemeButton(activeTheme);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('convocado-theme')) {
      const systemTheme = e.matches ? 'dark' : 'light';
      rootElement.setAttribute('data-theme', systemTheme);
      updateThemeButton(systemTheme);
    }
  });


  /* ==========================================================================
     2. Desplegables Accesibles (Accordions con soporte de Clic y Teclado)
     ========================================================================== */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      if (!panel) return;

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        trigger.click();
      }
    });
  });


  /* ==========================================================================
     3. Diagramas de Flujo Interactivos en CSS (Inspector Dinámico)
     ========================================================================== */
  const nodeDetailsData = {
    'r1-start': {
      title: 'Paso 1: Solicitud de Búsqueda',
      tag: 'Evento Inicial',
      inputs: 'Fecha requerida y geolocalización actual del jugador.',
      tools: 'Módulo de entrada de interfaz con validación de fecha vigente.',
      description: 'El deportista define el día en el que quiere jugar y habilita el acceso a su posición geográfica. El sistema verifica que la fecha no sea pretérita.'
    },
    'r1-tools': {
      title: 'Paso 2: Herramientas del Agente Scout',
      tag: 'Procesamiento Agéntico',
      inputs: 'Coordenadas del usuario y base de datos central de encuentros.',
      tools: 'API de mapas y cálculo de distancia vial, Base de datos de cronogramas y vacantes.',
      description: 'El agente computa la distancia hacia cada sede deportiva en tiempo real y consulta cuáles conservan al menos un cupo sin ocupar.'
    },
    'r1-decision': {
      title: 'Paso 3: Evaluación de la Regla R1',
      tag: 'Decisión Lógica Proposicional',
      inputs: 'Estado de vacante, correspondencia de fecha y distancia calculada en kilómetros.',
      tools: 'Motor de inferencia de reglas lógicas.',
      description: 'Evalúa la conjunción estricta: ¿El equipo tiene lugar disponible Y la fecha coincide Y la distancia es estrictamente menor a diez kilómetros? Si alguna premisa es falsa, bifurca hacia la rama alternativa.'
    },
    'r1-action-yes': {
      title: 'Paso 4 (SÍ): Publicar en Opciones Cercanas',
      tag: 'Acción Obligatoria de la Regla',
      inputs: 'Equipos que superaron con éxito la evaluación lógica.',
      tools: 'Servicio de renderizado de interfaz y ordenamiento geográfico.',
      description: 'Consecuencia directa exigida por la sentencia: el equipo se exhibe en la lista principal de opciones cercanas al jugador, ordenado por distancia ascendente.'
    },
    'r1-end-yes': {
      title: 'Paso 5 (SÍ): Fin del Recorrido Exitoso',
      tag: 'Estado Final Afirmativo',
      inputs: 'Ficha del partido visible en pantalla.',
      tools: 'Interfaz de usuario.',
      description: 'El deportista visualiza los detalles del partido (horario, cancha, cupo) y queda habilitado para iniciar su postulación.'
    },
    'r1-action-no': {
      title: 'Paso 4 (NO): Sugerencias Asistidas del Agente',
      tag: 'Propuesta de Diseño y Excepciones',
      inputs: 'Motivo específico del descarte (distancia excesiva, sin cupo o fecha sin partidos).',
      tools: 'Agente de recomendación geográfica y sugerencia de fechas.',
      description: 'El equipo no se lista en cercanas. En lugar de dejar la pantalla vacía, el agente sugiere ampliar el radio a doce kilómetros si está fuera de zona o buscar partidos en fechas próximas.'
    },
    'r1-end-no': {
      title: 'Paso 5 (NO): Fin del Recorrido de Excepción',
      tag: 'Estado Final Alternativo',
      inputs: 'Alternativas contextuales presentadas al usuario.',
      tools: 'Panel de configuración de alertas.',
      description: 'El usuario conserva el control: decide si amplía su radio de búsqueda, elige otra fecha o activa una alerta para recibir avisos de nuevos partidos.'
    },

    'r2-start': {
      title: 'Paso 1: Solicitud de Postulación',
      tag: 'Evento Inicial',
      inputs: 'Identificador del partido seleccionado y confirmación del jugador.',
      tools: 'Interfaz de postulación directa.',
      description: 'El jugador manifiesta su voluntad deliberada de sumarse a un equipo específico presionando el botón de postulación.'
    },
    'r2-tools': {
      title: 'Paso 3: Herramientas del Agente Moderador',
      tag: 'Auditoría posterior al cupo',
      inputs: 'Identificador del jugador y datos del partido con lugar disponible.',
      tools: 'Servicio de cálculo de distancia y base de datos comunitaria de valoraciones.',
      description: 'Solo después de confirmar que hay lugar, el agente calcula la distancia exacta y recupera la valoración comunitaria del jugador.'
    },
    'r2-decision': {
      title: 'Paso 2: Verificación de Cupo',
      tag: 'Primera decisión',
      inputs: 'Estado actualizado de los lugares disponibles en el partido.',
      tools: 'Servicio de consulta de cupos.',
      description: 'El agente pregunta primero si queda un lugar. Si el cupo está completo, termina el flujo de forma definitiva sin auditar distancia o valoración y sin enviar la solicitud.'
    },
    'r2-quality-decision': {
      title: 'Paso 4: Evaluación de Distancia y Valoración',
      tag: 'Decisión de auditoría',
      inputs: 'Distancia calculada y valoración comunitaria del jugador.',
      tools: 'Motor de validación de reglas.',
      description: 'Con un lugar disponible, comprueba si el partido está a menos de diez kilómetros y si el jugador tiene una valoración de al menos cuatro. Si cumple ambas condiciones y autorizó la postulación, envía la alerta; si no, deriva la solicitud a revisión manual sin reservar el lugar.'
    },
    'r2-action-yes': {
      title: 'Paso 5 (SÍ): Despacho de Alerta al Capitán',
      tag: 'Acción Obligatoria de la Regla',
      inputs: 'Ficha técnica y antecedentes verificados del jugador.',
      tools: 'Servicio reactivo de mensajería asíncrona y notificaciones push.',
      description: 'Consecuencia directa exigida por la sentencia: se genera una alerta prioritaria en la bandeja del capitán con los datos del postulante para que concrete la admisión en un toque.'
    },
    'r2-end-yes': {
      title: 'Paso 6 (SÍ): Solicitud en Espera de Aceptación',
      tag: 'Estado Final Afirmativo',
      inputs: 'Constancia de entrega exitosa de la postulación.',
      tools: 'Bandeja de solicitudes del capitán.',
      description: 'El jugador recibe constancia de envío exitoso y el capitán dispone de la ficha para confirmar la incorporación al equipo.'
    },
    'r2-action-no': {
      title: 'Paso 5 (NO): Informar al jugador',
      tag: 'Propuesta de Diseño',
      inputs: 'Valoración menor a cuatro puntos o distancia de diez kilómetros o más.',
      tools: 'Módulo de notificaciones al jugador.',
      description: 'Se informa al jugador que su postulación no es enviada directamente al capitán.'
    },
    'r2-end-no': {
      title: 'Paso 6 (NO): No se envía solicitud al capitán',
      tag: 'Fin del flujo',
      inputs: 'Resultado de la auditoría de distancia y valoración.',
      tools: 'Interfaz de estado de la postulación.',
      description: 'La solicitud no cumple los criterios para ser enviada al capitán.'
    },
    'r2-action-no-cupo': {
      title: 'Paso 3 (NO): Informar al jugador por falta de cupo',
      tag: 'Propuesta de Diseño',
      inputs: 'Confirmación de que el partido no tiene lugar disponible.',
      tools: 'Módulo de notificaciones y lista de espera.',
      description: 'Se informa al jugador que no hay lugar disponible y se ofrece incluirlo en la lista de espera o continuar con la búsqueda.'
    },
    'r2-end-no-cupo': {
      title: 'Paso 4 (NO): No Definitivo por Cupo Completo',
      tag: 'Fin definitivo',
      inputs: 'Confirmación de que el partido no tiene lugares disponibles.',
      tools: 'Servicio de consulta de cupos.',
      description: 'El flujo termina sin continuar con la auditoría y no se envía ninguna solicitud al capitán.'
    }
  };

  /* ==========================================================================
     3. Diagramas de Flujo Interactivos (Cartel Flotante de Detalle)
     ========================================================================== */
  const nodePopoverDialog = document.getElementById('node-popover-dialog');
  const popoverNodeTag = document.getElementById('popover-node-tag');
  const popoverNodeTitle = document.getElementById('popover-node-title');
  const popoverInputs = document.getElementById('popover-inputs');
  const popoverTools = document.getElementById('popover-tools');
  const popoverDesc = document.getElementById('popover-desc');
  const popoverCloseBtn = document.getElementById('popover-close-btn');

  let activeDiagramNode = null;

  function openNodePopover(node) {
    const nodeId = node.getAttribute('data-node-id');
    const data = nodeDetailsData[nodeId];
    if (!nodePopoverDialog || !data) return;

    activeDiagramNode = node;

    // Resaltar nodo activo en el diagrama
    const parentDiagram = node.closest('.interactive-diagram');
    if (parentDiagram) {
      parentDiagram.querySelectorAll('.diagram-node').forEach((n) => n.classList.remove('is-active'));
    }
    node.classList.add('is-active');

    // Inyectar datos en el cartel flotante
    if (popoverNodeTag) {
      popoverNodeTag.textContent = data.tag;
      popoverNodeTag.className = 'popover-tag';
      if (data.tag.includes('Propuesta de Diseño')) {
        popoverNodeTag.classList.add('tag-violet');
      } else if (nodeId.includes('no')) {
        popoverNodeTag.classList.add('tag-red');
      } else if (nodeId.includes('yes')) {
        popoverNodeTag.classList.add('tag-green');
      } else if (nodeId.includes('tools') || nodeId.includes('decision')) {
        popoverNodeTag.classList.add('tag-blue');
      }
    }
    if (popoverNodeTitle) popoverNodeTitle.textContent = data.title;
    if (popoverInputs) popoverInputs.textContent = data.inputs;
    if (popoverTools) popoverTools.textContent = data.tools;
    if (popoverDesc) popoverDesc.textContent = data.description;

    // Abrir modal dialog
    if (typeof nodePopoverDialog.showModal === 'function') {
      nodePopoverDialog.showModal();
    } else {
      nodePopoverDialog.setAttribute('open', '');
    }

    if (popoverCloseBtn) {
      popoverCloseBtn.focus();
    }
  }

  function closeNodePopover() {
    if (!nodePopoverDialog) return;
    if (typeof nodePopoverDialog.close === 'function') {
      nodePopoverDialog.close();
    } else {
      nodePopoverDialog.removeAttribute('open');
    }
    if (activeDiagramNode) {
      activeDiagramNode.focus();
    }
  }

  // Clic en nodos del diagrama
  const diagramNodes = document.querySelectorAll('.diagram-node');
  diagramNodes.forEach((node) => {
    node.addEventListener('click', () => {
      openNodePopover(node);
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        openNodePopover(node);
      }
    });
  });

  // Botón de cierre en la cabecera del cartel
  if (popoverCloseBtn) {
    popoverCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeNodePopover();
    });
  }

  // Cierre al clickear fuera del cartel flotante (en el fondo o backdrop)
  if (nodePopoverDialog) {
    nodePopoverDialog.addEventListener('click', (e) => {
      const card = nodePopoverDialog.querySelector('.node-popover-card');
      if (card && !card.contains(e.target)) {
        closeNodePopover();
      }
    });

    // Tecla Escape para accesibilidad
    nodePopoverDialog.addEventListener('cancel', () => {
      if (activeDiagramNode) {
        activeDiagramNode.focus();
      }
    });
  }


  /* ==========================================================================
     4. Demo Visual Interactiva de Dispositivos Móviles
     ========================================================================== */
  const demoPostularBtn = document.getElementById('demo-postular-btn');
  const demoCaptainAlert = document.getElementById('demo-captain-alert');
  const demoAcceptBtn = document.getElementById('demo-accept-btn');
  const demoCaptainAccepted = document.getElementById('demo-captain-accepted');
  const demoPlayerFeedback = document.getElementById('demo-player-feedback');

  if (demoPostularBtn) {
    demoPostularBtn.addEventListener('click', () => {
      demoPostularBtn.textContent = '¡Solicitud Enviada!';
      demoPostularBtn.style.backgroundColor = 'var(--brand-gold)';
      demoPostularBtn.style.color = '#000000';

      if (demoPlayerFeedback) {
        demoPlayerFeedback.innerHTML = '<span>✓ Solicitud despachada al capitán. Alerta enviada en tiempo real.</span>';
      }

      if (demoCaptainAlert) {
        demoCaptainAlert.style.borderColor = 'var(--brand-green)';
        demoCaptainAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (demoAcceptBtn && demoCaptainAlert && demoCaptainAccepted) {
    demoAcceptBtn.addEventListener('click', () => {
      demoCaptainAlert.hidden = true;
      demoCaptainAccepted.hidden = false;
    });
  }


  /* ==========================================================================
     5. Simulador Interactivo de Sentencias Proposicionales
     ========================================================================== */
  const selectLugar = document.getElementById('sim-lugar');
  const selectFecha = document.getElementById('sim-fecha');
  const rangeDistancia = document.getElementById('sim-distancia');
  const rangeValoracion = document.getElementById('sim-valoracion');

  const valDistanciaDisplay = document.getElementById('distancia-val');
  const valValoracionDisplay = document.getElementById('valoracion-val');

  const boxR1 = document.getElementById('sim-res-r1');
  const msgR1 = document.getElementById('r1-result-message');
  const badgeR1 = boxR1 ? boxR1.querySelector('.result-status-badge') : null;

  const boxR2 = document.getElementById('sim-res-r2');
  const msgR2 = document.getElementById('r2-result-message');
  const badgeR2 = boxR2 ? boxR2.querySelector('.result-status-badge') : null;

  const auditList = document.getElementById('audit-list');

  function evaluateSimulator() {
    if (!selectLugar || !selectFecha || !rangeDistancia || !rangeValoracion) {
      return;
    }

    const tieneLugar = selectLugar.value === 'si';
    const fechaCoincide = selectFecha.value === 'si';
    const distancia = parseFloat(rangeDistancia.value);
    const valoracion = parseFloat(rangeValoracion.value);

    if (valDistanciaDisplay) {
      valDistanciaDisplay.textContent = distancia + ' km';
    }
    if (valValoracionDisplay) {
      valValoracionDisplay.textContent = valoracion.toFixed(1) + ' puntos';
    }

    // Regla 1 (R1)
    const r1Cumple = tieneLugar && fechaCoincide && (distancia < 10);

    if (boxR1 && msgR1 && badgeR1) {
      if (r1Cumple) {
        boxR1.className = 'result-box result-success';
        badgeR1.className = 'result-status-badge badge-ok';
        badgeR1.textContent = 'MUESTRA';
        msgR1.textContent = 'Cumple las tres condiciones simultáneas. El equipo tiene lugar, la fecha coincide y la distancia (' + distancia + ' km) es menor a 10 km. El sistema lo muestra entre las opciones cercanas.';
      } else {
        boxR1.className = 'result-box result-failure';
        badgeR1.className = 'result-status-badge badge-block';
        badgeR1.textContent = 'NO MUESTRA';
        
        const motivos = [];
        if (!tieneLugar) motivos.push('el equipo no tiene lugar');
        if (!fechaCoincide) motivos.push('la fecha no coincide con la buscada');
        if (distancia >= 10) motivos.push('la distancia es de ' + distancia + ' km (mayor o igual a 10 km)');
        
        msgR1.textContent = 'No se muestra en cercanas porque ' + motivos.join(', ') + '. El agente ofrece sugerencias o radios ampliados.';
      }
    }

    // Regla 2 (R2)
    const r2Cumple = tieneLugar && (distancia < 10) && (valoracion >= 4.0);

    if (boxR2 && msgR2 && badgeR2) {
      if (r2Cumple) {
        boxR2.className = 'result-box result-success';
        badgeR2.className = 'result-status-badge badge-ok';
        badgeR2.textContent = 'ENVÍA';
        msgR2.textContent = 'Cumple los requisitos objetivos. Hay lugar, la distancia (' + distancia + ' km) es menor a 10 km y la valoración (' + valoracion.toFixed(1) + ') es igual o superior a 4 puntos. El sistema envía la solicitud formal al capitán.';
      } else {
        boxR2.className = 'result-box result-failure';
        badgeR2.className = 'result-status-badge badge-block';
        badgeR2.textContent = 'NO ENVÍA';

        const motivos = [];
        if (valoracion < 4.0) motivos.push('la valoración (' + valoracion.toFixed(1) + ') es inferior a 4');
        if (distancia >= 10) motivos.push('la distancia (' + distancia + ' km) es mayor o igual a 10 km');
        if (!tieneLugar) motivos.push('el equipo no dispone de cupo');

        msgR2.textContent = 'La solicitud no se envía directamente al capitán porque ' + motivos.join(', ') + '. ' + 
          (valoracion < 4.0 && tieneLugar && distancia < 10 
            ? 'El agente ofrece derivación a revisión manual del capitán.' 
            : 'El flujo se detiene de forma segura.');
      }
    }

    if (auditList) {
      auditList.innerHTML = '';
      const items = [
        'Lugar disponible: ' + (tieneLugar ? 'SÍ' : 'NO'),
        'Coincidencia de fecha: ' + (fechaCoincide ? 'SÍ' : 'NO'),
        'Distancia calculada: ' + distancia + ' km (Criterio menor a 10 km: ' + (distancia < 10 ? 'VÁLIDO' : 'EXCEDIDO') + ')',
        'Puntuación del jugador: ' + valoracion.toFixed(1) + ' puntos (Piso de 4.0: ' + (valoracion >= 4.0 ? 'APROBADO' : 'INSUFICIENTE') + ')'
      ];

      items.forEach((txt) => {
        const li = document.createElement('li');
        li.textContent = txt;
        auditList.appendChild(li);
      });
    }
  }

  // Presets de 1 Clic para Evaluación Docente
  const btnPresetIdeal = document.getElementById('preset-ideal');
  const btnPresetRadio = document.getElementById('preset-radio');
  const btnPresetRevision = document.getElementById('preset-revision');

  if (btnPresetIdeal) {
    btnPresetIdeal.addEventListener('click', () => {
      selectLugar.value = 'si';
      selectFecha.value = 'si';
      rangeDistancia.value = '5';
      rangeValoracion.value = '4.8';
      evaluateSimulator();
    });
  }

  if (btnPresetRadio) {
    btnPresetRadio.addEventListener('click', () => {
      selectLugar.value = 'si';
      selectFecha.value = 'si';
      rangeDistancia.value = '14';
      rangeValoracion.value = '4.5';
      evaluateSimulator();
    });
  }

  if (btnPresetRevision) {
    btnPresetRevision.addEventListener('click', () => {
      selectLugar.value = 'si';
      selectFecha.value = 'si';
      rangeDistancia.value = '6';
      rangeValoracion.value = '3.2';
      evaluateSimulator();
    });
  }

  [selectLugar, selectFecha, rangeDistancia, rangeValoracion].forEach((element) => {
    if (element) {
      element.addEventListener('input', evaluateSimulator);
      element.addEventListener('change', evaluateSimulator);
    }
  });

  evaluateSimulator();


  /* ==========================================================================
     6. Modales Accesibles (Términos, Privacidad y Créditos)
     ========================================================================== */
  const modalButtons = document.querySelectorAll('[data-modal]');
  let lastFocusedElement = null;

  modalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        lastFocusedElement = btn;
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
        const closeBtn = modal.querySelector('[data-close-modal]');
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  const closeButtons = document.querySelectorAll('[data-close-modal]');
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) {
        if (typeof modal.close === 'function') {
          modal.close();
        } else {
          modal.removeAttribute('open');
        }
        if (lastFocusedElement) {
          lastFocusedElement.focus();
        }
      }
    });
  });

  const dialogs = document.querySelectorAll('dialog:not(#node-popover-dialog)');
  dialogs.forEach((dialog) => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
        if (lastFocusedElement) {
          lastFocusedElement.focus();
        }
      }
    });
  });

});
