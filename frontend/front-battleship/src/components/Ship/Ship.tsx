import React, { FC } from 'react';
import styles from './Ship.module.css';

interface ShipProps {
  name: string;
  img: string;
  amount: number;
}

const Ship: FC<ShipProps> = (props) => {
  const [draggingShip, setDraggingShip] = React.useState(null);

  const handleShipDragStart = (event: any) => {
    console.log(event);
  };

  /* const handleMouseMove = (event) => {
    if (draggingShip) {
      // calcular la posición actual del barco en función de la posición del ratón
      // y actualizar el estado del barco arrastrado
      setDraggingShip({
        ...draggingShip,
        x: event.pageX - offsetX,
        y: event.pageY - offsetY,
      });
    }
  }; */

  return (
    <div
      className={`${styles.Ship} d-flex justify-content-center align-items-center`}
    >
      <div draggable onDragStart={(event) => handleShipDragStart(event)} onDragEnd={e => console.log(e)}>
        <p>{`${props.name} x${props.amount}`}</p>
        <img src={props.img} width={100} alt={`Imagen de ${props.name}`} />
      </div>
    </div>
  );
};

export default Ship;
