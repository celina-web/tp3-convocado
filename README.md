# Convocado: propuesta de solución agéntica y flujos operativos

**Trabajo Práctico 3 · Desarrollo de Sistemas Web · IFTS 29 · 2026**

| | |
|---|---|
| **Grupo** | 13 |
| **Startup** | Convocado |
| **Rubro** | Deportes y conexión de equipos |
| **Objetivo de la startup** | Red para que jugadores encuentren equipos y soliciten participar en partidos. |
| **Bloque asignado** | Búsqueda y solicitud (código de sorteo S08.A) |
| **Repositorio** | https://github.com/celina-web/tp3-convocado |
| **Landing publicada** | https://tp3-convocado-grupo13.vercel.app |

## Sentencias asignadas

- **Frase 1 (R1):** «Si un equipo tiene lugar para la fecha buscada y está a menos de diez kilómetros del jugador, el sistema lo muestra entre las opciones cercanas.»
- **Frase 2 (R2):** «Si el equipo tiene lugar, está a menos de diez kilómetros, el jugador tiene valoración de al menos cuatro y autoriza la solicitud, el sistema envía esa solicitud al capitán.»

---

## 1. Integrantes y aportes


| Integrante | Rol | Qué hizo (aporte concreto) |
|---|---|---|
| Celina Tarn| Coordinación de instrucciones al agente | Redacción de los prompts y especificación de los requerimientos lógicos y de diseño. |
| Jair Sebastian Sarango Guaman | Revisión lógica y flujos proposicionales | Revisión de las condiciones compuestas de R1 y R2 y de las ramas del NO de cada flujo. Definió los casos límite (distancia exacta de 10 km y valoración exacta de 4,0) y que las propuestas no invadan las reglas R4 y R6. |
| Valentina Belén Sánchez | Pruebas de accesibilidad y responsive | Pruebas de navegación con teclado en los nodos de los diagramas, los desplegables y los modales, revisión de contraste en modo claro y nocturno, y control de la vista en mobile y desktop. |
| Agustín Cisneros Poggio | Documentación y publicación | Redacción del README y del registro de iteraciones, desarme lógico de las sentencias y verificación de los enlaces del repositorio y de la landing desde una ventana sin sesión. |

### Cómo trabajó el equipo

- **Reuniones:** hicimos una reunión breve de 15 minutos por Discord para entender la consigna y acordar cómo encarar el trabajo. Se repasaron las sentencias asignadas, el alcance del bloque de búsqueda y solicitud, y se definió organizar el desarrollo con instrucciones iterativas al agente, revisión lógica de las condiciones, pruebas de accesibilidad/responsive y documentación/publicación.

- **Decisiones tomadas en equipo:** 

1. **Flujos interactivos en lugar de diagramas estáticos.** Se reemplazaron los
   diagramas estáticos por flujos en HTML y CSS donde cada nodo es clickeable y
   abre un inspector con las herramientas que consulta el agente y las decisiones
   adoptadas. Además, las propuestas de diseño del grupo se distinguen visualmente
   de los requisitos de la sentencia, para que el lector sepa qué dice la regla y
   qué agregamos nosotros. Se sumaron mockups mobile y botones de prueba para
   recorrer los casos exitosos y los casos límite.

2. **Las propuestas no invaden otras reglas.** Las propuestas propias se limitan a
   lo que la sentencia no define. En R2, cuando no se cumple un criterio, el flujo
   termina en "no se envía la solicitud" y no crea ningún otro camino para que
   llegue al capitán; ese tratamiento le corresponde a otras reglas (R4 y R6), no
   a nuestro bloque.

3. **Contexto de la empresa sin desarrollar los otros bloques.** Se mencionan los
   bloques 2 y 3 solo para mostrar el recorrido completo de Convocado. No se
   desarrollan ni forman parte de esta entrega, que trabaja únicamente R1 y R2.


---

## 2. Desarme lógico de las sentencias

### Sentencia 1 (R1)

- **Datos necesarios:** coordenadas del jugador, fecha deseada y registro de equipos con vacantes y ubicación de sus canchas.
- **Condición lógica:** `(hay_lugar_para_fecha_buscada) Y (distancia_km < 10)`
- **Consecuencia (SÍ):** el equipo se incorpora a las opciones cercanas visibles.
- **Decisión de diseño del grupo:** la fecha forma parte de "hay lugar para la fecha buscada", no es una tercera condición. Si no se cumple R1, se puede ofrecer ajustar la búsqueda, sin mostrar como cercanos equipos que no cumplen el radio.

### Sentencia 2 (R2)

- **Datos necesarios:** vacantes del equipo, distancia en kilómetros, valoración del jugador, autorización expresa y canal del capitán.
- **Condición lógica:** `(equipo.cupo > 0) Y (distancia < 10) Y (jugador.valoracion >= 4) Y (autorizacion_explicita)`
- **Consecuencia (SÍ):** el sistema envía la solicitud a la bandeja del capitán. La aceptación final la decide el capitán.
- **Decisión de diseño del grupo:** la escala de valoración sobre cinco puntos es una interpretación nuestra; la regla solo fija el mínimo de cuatro.
- **Casos límite:** a exactamente 10 km no se cumple (la regla dice "menos de diez"); con valoración exactamente 4,0 sí se cumple. Si falta cupo, no se audita el perfil ni se envía la solicitud. Si falla distancia, valoración o autorización, tampoco se envía.

---

## 3. Herramientas de IA y construcción agéntica

El proyecto se desarrolló bajo construcción 100% agéntica: se dirigió al agente con instrucciones iterativas, sin editar código manualmente.

- **Aplicación 1:** Antigravity IDE
  - **Modelo:** Gemini 3.8 Flash
  - **Uso:** análisis de la consigna, extracción de la paleta del logotipo, arquitectura mobile first, diagramas interactivos, mockups, lógica accesible en JavaScript y redacción documental.

- **Aplicación 2:** GitHub Copilot en VSC
  - **Modelo:** GPT-6 Luna
- **Uso:** Ajustes y refinamiento sobre la base construida en Antigravity:
    - Modificaciones de diseño, incluidos los cambios de color.
    - Implementación de transiciones y animaciones.
    - Corrección de errores.
    - Conversión de los diagramas de SVG a HTML y CSS, con nodos clickeables.
    - Actualizar el README.
    - Agregar al README la sección de comprobación de enlaces y funcionamiento.

### Evidencia de iteración

- **Instrucción inicial:** diseñar la landing con modo nocturno y los colores del logo de Convocado.
- **Problema detectado:** los diagramas no reflejaban con claridad las condiciones y mezclaban las propuestas de diseño con los requisitos de las reglas. No estaba centrado.
- **Pedido de mejora:** migrar a componentes HTML y CSS clickeables con inspector de nodos y distinguir las propuestas de diseño de los resultados normativos.
- **Resultado:** flujogramas interactivos y responsivos que cubren los casos límite.

---

## 4. Cómo ejecutar el proyecto localmente

```bash
git clone https://github.com/celina-web/tp3-convocado.git
cd tp3-convocado
open index.html        # macOS; o bien: npx serve .
```

**Qué probar:**

1. Alternar entre modo claro y nocturno.
2. Hacer clic (o usar Tab y Enter) en los nodos de los diagramas para ver el inspector.
3. En el simulador, usar los presets: caso exitoso, fuera de radio, distancia exacta de 10 km y valoración exacta de 4,0. Comprobar que sin autorización no se envía la solicitud.
4. Abrir y cerrar los desplegables y los modales de Términos y Privacidad con teclado.
5. Revisar la vista en mobile y en desktop.

---

## 5. Enlaces

- **Repositorio:** https://github.com/celina-web/tp3-convocado
- **Landing publicada:** https://tp3-convocado-grupo13.vercel.app

---

## 6. Comprobación de enlaces y funcionamiento

Verificación realizada en Chrome (desktop) desde una ventana de incógnito, sin sesión iniciada.

| # | Qué se comprobó | Resultado |
|---|---|---|
| 1 | El repositorio abre sin sesión y muestra el README | ✅ |
| 2 | La landing publicada abre sin sesión y muestra la versión final | ✅ |
| 3 | Los enlaces del README llevan a la landing correcta | ✅ |
| 4 | El logo de Convocado se ve completo y legible | ✅ |
| 5 | La navegación del encabezado lleva a cada sección | ✅ |
| 6 | Los desplegables de R1 y R2 se abren y cierran con clic y con teclado (Tab + Enter) | ✅ |
| 7 | Los nodos de los diagramas abren el inspector con clic y con teclado | ✅ |
| 8 | Caso que cumple R1: el simulador muestra al equipo entre las opciones cercanas | ✅ |
| 9 | Caso que no cumple R2 (distancia exacta de 10 km o sin autorización): no se envía la solicitud | ✅ |
| 10 | El cambio entre modo claro y nocturno funciona | ✅ |
| 11 | Sin desbordes horizontales ni errores en la consola del navegador | ✅ |
