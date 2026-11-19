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
      inputs: 'Existencia de lugar para la fecha buscada y distancia calculada en kilómetros.',
      tools: 'Motor de inferencia de reglas lógicas.',
      description: 'Evalúa las dos condiciones de R1: que haya lugar para la fecha buscada y que la distancia sea menor a diez kilómetros. La fecha se verifica como parte de la disponibilidad del lugar, no como una condición adicional.'
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
      title: 'Paso 4 (NO): Ofrecer Ajustar la Búsqueda',
      tag: 'Propuesta de Diseño y Excepciones',
      inputs: 'Motivo específico del descarte (distancia excesiva, sin cupo o fecha sin partidos).',
      tools: 'Agente de recomendación para ajustar parámetros de búsqueda.',
      description: 'El equipo no se lista en opciones cercanas. Como propuesta del grupo, se ofrece ajustar la búsqueda sin presentar como cercanos partidos que no cumplen R1.'
    },
    'r1-end-no': {
      title: 'Paso 5 (NO): Búsqueda finalizada',
      tag: 'Estado final',
      inputs: 'Resultado negativo de la validación de la Regla R1.',
      tools: 'Motor de reglas de búsqueda.',
      description: 'Después de ofrecer el ajuste de búsqueda, el flujo termina. No se muestran resultados de equipos que no cumplen R1.'
    },

    'r2-start': {
      title: 'Paso 1: Solicitud de Postulación Autorizada',
      tag: 'Evento Inicial',
      inputs: 'Identificador del partido seleccionado, datos de postulación y autorización expresa del jugador.',
      tools: 'Interfaz de postulación directa.',
      description: 'El jugador autoriza el envío al iniciar la postulación para un equipo específico.'
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
      description: 'Con un lugar disponible y la postulación autorizada desde el inicio, comprueba si el partido está a menos de diez kilómetros y si el jugador alcanza una valoración de al menos cuatro. La interpretación de la escala sobre cinco puntos es una decisión del grupo.'
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
      description: 'El jugador recibe constancia de envío exitoso. La solicitud queda pendiente de la decisión del capitán.'
    },
    'r2-action-no': {
      title: 'Paso 5 (NO): Informar que no cumple los criterios',
      tag: 'Propuesta de Diseño',
      inputs: 'Valoración menor a cuatro puntos o distancia de diez kilómetros o más.',
      tools: 'Módulo de notificaciones al jugador.',
      description: 'Se informa al jugador que su solicitud no se envía al capitán porque no cumple los criterios de distancia o valoración de R2.'
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
      title: 'Paso 4 (NO): Cupo completo, solicitud no enviada',
      tag: 'Fin del flujo',
      inputs: 'Confirmación de que el partido no tiene lugares disponibles.',
      tools: 'Servicio de consulta de cupos.',
      description: 'El flujo termina sin auditar distancia o valoración y sin enviar la solicitud. La búsqueda o lista de espera se ofrece como una opción aparte.'
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
  const rangeDistancia = document.getElementById('sim-distancia');
  const rangeValoracion = document.getElementById('sim-valoracion');
  const checkAutorizacion = document.getElementById('sim-autorizacion');

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
    if (!selectLugar || !rangeDistancia || !rangeValoracion || !checkAutorizacion) {
      return;
    }

    const tieneLugar = selectLugar.value === 'si';
    const distancia = parseFloat(rangeDistancia.value);
    const valoracion = parseFloat(rangeValoracion.value);
    const autoriza = checkAutorizacion.checked;

    if (valDistanciaDisplay) {
      valDistanciaDisplay.textContent = distancia + ' km';
    }
    if (valValoracionDisplay) {
      valValoracionDisplay.textContent = valoracion.toFixed(1) + ' puntos';
    }

    // Regla 1 (R1)
    const r1Cumple = tieneLugar && (distancia < 10);

    if (boxR1 && msgR1 && badgeR1) {
      if (r1Cumple) {
        boxR1.className = 'result-box result-success';
        badgeR1.className = 'result-status-badge badge-ok';
        badgeR1.textContent = 'MUESTRA';
        msgR1.textContent = 'Cumple las dos condiciones de R1: hay lugar para la fecha buscada y la distancia (' + distancia + ' km) es menor a 10 km. El sistema lo muestra entre las opciones cercanas.';
      } else {
        boxR1.className = 'result-box result-failure';
        badgeR1.className = 'result-status-badge badge-block';
        badgeR1.textContent = 'NO MUESTRA';
        
        const motivos = [];
        if (!tieneLugar) motivos.push('no hay lugar para la fecha buscada');
        if (distancia >= 10) motivos.push('la distancia es de ' + distancia + ' km (mayor o igual a 10 km)');
        
        msgR1.textContent = 'No se muestra en opciones cercanas porque ' + motivos.join(', ') + '. Se puede ajustar la búsqueda, sin mostrar este equipo como cercano.';
      }
    }

    // Regla 2 (R2)
    const r2Cumple = tieneLugar && (distancia < 10) && (valoracion >= 4.0) && autoriza;

    if (boxR2 && msgR2 && badgeR2) {
      if (r2Cumple) {
        boxR2.className = 'result-box result-success';
        badgeR2.className = 'result-status-badge badge-ok';
        badgeR2.textContent = 'ENVÍA';
        msgR2.textContent = 'Cumple las cuatro condiciones de R2: hay lugar, la distancia (' + distancia + ' km) es menor a 10 km, la valoración (' + valoracion.toFixed(1) + ') alcanza el mínimo de 4 y el jugador autoriza. El sistema envía la solicitud al capitán, quien decide si acepta.';
      } else {
        boxR2.className = 'result-box result-failure';
        badgeR2.className = 'result-status-badge badge-block';
        badgeR2.textContent = 'NO ENVÍA';

        const motivos = [];
        if (!tieneLugar) {
          motivos.push('no hay lugar para la fecha solicitada');
        } else {
          if (distancia >= 10) motivos.push('la distancia (' + distancia + ' km) no es menor a 10 km');
          if (valoracion < 4.0) motivos.push('la valoración (' + valoracion.toFixed(1) + ') es inferior a 4');
          if (!autoriza) motivos.push('el jugador no autoriza el envío');
        }

        msgR2.textContent = 'La solicitud no se envía al capitán porque ' + motivos.join(', ') + (tieneLugar ? '.' : '. No se auditan distancia ni valoración al faltar cupo.');
      }
    }

    if (auditList) {
      auditList.innerHTML = '';
      const items = [
        'Lugar para la fecha buscada: ' + (tieneLugar ? 'SÍ' : 'NO'),
        'Distancia calculada: ' + (tieneLugar ? distancia + ' km (Criterio menor a 10 km: ' + (distancia < 10 ? 'VÁLIDO' : 'EXCEDIDO') + ')' : 'NO AUDITADA: falta lugar'),
        'Valoración: ' + (tieneLugar ? valoracion.toFixed(1) + ' (Umbral de 4: ' + (valoracion >= 4.0 ? 'CUMPLE' : 'NO CUMPLE') + ')' : 'NO AUDITADA: falta lugar'),
        'Autorización de envío: ' + (tieneLugar ? (autoriza ? 'SÍ' : 'NO') : 'NO REQUERIDA: falta lugar')
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
  const btnPreset10Km = document.getElementById('preset-10km');
  const btnPresetValoracion = document.getElementById('preset-valoracion');

  if (btnPresetIdeal) {
    btnPresetIdeal.addEventListener('click', () => {
      selectLugar.value = 'si';
      rangeDistancia.value = '5';
      rangeValoracion.value = '4.8';
      checkAutorizacion.checked = true;
      evaluateSimulator();
    });
  }

  if (btnPresetRadio) {
    btnPresetRadio.addEventListener('click', () => {
      selectLugar.value = 'si';
      rangeDistancia.value = '14';
      rangeValoracion.value = '4.5';
      checkAutorizacion.checked = true;
      evaluateSimulator();
    });
  }

  if (btnPreset10Km) {
    btnPreset10Km.addEventListener('click', () => {
      selectLugar.value = 'si';
      rangeDistancia.value = '10';
      rangeValoracion.value = '4.5';
      checkAutorizacion.checked = true;
      evaluateSimulator();
    });
  }

  if (btnPresetValoracion) {
    btnPresetValoracion.addEventListener('click', () => {
      selectLugar.value = 'si';
      rangeDistancia.value = '6';
      rangeValoracion.value = '4.0';
      checkAutorizacion.checked = true;
      evaluateSimulator();
    });
  }

  [selectLugar, rangeDistancia, rangeValoracion, checkAutorizacion].forEach((element) => {
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
