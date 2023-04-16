function generarBarcos() {
  // Crear una matriz de 10x10 y llenarla con ceros
  let tabla = Array(10)
    .fill()
    .map(() => Array(10).fill(0));

  // Longitudes de los barcos
  const longitudes = [2, 2, 2, 2, 3, 3, 3, 4, 4, 5];

  // Colocar cada barco en la tabla
  for (let i = 0; i < longitudes.length; i++) {
    let longitud = longitudes[i];
    let barcoColocado = false;
    let intentos = 0;
    const maxIntentos = 1000;

    while (!barcoColocado && intentos < maxIntentos) {
      // Generar una posición y una dirección aleatoria
      let fila = Math.floor(Math.random() * 10);
      let columna = Math.floor(Math.random() * 10);
      let direccion = Math.floor(Math.random() * 2);

      // Verificar que el barco cabe en la tabla
      let filaValida = direccion === 0 ? fila + longitud - 1 < 10 : fila < 10;
      let columnaValida =
        direccion === 1 ? columna + longitud - 1 < 10 : columna < 10;

      if (filaValida && columnaValida) {
        // Verificar que el barco no se superpone con otro barco o está demasiado cerca
        let barcoOk = true;
        for (let j = 0; j < longitud; j++) {
          let filaBarco = direccion === 0 ? fila + j : fila;
          let columnaBarco = direccion === 1 ? columna + j : columna;

          if (tabla[filaBarco][columnaBarco] !== 0) {
            barcoOk = false;
          }
          if (filaBarco > 0 && tabla[filaBarco - 1][columnaBarco] !== 0) {
            barcoOk = false;
          }
          if (columnaBarco > 0 && tabla[filaBarco][columnaBarco - 1] !== 0) {
            barcoOk = false;
          }
          if (filaBarco < 9 && tabla[filaBarco + 1][columnaBarco] !== 0) {
            barcoOk = false;
          }
          if (columnaBarco < 9 && tabla[filaBarco][columnaBarco + 1] !== 0) {
            barcoOk = false;
          }
           // Verificar que la celda no esté cerca de otro barco en diagonal
           if (
            (filaBarco > 0 && columnaBarco > 0 &&
              tabla[filaBarco - 1][columnaBarco - 1] !== 0) ||
            (filaBarco > 0 && columnaBarco < 9 &&
              tabla[filaBarco - 1][columnaBarco + 1] !== 0) ||
            (filaBarco < 9 && columnaBarco > 0 &&
              tabla[filaBarco + 1][columnaBarco - 1] !== 0) ||
            (filaBarco < 9 && columnaBarco < 9 &&
              tabla[filaBarco + 1][columnaBarco + 1] !== 0)
          ) {
            barcoOk = false;
          }
        }

        // Colocar el barco en la tabla si todo está bien
        if (barcoOk) {
          for (let j = 0; j < longitud; j++) {
            let filaBarco = direccion === 0 ? fila + j : fila;
            let columnaBarco = direccion === 1 ? columna + j : columna;
            tabla[filaBarco][columnaBarco] = longitud;
          }
          barcoColocado = true;
        }
      }

      intentos++;
    }

    // Si se superó el límite de iteraciones, devuelve un valor predeterminado
    if (!barcoColocado) {
      console.error(`No se pudo colocar el barco de longitud ${longitud}`);
      return null;
    }
  }

  return tabla;
}

function agruparBarcos(tabla) {
    let barcos = {
      2: [],
      3: [],
      4: [],
      5: []
    };
  
    // Recorrer la tabla y buscar los barcos
    for (let fila = 0; fila < 10; fila++) {
      for (let columna = 0; columna < 10; columna++) {
        let longitud = tabla[fila][columna];
        if (longitud > 1) {
          // Verificar si el barco ya fue encontrado
          let encontrado = false;
          for (let i = 0; i < barcos[longitud].length; i++) {
            let barco = barcos[longitud][i];
            for (let j = 0; j < barco.celdas.length; j++) {
              let celda = barco.celdas[j];
              if (celda.x === fila && celda.y === columna) {
                encontrado = true;
                break;
              }
            }
            if (encontrado) {
              barco.celdas.push({ x: fila, y: columna });
              break;
            }
          }
          // Si el barco no fue encontrado, agregarlo a la lista
          if (!encontrado) {
            let direccion;
            if (columna < 9 && tabla[fila][columna + 1] === longitud) {
              direccion = 'horizontal';
            } else {
              direccion = 'vertical';
            }
            let celdas = [{ x: fila, y: columna }];
            for (let i = 1; i < longitud; i++) {
              if (direccion === 'horizontal') {
                celdas.push({ x: fila, y: columna + i });
              } else {
                celdas.push({ x: fila + i, y: columna });
              }
            }
            let barco = { celdas: celdas };
            barcos[longitud].push(barco);
          }
        }
      }
    }
  
    return barcos;
  }