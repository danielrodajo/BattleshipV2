import { BoxData } from '../api/data/BoxData';
import { ShipData } from '../api/data/ShipData';
import { ShipType } from '../api/domain/ShipDomain';

interface Barcos {
  2: Celdas[];
  3: Celdas[];
  4: Celdas[];
  5: Celdas[];
}

interface Celdas {
  celdas: Coordinates[];
}

interface Coordinates {
  x: number;
  y: number;
}

const FleetGenerator = (size: number): ShipData[] => {
  let ships: ShipData[] = [];
  const result = generarBarcos(size);
  if (result) {
    ships = agruparBarcos(result, size);
  }
  return ships;
};

function generarBarcos(size: number): number[][] | null {
  // Crear una matriz de 10x10 y llenarla con ceros
  let tabla: number[][] = Array(size)
    .fill(undefined)
    .map(() => Array(size).fill(0));

  let boardTries = 0;
  const maxBoardTries = 10000;
  // Longitudes de los barcos
  const longitudes = [2, 2, 2, 2, 3, 3, 3, 4, 4, 5];

  // Colocar cada barco en la tabla
  for (let i = 0; i < longitudes.length; i++) {
    let barcoColocado = false;
    const longitud = longitudes[i];
    let intentos = 0;
    const maxIntentos = 1000;

    while (!barcoColocado && intentos < maxIntentos) {
      // Generar una posición y una dirección aleatoria
      const fila = Math.floor(Math.random() * size);
      const columna = Math.floor(Math.random() * size);
      const direccion = Math.floor(Math.random() * 2);

      // Verificar que el barco cabe en la tabla
      const filaValida =
        direccion === 0 ? fila + longitud - 1 < size : fila < size;
      const columnaValida =
        direccion === 1 ? columna + longitud - 1 < size : columna < size;

      if (filaValida && columnaValida) {
        // Verificar que el barco no se superpone con otro barco o está demasiado cerca
        let barcoOk = true;
        for (let j = 0; j < longitud; j++) {
          let filaBarco = direccion === 0 ? fila + j : fila;
          let columnaBarco = direccion === 1 ? columna + j : columna;

          if (
            tabla[filaBarco][columnaBarco] !== 0 ||
            (filaBarco > 0 && tabla[filaBarco - 1][columnaBarco] !== 0) ||
            (filaBarco < size - 1 &&
              tabla[filaBarco + 1][columnaBarco] !== 0) ||
            (columnaBarco > 0 && tabla[filaBarco][columnaBarco - 1] !== 0) ||
            (columnaBarco < size - 1 &&
              tabla[filaBarco][columnaBarco + 1] !== 0)
          ) {
            barcoOk = false;
          }
          // Verificar que la celda no esté cerca de otro barco en diagonal
          if (
            (filaBarco > 0 &&
              columnaBarco > 0 &&
              tabla[filaBarco - 1][columnaBarco - 1] !== 0) ||
            (filaBarco > 0 &&
              columnaBarco < size - 1 &&
              tabla[filaBarco - 1][columnaBarco + 1] !== 0) ||
            (filaBarco < size - 1 &&
              columnaBarco > 0 &&
              tabla[filaBarco + 1][columnaBarco - 1] !== 0) ||
            (filaBarco < size - 1 &&
              columnaBarco < size - 1 &&
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
      if (maxBoardTries > boardTries) {
        tabla = Array(size)
          .fill(undefined)
          .map(() => Array(size).fill(0));
        i = -1;
      } else {
        return null;
      }
      boardTries++;
    }
  }
  return tabla;
}

function agruparBarcos(tabla: number[][], size: number): ShipData[] {
  let barcos: Barcos = {
    2: [],
    3: [],
    4: [],
    5: [],
  };

  // Recorrer la tabla y buscar los barcos
  for (let fila = 0; fila < size; fila++) {
    for (let columna = 0; columna < size; columna++) {
      let longitud = tabla[fila][columna];
      if (longitud > 1) {
        // Verificar si el barco ya fue encontrado
        let encontrado = false;
        for (let i = 0; i < barcos[longitud as keyof Barcos].length; i++) {
          let barco = barcos[longitud as keyof Barcos][i];
          for (let j = 0; j < barco.celdas.length; j++) {
            let celda = barco.celdas[j];
            if (celda.y === fila && celda.x === columna) {
              encontrado = true;
              break;
            }
          }
          if (encontrado) {
            barco.celdas.push({ y: fila, x: columna });
            break;
          }
        }
        // Si el barco no fue encontrado, agregarlo a la lista
        if (!encontrado) {
          let direccion;
          if (columna < size - 1 && tabla[fila][columna + 1] === longitud) {
            direccion = 'horizontal';
          } else {
            direccion = 'vertical';
          }
          let celdas = [{ y: fila, x: columna }];
          for (let i = 1; i < longitud; i++) {
            if (direccion === 'horizontal') {
              celdas.push({ y: fila, x: columna + i });
            } else {
              celdas.push({ y: fila + i, x: columna });
            }
          }
          let barco = { celdas: celdas };
          barcos[longitud as keyof Barcos].push(barco);
        }
      }
    }
  }
  const ships: ShipData[] = [];
  barcos[2].forEach((ship) => {
    const boxes: BoxData[] = [];
    ship.celdas.forEach((celda) => {
      if (
        boxes.filter((box) => box.x === celda.x && box.y === celda.y).length ===
        0
      )
        boxes.push({ x: celda.x, y: celda.y, touched: false });
    });
    ships.push({
      type: ShipType.DESTROYER,
      boxes: boxes,
    });
  });
  barcos[3].forEach((ship) => {
    const boxes: BoxData[] = [];
    ship.celdas.forEach((celda) => {
      if (
        boxes.filter((box) => box.x === celda.x && box.y === celda.y).length ===
        0
      )
        boxes.push({ x: celda.x, y: celda.y, touched: false });
    });
    ships.push({
      type: ShipType.SUBMARINE,
      boxes: boxes,
    });
  });
  barcos[4].forEach((ship) => {
    const boxes: BoxData[] = [];
    ship.celdas.forEach((celda) => {
      if (
        boxes.filter((box) => box.x === celda.x && box.y === celda.y).length ===
        0
      )
        boxes.push({ x: celda.x, y: celda.y, touched: false });
    });
    ships.push({
      type: ShipType.BATTLESHIP,
      boxes: boxes,
    });
  });
  barcos[5].forEach((ship) => {
    const boxes: BoxData[] = [];
    ship.celdas.forEach((celda) => {
      if (
        boxes.filter((box) => box.x === celda.x && box.y === celda.y).length ===
        0
      )
        boxes.push({ x: celda.x, y: celda.y, touched: false });
    });
    ships.push({
      type: ShipType.CARRIER,
      boxes: boxes,
    });
  });

  return ships;
}

export default FleetGenerator;
