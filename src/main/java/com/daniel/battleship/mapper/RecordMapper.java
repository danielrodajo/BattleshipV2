package com.daniel.battleship.mapper;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.Builder;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.Record;
import com.daniel.battleship.entity.Ship;
import com.daniel.battleship.enums.RecordType;
import com.daniel.battleship.dto.BoardDTO;
import com.daniel.battleship.dto.BoxDTO;
import com.daniel.battleship.dto.EmptyBoxDTO;
import com.daniel.battleship.dto.GameDTO;
import com.daniel.battleship.dto.RecordDTO;
import com.daniel.battleship.dto.ShipDTO;
import com.daniel.battleship.dto.UserDTO;
import com.daniel.battleship.mapper.base.BaseMapper;
import com.daniel.battleship.mapper.context.BeforeMappingMapper;

@Mapper(builder = @Builder(disableBuilder = true), componentModel = "spring", collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public abstract class RecordMapper extends BeforeMappingMapper implements BaseMapper<Record, RecordDTO> {

    @Override
    public Record toEntity(RecordDTO param) {
        Record target = getMappedInstace( param, Record.class );
        if ( target != null ) {
            return target;
        }

        if ( param == null ) {
            return null;
        }

        Record record = new Record();

        record.setId(param.getId());
        record.setCreatedAt( param.getCreatedAt() );
        record.setGame( gameDTOToGame( param.getGame() ) );
        record.setPlayer( userDTOToAppUser( param.getPlayer() ) );

        return record;
    }

    @Override
    public RecordDTO toDTO(Record param) {
        RecordDTO target = getMappedInstace( param, RecordDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( param == null ) {
            return null;
        }

        RecordDTO recordDTO = new RecordDTO();

        recordDTO.setId(param.getId());
        recordDTO.setCreatedAt( param.getCreatedAt() );
        recordDTO.setGame( gameToGameDTO( param.getGame() ) );
        recordDTO.setPlayer( appUserToUserDTO( param.getPlayer() ) );
        
        if (param.getBox() != null) {
        	recordDTO.setX(param.getBox().getX());
        	recordDTO.setY(param.getBox().getY());
        	recordDTO.setType(RecordType.BOX);
        } else if (param.getEmptyBox() != null) {
        	recordDTO.setX(param.getEmptyBox().getX());
        	recordDTO.setY(param.getEmptyBox().getY());
        	recordDTO.setType(RecordType.EMPTY);
        }

        return recordDTO;
    }
    protected ShipDTO shipToShipDTO(Ship ship) {
        ShipDTO target = getMappedInstace( ship, ShipDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( ship == null ) {
            return null;
        }

        ShipDTO shipDTO = new ShipDTO();

        shipDTO.setId( ship.getId() );
        shipDTO.setShipType( ship.getShipType() );

        return shipDTO;
    }

    protected BoxDTO boxToBoxDTO(Box box) {
        BoxDTO target = getMappedInstace( box, BoxDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( box == null ) {
            return null;
        }

        BoxDTO boxDTO = new BoxDTO();

        boxDTO.setId( box.getId() );
        boxDTO.setShip( shipToShipDTO( box.getShip() ) );
        boxDTO.setTouched( box.getTouched() );
        boxDTO.setX( box.getX() );
        boxDTO.setY( box.getY() );

        return boxDTO;
    }

    protected List<BoxDTO> boxListToBoxDTOList(List<Box> list) {
        List<BoxDTO> target = getMappedInstace( list, List.class );
        if ( target != null ) {
            return target;
        }

        if ( list == null ) {
            return null;
        }

        List<BoxDTO> list1 = new ArrayList<BoxDTO>( list.size() );
        for ( Box box : list ) {
            list1.add( boxToBoxDTO( box ) );
        }

        return list1;
    }

    protected EmptyBoxDTO emptyBoxToEmptyBoxDTO(EmptyBox emptyBox) {
        EmptyBoxDTO target = getMappedInstace( emptyBox, EmptyBoxDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( emptyBox == null ) {
            return null;
        }

        EmptyBoxDTO emptyBoxDTO = new EmptyBoxDTO();

        emptyBoxDTO.setId( emptyBox.getId() );
        emptyBoxDTO.setX( emptyBox.getX() );
        emptyBoxDTO.setY( emptyBox.getY() );

        return emptyBoxDTO;
    }

    protected List<EmptyBoxDTO> emptyBoxListToEmptyBoxDTOList(List<EmptyBox> list) {
        List<EmptyBoxDTO> target = getMappedInstace( list, List.class );
        if ( target != null ) {
            return target;
        }

        if ( list == null ) {
            return null;
        }

        List<EmptyBoxDTO> list1 = new ArrayList<EmptyBoxDTO>( list.size() );
        for ( EmptyBox emptyBox : list ) {
            list1.add( emptyBoxToEmptyBoxDTO( emptyBox ) );
        }

        return list1;
    }

    protected UserDTO appUserToUserDTO(AppUser appUser) {
        UserDTO target = getMappedInstace( appUser, UserDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( appUser == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setEmail( appUser.getEmail() );
        userDTO.setFirstsurname( appUser.getFirstsurname() );
        userDTO.setId( appUser.getId() );
        userDTO.setName( appUser.getName() );
        userDTO.setNickname( appUser.getNickname() );
        userDTO.setSecondsurname( appUser.getSecondsurname() );

        return userDTO;
    }

    protected BoardDTO boardToBoardDTO(Board board) {
        BoardDTO target = getMappedInstace( board, BoardDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( board == null ) {
            return null;
        }

        BoardDTO boardDTO = new BoardDTO();

        boardDTO.setBoxes( boxListToBoxDTOList( board.getBoxes() ) );
        boardDTO.setCode( board.getCode() );
        boardDTO.setEmptyBoxes( emptyBoxListToEmptyBoxDTOList( board.getEmptyBoxes() ) );
        boardDTO.setHeight( board.getHeight() );
        boardDTO.setId( board.getId() );
        boardDTO.setOwner( appUserToUserDTO( board.getOwner() ) );
        boardDTO.setState( board.getState() );
        boardDTO.setWidth( board.getWidth() );

        return boardDTO;
    }

    protected GameDTO gameToGameDTO(Game game) {
        GameDTO target = getMappedInstace( game, GameDTO.class );
        if ( target != null ) {
            return target;
        }

        if ( game == null ) {
            return null;
        }

        GameDTO gameDTO = new GameDTO();

        gameDTO.setBoard1( boardToBoardDTO( game.getBoard1() ) );
        gameDTO.setBoard2( boardToBoardDTO( game.getBoard2() ) );
        gameDTO.setCode( game.getCode() );
        gameDTO.setCreatedAt( game.getCreatedAt() );
        gameDTO.setId( game.getId() );
        gameDTO.setState( game.getState() );
        gameDTO.setTurn( game.getTurn() );

        return gameDTO;
    }

    protected Ship shipDTOToShip(ShipDTO shipDTO) {
        Ship target = getMappedInstace( shipDTO, Ship.class );
        if ( target != null ) {
            return target;
        }

        if ( shipDTO == null ) {
            return null;
        }

        Ship ship = new Ship();

        ship.setId( shipDTO.getId() );
        ship.setShipType( shipDTO.getShipType() );

        return ship;
    }

    protected Box boxDTOToBox(BoxDTO boxDTO) {
        Box target = getMappedInstace( boxDTO, Box.class );
        if ( target != null ) {
            return target;
        }

        if ( boxDTO == null ) {
            return null;
        }

        Box box = new Box();

        box.setId( boxDTO.getId() );
        box.setShip( shipDTOToShip( boxDTO.getShip() ) );
        box.setTouched( boxDTO.getTouched() );
        box.setX( boxDTO.getX() );
        box.setY( boxDTO.getY() );

        return box;
    }

    protected List<Box> boxDTOListToBoxList(List<BoxDTO> list) {
        List<Box> target = getMappedInstace( list, List.class );
        if ( target != null ) {
            return target;
        }

        if ( list == null ) {
            return null;
        }

        List<Box> list1 = new ArrayList<Box>( list.size() );
        for ( BoxDTO boxDTO : list ) {
            list1.add( boxDTOToBox( boxDTO ) );
        }

        return list1;
    }

    protected EmptyBox emptyBoxDTOToEmptyBox(EmptyBoxDTO emptyBoxDTO) {
        EmptyBox target = getMappedInstace( emptyBoxDTO, EmptyBox.class );
        if ( target != null ) {
            return target;
        }

        if ( emptyBoxDTO == null ) {
            return null;
        }

        EmptyBox emptyBox = new EmptyBox();

        emptyBox.setId( emptyBoxDTO.getId() );
        emptyBox.setX( emptyBoxDTO.getX() );
        emptyBox.setY( emptyBoxDTO.getY() );

        return emptyBox;
    }

    protected List<EmptyBox> emptyBoxDTOListToEmptyBoxList(List<EmptyBoxDTO> list) {
        List<EmptyBox> target = getMappedInstace( list, List.class );
        if ( target != null ) {
            return target;
        }

        if ( list == null ) {
            return null;
        }

        List<EmptyBox> list1 = new ArrayList<EmptyBox>( list.size() );
        for ( EmptyBoxDTO emptyBoxDTO : list ) {
            list1.add( emptyBoxDTOToEmptyBox( emptyBoxDTO ) );
        }

        return list1;
    }

    protected AppUser userDTOToAppUser(UserDTO userDTO) {
        AppUser target = getMappedInstace( userDTO, AppUser.class );
        if ( target != null ) {
            return target;
        }

        if ( userDTO == null ) {
            return null;
        }

        AppUser appUser = new AppUser();

        appUser.setEmail( userDTO.getEmail() );
        appUser.setFirstsurname( userDTO.getFirstsurname() );
        appUser.setId( userDTO.getId() );
        appUser.setName( userDTO.getName() );
        appUser.setNickname( userDTO.getNickname() );
        appUser.setSecondsurname( userDTO.getSecondsurname() );

        return appUser;
    }

    protected Board boardDTOToBoard(BoardDTO boardDTO) {
        Board target = getMappedInstace( boardDTO, Board.class );
        if ( target != null ) {
            return target;
        }

        if ( boardDTO == null ) {
            return null;
        }

        Board board = new Board();

        board.setBoxes( boxDTOListToBoxList( boardDTO.getBoxes() ) );
        board.setCode( boardDTO.getCode() );
        board.setEmptyBoxes( emptyBoxDTOListToEmptyBoxList( boardDTO.getEmptyBoxes() ) );
        board.setHeight( boardDTO.getHeight() );
        board.setId( boardDTO.getId() );
        board.setOwner( userDTOToAppUser( boardDTO.getOwner() ) );
        board.setState( boardDTO.getState() );
        board.setWidth( boardDTO.getWidth() );

        return board;
    }

    protected Game gameDTOToGame(GameDTO gameDTO) {
        Game target = getMappedInstace( gameDTO, Game.class );
        if ( target != null ) {
            return target;
        }

        if ( gameDTO == null ) {
            return null;
        }

        Game game = new Game();

        game.setBoard1( boardDTOToBoard( gameDTO.getBoard1() ) );
        game.setBoard2( boardDTOToBoard( gameDTO.getBoard2() ) );
        game.setCode( gameDTO.getCode() );
        game.setCreatedAt( gameDTO.getCreatedAt() );
        game.setId( gameDTO.getId() );
        game.setState( gameDTO.getState() );
        game.setTurn( gameDTO.getTurn() );

        return game;
    }

}
