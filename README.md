# Convocado: Propuesta de Solución Agéntica y Flujos Operativos

## Trabajo Práctico 3 · Desarrollo de Sistemas Web · IFTS 29 · 2026

* **Grupo Asignado:** Grupo 13
* **Startup:** Convocado
* **Rubro:** Deportes y conexión de equipos
* **Objetivo de la Startup:** Red para que jugadores encuentren equipos y soliciten participar en partidos.
* **Bloque Asignado:** Búsqueda y solicitud (Código de sorteo docente S08.A)
* **Sentencias Asignadas:**
  * **Frase 1 (R1):** «Si un equipo tiene lugar para la fecha buscada y está a menos de diez kilómetros del jugador, el sistema lo muestra entre las opciones cercanas.»
  * **Frase 2 (R2):** «Si el equipo tiene lugar, está a menos de diez kilómetros, el jugador tiene valoración de al menos cuatro y autoriza la solicitud, el sistema envía esa solicitud al capitán.»

---

## 1. Integrantes del Grupo y Distribución de Tareas

* **Coordinación de Instrucciones al Agente:** Celina (Prompting, especificación de requerimientos lógicos y de diseño).
* **Revisión Lógica y Flujos Proposicionales:** Revisión de condiciones compuestas, temporalidad y validación en doble capa.
* **Pruebas de Accesibilidad y Responsive:** Verificación de navegación por teclado, contraste cromático, vista mobile y desktop.
* **Documentación y Preparación de Publicación:** Redacción del README, registro de iteraciones y verificación de enlaces.

### Evidencia de Colaboración y Mejora Grupal (Nivel Propone)
Durante la revisión del equipo, se incorporaron tres mejoras sustantivas de arquitectura y presentación:
1. **Diagramas de Flujo Interactivos en CSS:** Se reemplazaron los gráficos estáticos por flujogramas interactivos en HTML y CSS accesibles. Cada nodo es clickeable y cuenta con un inspector dinámico que detalla las herramientas consultadas y las decisiones adoptadas.
2. **Especialización del Camino del NO:** Para R1, si no se cumplen las condiciones, el equipo no se muestra como cercano; como propuesta de diseño, se ofrece ajustar la búsqueda. Para R2, la autorización se expresa en el inicio del diagrama y luego se comprueba el cupo, la distancia y la valoración. Si no se cumplen los criterios de envío, la solicitud no se envía al capitán; las revisiones manuales pertenecen a R4 y R6.
3. **Demostración de Interfaz Móvil y Presets:** Se construyeron dos mockups interactivos de celular en CSS puro (Vista Jugador y Vista Capitán) y cuatro botones de prueba rápida para agilizar la comprobación docente.

---

## 2. Desarme Lógico de las Sentencias

### Ficha de Sentencia 1 (R1)
* **Texto Original:** «Si un equipo tiene lugar para la fecha buscada y está a menos de diez kilómetros del jugador, el sistema lo muestra entre las opciones cercanas.»
* **Datos Necesarios:** Coordenadas del jugador, fecha deseada y base de datos de partidos con vacantes y geolocalización de canchas.
* **Condición Lógica:** `(hay_lugar_para_fecha_buscada) Y (distancia_km < 10)`.
* **Consecuencia SÍ:** Se incorpora a la lista de opciones cercanas visibles al deportista.
* **Decisión de Diseño del Grupo:** La fecha se verifica como parte de que haya un lugar para la fecha buscada, no como una condición adicional. Se limita la búsqueda a fechas vigentes. Si no se cumple R1, se puede ofrecer ajustar la búsqueda, sin mostrar como cercanos equipos que no cumplen el radio.

### Ficha de Sentencia 2 (R2)
* **Texto Original:** «Si el equipo tiene lugar, está a menos de diez kilómetros, el jugador tiene valoración de al menos cuatro y autoriza la solicitud, el sistema envía esa solicitud al capitán.»
* **Datos Necesarios:** Vacantes activas del equipo, distancia en kilómetros, valoración del jugador, autorización expresa y canal de contacto del capitán.
* **Condición Lógica:** `(equipo.cupo > 0) Y (distancia < 10) Y (jugador.valoracion >= 4) Y (autorizacion_explicita)`.
* **Consecuencia SÍ:** Despacho reactivo de alerta prioritaria a la bandeja del capitán del equipo.
* **Decisión de Diseño del Grupo:** La escala de valoración sobre cinco puntos es una interpretación de la consigna, que solo fija el umbral mínimo de cuatro.
* **Caso límite (NO):** Si falta cupo, no se audita el perfil ni se envía la solicitud. Si falla distancia, valoración o autorización, tampoco se envía al capitán. La revisión manual corresponde a R4 y R6, no a R2. Si el cupo se agota concurrentemente antes del envío, se frena el despacho.

---

## 3. Registro de Herramientas de IA y Construcción Agéntica

El proyecto fue desarrollado bajo la premisa obligatoria de **construcción 100% agéntica**, dirigiendo al agente mediante instrucciones iterativas sin editar código manualmente.

* **Entorno de Trabajo (Aplicación):** Antigravity IDE
* **Modelo Seleccionado:** Gemini 3.8 Flash
* **Uso Asignado:** Análisis de consigna en PDF, extracción cromática del logotipo, diseño de la arquitectura mobile first, diagramación interactiva en CSS puro, construcción de mockups de celular interactivos, lógica accesible en JavaScript y redacción documental.

### Evidencia de Iteración y Corrección (Nivel Propone)
* **Instrucción Inicial:** Diseñar la landing page con modo nocturno y colores del logo de Convocado.
* **Problema Detectado en la Revisión:** Los diagramas necesitaban reflejar con claridad las condiciones de las reglas y separar las propuestas de diseño de los requisitos normativos.
* **Pedido de Mejora al Agente:** Migrar los diagramas hacia componentes en HTML y CSS puro completamente clickeables con inspector dinámico de nodos, y distinguir las propuestas de diseño de los resultados normativos.
* **Resultado:** La interfaz ofrece flujogramas interactivos fluidos, responsivos y con lectura espaciosa para todos los casos límite.

---

## 4. Instrucciones para Reproducir el Proyecto Localmente

1. Clonar el repositorio oficial:
```bash
git clone <URL_DEL_REPOSITORIO>
cd tp3-convocado
```

2. Abrir el archivo `index.html` directamente en cualquier navegador moderno:
```bash
# En macOS
open index.html

# O mediante un servidor local ligero
npx serve .
```

3. Comprobación de funcionamiento:
* Probar el botón de alternancia entre Modo Claro y Modo Nocturno.
* Interactuar con los diagramas en CSS: hacer clic sobre cualquier nodo (Inicio, Herramientas, Decisión, Ramas) para observar cómo el inspector inferior detalla entradas, herramientas y acciones.
* Interactuar con la demo de celulares: presionar «Postularme» en el teléfono del jugador y luego «Aceptar en el Equipo» en el teléfono del capitán.
* Probar los 4 botones de presets del simulador: caso exitoso, fuera de radio, distancia exacta de 10 km y valoración exacta de 4,0. Comprobar también que sin autorización no se envía la solicitud.
* Revisar la sección «¿Qué es Convocado?» entre el hero y la Regla 1: R1 y R2 quedan visibles en tarjetas, y los bloques 2 y 3 se despliegan con teclado o clic.
* Desplazarse por la página para comprobar las entradas animadas, los subrayados y los acentos de color de cada sección. Las animaciones respetan la preferencia de movimiento reducido del sistema.
* Revisar la sección «Sobre Nosotros» al final de la página y reemplazar los cuatro nombres y textos de ejemplo por los datos del equipo.
* Desplegar los apartados técnicos mediante clic o teclado (Enter o Barra Espaciadora).
* Para leer las sentencias y la descripción de cada solución con teclado, usa Tab para recorrer sus textos; al entrar desde un enlace de regla, el foco llega a la sección correspondiente.
* Abrir y cerrar los modales de Términos del Servicio y Política de Privacidad desde el pie de página.

---

## 5. Publicación y Enlaces

* **Repositorio del Proyecto:** Pendiente de enlace por el grupo
* **Landing Page Publicada:** Pendiente de publicación por el grupo (ejemplo GitHub Pages o Vercel)
